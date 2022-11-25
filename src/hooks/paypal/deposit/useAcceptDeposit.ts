import { API } from "api";
import { ACCEPT_PAYPAL_DEPOSIT } from "../constants";
import { useMutation } from "react-query";
import { config } from "../config";
import { AcceptPaypalDepositBody } from "../types";

export const acceptDeposit = (body: AcceptPaypalDepositBody) => {
  return API.post(config)(`/admin/paypal_deposit/accept/${body.depositId}`);
};

export const useAcceptPaypalDeposit = () => {
  const mutation = useMutation(
    [ACCEPT_PAYPAL_DEPOSIT],
    (body: AcceptPaypalDepositBody) => {
      return acceptDeposit(body);
    }
  );
  return mutation;
};
