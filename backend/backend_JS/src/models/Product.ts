import mongoose, { Schema, Document } from 'mongoose';

interface IPrice {
  current: number;
  range: {
    min: number;
    max: number;
  };
}

interface IProductDetails {
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

interface IShippingDetails {
  hsCode: string;
  minQuantity: string;
  packaging: string;
  transportMode: string;
  incoterms: string;
  shelfLife: string;
}

export interface IProduct extends Document {
  productId: string;
  productName: string;
  images: string[];
  sellerId: string;
  price: IPrice;
  details: IProductDetails;
  shipping: IShippingDetails;
}

const PriceSchema: Schema = new Schema({
  current: { type: Number, required: true },
  range: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  }
}, { _id: false });

const ProductDetailsSchema: Schema = new Schema({
  name: { type: String, required: true },
  product: { type: String, required: true },
  origin: { type: String, required: true },
  productionCapacity: { type: String },
  exportVolume: { type: String },
  formAndCut: { type: String },
  color: { type: String },
  cultivationType: { type: String },
  moisture: { type: String },
  forecast: { type: String }
}, { _id: false });

const ShippingDetailsSchema: Schema = new Schema({
  hsCode: { type: String },
  minQuantity: { type: String },
  packaging: { type: String },
  transportMode: { type: String },
  incoterms: { type: String },
  shelfLife: { type: String }
}, { _id: false });

const ProductSchema: Schema = new Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  images: [{ type: String }],
  sellerId: { type: String, required: true, index: true },
  price: { type: PriceSchema, required: true },
  details: { type: ProductDetailsSchema, required: true },
  shipping: { type: ShippingDetailsSchema, required: true }
}, { 
  timestamps: true,
  toJSON: { virtuals: false },
  toObject: { virtuals: false }
});

export default mongoose.model<IProduct>('Product', ProductSchema); 