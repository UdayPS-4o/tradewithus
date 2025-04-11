import mongoose, { Schema, Document } from 'mongoose';

interface IVerification {
  businessEmail?: boolean;
  businessRegistration?: boolean;
  representativeProfile?: boolean;
}

interface ICertification {
  name: string;
  icon: string;
  validFrom: string;
  validTo: string;
}

interface IImportExport {
  shipments?: number;
  suppliers?: number;
  volume?: string;
  exportShipments?: number;
  exportSuppliers?: number;
  exportVolume?: string;
}

export interface IProfile extends Document {
  profileId: string;
  businessName: string;
  logo: string;
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
  verifications?: IVerification;
  certifications?: ICertification[];
  importExport?: IImportExport;
}

const VerificationSchema: Schema = new Schema({
  businessEmail: { type: Boolean },
  businessRegistration: { type: Boolean },
  representativeProfile: { type: Boolean }
}, { _id: false });

const CertificationSchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String },
  validFrom: { type: String },
  validTo: { type: String }
}, { _id: false });

const ImportExportSchema: Schema = new Schema({
  shipments: { type: Number },
  suppliers: { type: Number },
  volume: { type: String },
  exportShipments: { type: Number },
  exportSuppliers: { type: Number },
  exportVolume: { type: String }
}, { _id: false });

const ProfileSchema: Schema = new Schema({
  profileId: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  logo: { type: String },
  coverImage: { type: String },
  isPro: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  revenue: { type: String },
  employeeCount: { type: String },
  businessOverview: { type: String },
  businessType: { type: String },
  origin: { type: String },
  established: { type: Number },
  exportVolume: { type: String },
  website: { type: String },
  address: { type: String },
  mobile: { type: String },
  owner: { type: String },
  verifications: { type: VerificationSchema },
  certifications: [{ type: CertificationSchema }],
  importExport: { type: ImportExportSchema }
});

ProfileSchema.virtual('age').get(function(this: { established: number }) {
  const currentYear = new Date().getFullYear();
  const companyAge = currentYear - this.established;
  return `${companyAge} Years Old`;
});

export default mongoose.model<IProfile>('Profile', ProfileSchema); 