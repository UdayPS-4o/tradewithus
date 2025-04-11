// Define interfaces based on backend models

export interface Verification {
  businessEmail?: boolean;
  businessRegistration?: boolean;
  representativeProfile?: boolean;
}

export interface Certification {
  name: string;
  icon?: string;
  validFrom?: string;
  validTo?: string;
}

export interface ImportExport {
  shipments?: number;
  suppliers?: number;
  volume?: string;
  exportShipments?: number;
  exportSuppliers?: number;
  exportVolume?: string;
}

// Renamed from Company to Profile for consistency with backend
export interface Profile {
  _id?: string; // Keep MongoDB _id if needed
  profileId: string;
  businessName?: string;
  logo?: string;
  coverImage?: string;
  isPro?: boolean;
  isVerified?: boolean;
  revenue?: string;
  employeeCount?: string;
  businessOverview: string;
  businessType: string;
  origin: string;
  established: number;
  exportVolume?: string;
  website?: string;
  address: string;
  mobile?: string;
  owner: string;
  verifications?: Verification;
  certifications?: Certification[];
  importExport?: ImportExport;
}

interface Price {
  current: number;
  range: {
    min: number;
    max: number;
  };
}

interface ProductDetails {
  name: string;
  product: string;
  origin: string; // Corresponds to Origin
  productionCapacity: string;
  exportVolume: string;
  formAndCut: string; // Corresponds to FormAndCut
  color: string; // Corresponds to Colour
  cultivationType: string; // Corresponds to CultivationType
  moisture?: string; // Corresponds to Moisture
  forecast?: string; // Corresponds to Forecast
}

interface ShippingDetails {
  hsCode: string;
  minQuantity: string;
  packaging: string; // Corresponds to PackingDetails
  transportMode: string;
  incoterms: string;
  shelfLife: string;
}

export interface Product {
  _id: string; // Or use id if you prefer
  productId: string;
  productName: string;
  images: string[];
  sellerId: string;
  seller?: Profile; // Optional: if you embed seller details
  price: {
    current: number;
    range: {
      min: number;
      max: number;
    };
  };
  details: {
    name: string;
    product: string;
    origin: string;
    productionCapacity: string;
    exportVolume: string;
    formAndCut: string;
    color: string;
    cultivationType: string;
    moisture?: string;
    forecast?: string;
  };
  shipping: {
    hsCode: string;
    minQuantity: string;
    packaging: string;
    transportMode: string;
    incoterms: string;
    shelfLife: string;
  };
  // Add other fields if necessary based on your data model
}