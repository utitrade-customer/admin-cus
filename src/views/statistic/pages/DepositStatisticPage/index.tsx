import { Button, DatePicker, Input, Space, Table } from 'antd';
import CurrencyIcon from 'components/CurrencyIcon';
import { formatNumber } from 'helpers/formatNumber';
import { useFetchStatisticDeposit } from 'hooks/statistic/deposit';
import { toString } from 'lodash';
import moment from 'moment';
import React from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { exportFileExcel } from '@/views/statistic/helpers/exportCSV';
import Style from './style';

const { RangePicker } = DatePicker;

const PAGE = 1;
const SIZE = 10;

const DepositStatisticPage = () => {
  const dateFormat = 'MM/DD/YYYY';
  const [timeState, setTimeState] = React.useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  const { data, isFetching, refetch } = useFetchStatisticDeposit({
    start_date: timeState.start_date.toDateString(),
    end_date: timeState.end_date.toDateString(),
  });
  const [pagination, SetPagination] = React.useState({
    current: PAGE,
    pageSize: SIZE,
  });

  const [searchValue, setSearchValue] = React.useState('');
  const columns: any = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
      render: (_1: any, _2: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Currency ID',
      dataIndex: 'currency_id',
      key: 'currency',
      render: (record: string) => (
        <span
          className='d-flex'
          style={{
            alignItems: 'center',
          }}
        >
          <CurrencyIcon
            currency_id={record}
            isCircle={true}
            style={{
              height: '1.75rem',
              marginRight: '1rem',
            }}
          />
          {record.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: (record: string) => formatNumber(Number(record)),
    },
  ];
  const convertDataExport =
    data
      ?.sort((prev, next) => next.profit - prev.profit)
      .map((item, index) => ({
        Serial: +(index + 1),
        // eslint-disable-next-line
        ['Currency ID']: item.currency_id.toUpperCase(),
        // eslint-disable-next-line
        ['Profit']: formatNumber(Number(item.profit)),
      })) || [];

  return (
    <Style className='deposit-statistic'>
      <div className='header d-flex justify-content-between'>
        <div className='header__search w-50'>
          <Space direction='vertical'>
            <Input
              placeholder='Search coin in here .....'
              addonAfter={<BsSearch cursor='pointer' />}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Space>
        </div>

        <div className='header__options w-50 d-flex justify-content-end'>
          <Button
            type='primary'
            className='btn-get_report d-flex justify-content-center align-items-center'
            style={{
              marginRight: '1em',
            }}
            onClick={() =>
              exportFileExcel({
                csvData: convertDataExport || [],
                fileName: `Statistic-Deposit${timeState.start_date.toDateString()}-${timeState.end_date.toDateString()}`,
              })
            }
          >
            <AiOutlineDownload />
            Get report
          </Button>

          <RangePicker
            style={{
              marginLeft: '1em',
            }}
            defaultValue={[
              moment(timeState.start_date, dateFormat),
              moment(timeState.end_date, dateFormat),
            ]}
            format={dateFormat}
            onChange={(date) => {
              setTimeState({
                start_date: new Date(toString(date?.[0]?.format(dateFormat))),
                end_date: new Date(toString(date?.[1]?.format(dateFormat))),
              });
            }}
          />
          <Button
            type='text'
            className='btn-get_report d-flex justify-content-center align-items-center'
            style={{
              marginLeft: '1em',
            }}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        dataSource={
          data
            ?.sort((prev, next) => next.profit - prev.profit)
            .filter((item) =>
              item.currency_id
                .toLocaleLowerCase()
                .includes(searchValue.trim().toLowerCase())
            ) || []
        }
        pagination={{
          ...pagination,
          total: data?.length || 0,
        }}
        onChange={(pagination) => {
          SetPagination({
            current: pagination.current || PAGE,
            pageSize: pagination.pageSize || SIZE,
          });
        }}
        columns={columns}
        style={{
          marginTop: '1.5em',
        }}
        loading={isFetching}
      />
    </Style>
  );
};

export default DepositStatisticPage;
