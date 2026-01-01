class AIService {
  async analyzeImage(imageBuffer, scanType) {
    try {
      const startTime = Date.now();
      const category = await this.classifyImage(imageBuffer);
      
      if (category === 'invalid' || category === 'other') {
        return {
          success: false,
          message: 'Image does not contain recognizable crops or animals',
          detectedCategory: category,
          processingTime: Date.now() - startTime
        };
      }

      const diagnosis = await this.detectDisease(imageBuffer, category, scanType);
      
      return {
        success: true,
        detectedCategory: category,
        diagnosis: diagnosis,
        recommendations: await this.getRecommendations(diagnosis, category),
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to analyze image',
        error: error.message
      };
    }
  }

  async classifyImage(imageBuffer) {
    const categories = ['crop', 'animal', 'other'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  async detectDisease(imageBuffer, category, scanType) {
    const diseases = {
      crop: ['Leaf Rust', 'Powdery Mildew', 'Blight', 'Mosaic Virus', 'Root Rot'],
      animal: ['Foot and Mouth Disease', 'Mastitis', 'Pneumonia', 'Parasitic Infection']
    };

    const severities = ['mild', 'moderate', 'severe'];
    const selectedDisease = diseases[category][Math.floor(Math.random() * diseases[category].length)];
    
    return {
      disease: selectedDisease,
      confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
      severity: severities[Math.floor(Math.random() * severities.length)],
      affectedArea: category === 'crop' ? 'leaves' : 'general'
    };
  }

  async getRecommendations(diagnosis, category) {
    return [
      {
        type: 'Treatment',
        product: category === 'crop' ? 'Fungicide' : 'Veterinary Medicine',
        dosage: '2ml per liter',
        timing: 'Apply early morning'
      }
    ];
  }

  async chatbot(userMessage, userType) {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
      'disease': 'Use our image scanning feature to identify diseases.',
      'price': 'Check our marketplace for current prices.',
      'financial': `Track income and expenses in the Finance section.`,
      'default': `I can help with farming, prices, financial management, and more!`
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerMessage.includes(keyword)) {
        return { success: true, response: response };
      }
    }

    return { success: true, response: responses.default };
  }
}

module.exports = new AIService();
