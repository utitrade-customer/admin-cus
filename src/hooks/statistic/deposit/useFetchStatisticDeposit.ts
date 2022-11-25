import { notification } from 'antd';
import { API } from 'api';
import { toString } from 'lodash';
import { useQuery } from 'react-query';
import { configStatistic } from '../config';
import { FETCH_DEPOSIT_STATISTIC } from '../constants';
import { StatisticsResponse } from '../model';

interface FetchStatisticParams {
  start_date: string;
  end_date: string;
}
export const fetchStatisticDeposit = (params: FetchStatisticParams) => {
  const { start_date, end_date } = params;
  return API.get(configStatistic)(
    `/deposit?start_date=${toString(start_date)}&end_date=${toString(end_date)}`
  );
};

export const useFetchStatisticDeposit = (params: FetchStatisticParams) => {
  const timeStart = new Date(params.start_date).getTime();
  const timeEnd = new Date(params.end_date).getTime();

  const timeDifference = Math.abs(timeStart - timeEnd);
  const differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (differentDays > 90) {
    notification.error({
      message: 'Time range must be less than 90 days',
      duration: 0.75,
    });
  }
  return useQuery<StatisticsResponse[]>(
    [FETCH_DEPOSIT_STATISTIC, params.start_date, params.end_date],
    () => fetchStatisticDeposit(params),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      refetchInterval: false,
      enabled: differentDays <= 90,
    }
  );
};
