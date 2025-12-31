export type AppRole = 'farmer_large' | 'farmer_small' | 'buyer' | 'seller';

export type FarmerType = 'large_scale' | 'small_scale';
export type SellerType = 'farm_inputs' | 'equipment' | 'labor' | 'consultant';
export type BuyerType = 'individual' | 'business';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  county: string | null;
  national_id: string | null;
  avatar_url: string | null;
  farmer_type: FarmerType | null;
  seller_type: SellerType | null;
  buyer_type: BuyerType | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  county?: string;
  role: AppRole;
  farmer_type?: FarmerType;
  seller_type?: SellerType;
  buyer_type?: BuyerType;
}

export const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga',
  'Wajir', 'West Pokot'
];

export const ROLE_LABELS: Record<AppRole, string> = {
  farmer_large: 'Large Scale Farmer',
  farmer_small: 'Small Scale Farmer',
  buyer: 'Buyer',
  seller: 'Seller'
};

export const SELLER_TYPE_LABELS: Record<SellerType, string> = {
  farm_inputs: 'Farm Inputs (Seeds, Fertilizers)',
  equipment: 'Equipment Rental',
  labor: 'Labor Services',
  consultant: 'Expert Consultations'
};

export const BUYER_TYPE_LABELS: Record<BuyerType, string> = {
  individual: 'Individual Buyer',
  business: 'Business Buyer'
};