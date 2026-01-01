import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { image, scan_type } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = scan_type === "crop"
      ? `You are an expert agricultural pathologist specializing in crop diseases. Analyze the provided image and determine:
1. If this is a valid crop/plant image (leaves, stems, fruits, etc.)
2. If valid, identify any diseases, pests, or health issues
3. Provide diagnosis, treatment recommendations, and prevention tips

IMPORTANT: If the image is NOT a plant/crop (e.g., a person, object, landscape without crops), respond with:
{
  "isValid": false,
  "message": "Please upload a clear image of a crop or plant for disease analysis."
}

If it IS a valid plant image, respond with JSON:
{
  "isValid": true,
  "diagnosis": "Disease name or 'Healthy plant'",
  "confidence": 0.0-1.0,
  "isHealthy": true/false,
  "severity": "low/medium/high",
  "treatment": ["Treatment step 1", "Treatment step 2"],
  "prevention": ["Prevention tip 1", "Prevention tip 2"]
}`
      : `You are an expert veterinarian specializing in livestock health. Analyze the provided image and determine:
1. If this is a valid livestock/animal image
2. If valid, identify any diseases, injuries, or health issues
3. Provide diagnosis, treatment recommendations, and prevention tips

IMPORTANT: If the image is NOT a livestock animal (e.g., a person, object, wild animal), respond with:
{
  "isValid": false,
  "message": "Please upload a clear image of livestock (cattle, goats, sheep, poultry, etc.) for health analysis."
}

If it IS a valid livestock image, respond with JSON:
{
  "isValid": true,
  "diagnosis": "Condition name or 'Healthy animal'",
  "confidence": 0.0-1.0,
  "isHealthy": true/false,
  "severity": "low/medium/high",
  "treatment": ["Treatment step 1", "Treatment step 2"],
  "prevention": ["Prevention tip 1", "Prevention tip 2"]
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image for disease detection:" },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add AI credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid AI response format");
    }

    if (!result.isValid) {
      return new Response(JSON.stringify({ error: result.message || "Invalid image type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save scan to database
    const { error: insertError } = await supabaseClient
      .from("ai_scans")
      .insert({
        user_id: user.id,
        scan_type,
        result: {
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          isHealthy: result.isHealthy,
          severity: result.severity || "low",
          treatment: result.treatment || [],
          prevention: result.prevention || [],
        },
      });

    if (insertError) {
      console.error("Failed to save scan:", insertError);
    }

    return new Response(JSON.stringify({
      diagnosis: result.diagnosis,
      confidence: result.confidence,
      isHealthy: result.isHealthy,
      severity: result.severity || "low",
      treatment: result.treatment || [],
      prevention: result.prevention || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Disease scanner error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
