export interface Certification {
  name: string;
  icon?: string;
  validFrom?: string;
  validTo?: string;
}

export interface Verifications {
  businessEmail?: boolean;
  businessRegistration?: boolean;
  representativeProfile?: boolean;
}

export interface ImportExport {
  shipments?: number;
  suppliers?: number;
  volume?: string;
  exportShipments?: number;
  exportSuppliers?: number;
  exportVolume?: string;
}

export interface Price {
  current: number;
  range: {
    min: number;
    max: number;
  };
}

export interface ProductDetails {
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
}

export interface Shipping {
  hsCode: string;
  minQuantity: string;
  packaging: string;
  transportMode: string;
  incoterms: string;
  shelfLife: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
} 