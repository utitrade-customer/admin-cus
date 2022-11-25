import { API } from "api";
import { useQuery } from "react-query";
import { config } from "../config";
import { FETCH_PAYPAL_DEPOSIT } from "../constants";
import { IPaypalDeposit } from "../types";

export const fetchPaypalDepositList = (query?: string) => {
  if (query) {
    return API.get(config)(`/admin/paypal_deposit/search?query=${query}`);
  }
  return API.get(config)(`/admin/paypal_deposit/search`);
};

export const useFetchPaypalDepositList = (query?: string) => {
  return useQuery<IPaypalDeposit[]>(
    [FETCH_PAYPAL_DEPOSIT, query],
    () => fetchPaypalDepositList(query),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );
};
