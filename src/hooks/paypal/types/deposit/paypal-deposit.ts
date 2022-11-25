export interface IPaypalDeposit {
  id: string;
  memberId: string;
  uid: string;
  paypalTransactionId: string;
  amount: number;
  depositFee: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
