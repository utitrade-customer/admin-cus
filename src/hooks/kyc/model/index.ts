export enum TypeOfKycDocument {
  Passport = 'passport',
  Driver = 'driver',
  IdentifyCard = 'identify card',
}
export type StatusKYC = 'process' | 'verify' | 'failed';
export interface KYCAttributes {
  id: number;
  uid: string;
  fullname: string;
  document: TypeOfKycDocument;
  nationality: string;
  document_number: string;
  residential_address: string;
  city: string;
  country: string;
  postal_code: string;
  date_of_birth: string;
  photo_document: string;
  user_photo: string;
  status?: StatusKYC;
  update_at: string;
  reason?: string;
  user_ip: string;
  repeat_ip?: string;
  email?: string;
  old_photo?: string;
  total_submit?: number;
  document_photo?: string;
}
export interface KYCListResponse {
  users: KYCAttributes[];
  total: number;
}
