import { IPaypalDeposit } from "./paypal-deposit";

export interface GetPaypalDepositListResponse {}

export interface GetPaypalDepositByIdResponse {
  announcement: IPaypalDeposit;
}
