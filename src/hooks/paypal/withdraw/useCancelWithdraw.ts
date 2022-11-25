import { API } from "api";
import { CANCEL_PAYPAL_WITHDRAW } from "../constants";
import { useMutation } from "react-query";
import { config } from "../config";
import { CancelPaypalWithdrawBody } from "../types";

export const cancelDeposit = (body: CancelPaypalWithdrawBody) => {
  return API.post(config)(`/admin/paypal_withdraw/reject/${body.withdrawId}`);
};

export const useCancelPaypalWithdraw = () => {
  const mutation = useMutation(
    [CANCEL_PAYPAL_WITHDRAW],
    (body: CancelPaypalWithdrawBody) => {
      return cancelDeposit(body);
    }
  );
  return mutation;
};
