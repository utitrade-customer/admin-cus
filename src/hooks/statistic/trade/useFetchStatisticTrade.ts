import { notification } from 'antd';
import { API } from 'api';
import { toString } from 'lodash';
import { useQuery } from 'react-query';
import { configStatistic } from '../config';
import { FETCH_TRADE_STATISTIC } from '../constants';
import { StatisticsResponse } from '../model';

interface FetchStatisticParams {
  start_date: string;
  end_date: string;
}
export const fetchStatisticTrade = (params: FetchStatisticParams) => {
  const { start_date, end_date } = params;
  return API.get(configStatistic)(
    `/trade?start_date=${toString(start_date)}&end_date=${toString(end_date)}`
  );
};

export const useFetchStatisticTrade = (params: FetchStatisticParams) => {
  const timeStart = new Date(params.start_date).getTime();
  const timeEnd = new Date(params.end_date).getTime();
  console.log('run fetch');

  const LIMIT_DAY = 90;
  const timeDifference = Math.abs(timeStart - timeEnd);
  const differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (differentDays > LIMIT_DAY) {
    notification.error({
      message: 'Time range must be less than 90 days',
      duration: 0.75,
    });
  }
  return useQuery<StatisticsResponse[]>(
    [FETCH_TRADE_STATISTIC, params.start_date, params.end_date],
    () => fetchStatisticTrade(params),
    {
      refetchInterval: false,
      enabled: differentDays <= LIMIT_DAY,
      refetchOnWindowFocus: false,
    }
  );
};
