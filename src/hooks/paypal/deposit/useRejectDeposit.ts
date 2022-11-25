import { API } from "api";
import { ACCEPT_PAYPAL_DEPOSIT } from "../constants";
import { useMutation } from "react-query";
import { config } from "../config";
import { RejectPaypalDepositBody } from "../types";

export const rejectDeposit = (body: RejectPaypalDepositBody) => {
  return API.post(config)(`/admin/paypal_deposit/reject/${body.depositId}`);
};

export const useRejectPaypalDeposit = () => {
  const mutation = useMutation(
    [ACCEPT_PAYPAL_DEPOSIT],
    (body: RejectPaypalDepositBody) => {
      return rejectDeposit(body);
    }
  );
  return mutation;
};
