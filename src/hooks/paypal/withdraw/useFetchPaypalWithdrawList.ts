import { API } from "api";
import { useQuery } from "react-query";
import { config } from "../config";
import { FETCH_PAYPAL_WITHDRAW } from "../constants";
import { IPaypalWithdraw } from "../types";

export const fetchPaypalWithdrawList = (query?: string) => {
  if (query) {
    return API.get(config)(`/admin/paypal_withdraw/list?query=${query}`);
  }
  return API.get(config)(`/admin/paypal_withdraw/list`);
};

export const useFetchPaypalWithdrawList = (query?: string) => {
  return useQuery<IPaypalWithdraw[]>(
    [FETCH_PAYPAL_WITHDRAW, query],
    () => fetchPaypalWithdrawList(query),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );
};
