export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  type: 'Residential' | 'Commercial' | 'Community' | 'Land';
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  status: 'available' | 'reserved' | 'sold';
  imageUrl: string;
  createdAt: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  location: string;
  price: number;
  currency?: string;
  type?: 'Residential' | 'Commercial' | 'Community' | 'Land';
  bedrooms?: number;
  bathrooms?: number;
  areaSqFt?: number;
  imageUrl?: string;
}
