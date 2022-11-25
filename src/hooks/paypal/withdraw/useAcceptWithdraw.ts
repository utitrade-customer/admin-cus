import { API } from "api";
import { ACCEPT_PAYPAL_DEPOSIT } from "../constants";
import { useMutation } from "react-query";
import { config } from "../config";
import { AcceptPaypalWithdrawBody } from "../types";

export const acceptDeposit = (body: AcceptPaypalWithdrawBody) => {
  return API.post(config)(`/admin/paypal_withdraw/approve/${body.withdrawId}`, {
    paypalTransactionId: body.paypalTransactionId,
  });
};

export const useAcceptPaypalWithdraw = () => {
  const mutation = useMutation(
    [ACCEPT_PAYPAL_DEPOSIT],
    (body: AcceptPaypalWithdrawBody) => {
      return acceptDeposit(body);
    }
  );
  return mutation;
};
