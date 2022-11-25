export interface IPaypalWithdraw {
  id: string;
  memberId: string;
  uid: string;
  amount: number;
  depositFee: number;
  aasmState: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcceptPaypalWithdrawBody {
  withdrawId: string;
  paypalTransactionId: string;
}

export interface CancelPaypalWithdrawBody {
  withdrawId: string;
}
