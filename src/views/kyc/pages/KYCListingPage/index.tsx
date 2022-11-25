import { Button, Input, Radio, Select, Space, Table } from 'antd';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Search, useFetchListKYC, useSearchKYC } from 'hooks';
import { KYCAttributes, StatusKYC } from 'hooks/kyc/model';
import { startCase, toUpper } from 'lodash';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Style from './style';

const { Option } = Select;

const PAGE = 1;
const SIZE = 10;
const KYCListingPage = () => {
  const navigate = useNavigate();
  // useState
  const [pagination, SetPagination] = React.useState({
    page: PAGE,
    size: SIZE,
  });
  const [statusState, setStatusState] = React.useState<StatusKYC | 'search'>(
    'process'
  );
  const [searchState, setSearchState] = React.useState<{
    type: Search;
    value: string;
  }>({
    type: 'uid',
    value: '',
  });
  const [isSubmitSearch, setIsSubmitSearch] = React.useState(false);

  // hooks
  const { data: kyc_list, isLoading } = useFetchListKYC({
    ...pagination,
    status: statusState,
  });
  const { data: search_list, isFetching: isSearchLoading } = useSearchKYC({
    ...searchState,
    enabled:
      statusState === 'search' &&
      searchState.value.trim() !== '' &&
      isSubmitSearch,
  });

  const handleSearch = () => {
    setIsSubmitSearch(true);
    setStatusState('search');
  };
  React.useEffect(() => {
    SetPagination({
      size: SIZE,
      page: PAGE,
    });
  }, [statusState]);

  React.useEffect(() => {
    if (search_list) setIsSubmitSearch(false);
  }, [search_list]);

  React.useEffect(() => {
    if (statusState !== 'search') {
      setSearchState({
        ...searchState,
        value: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusState, searchState.type]);
  // class
  const searchActiveClass = clsx(statusState === 'search' && 'status--search');
  const processActiveClass = clsx(
    statusState === 'process' && 'status--process'
  );
  const failedActiveClass = clsx(statusState === 'failed' && 'status--failed');
  const verifyActiveClass = clsx(statusState === 'verify' && 'status--verify');
  const getColorStatus = (status: StatusKYC) => {
    switch (status) {
      case 'process':
        return 'status--process';
      case 'failed':
        return 'status--failed';
      case 'verify':
        return 'status--verify';
      default:
        return 'status';
    }
  };
  const selectBefore = (
    <Select
      defaultValue='uid'
      className='select-before'
      onChange={(value) => {
        setSearchState({
          type: value as Search,
          value: '',
        });
      }}
    >
      <Option value='uid'>UID</Option>
      <Option value='email'>Email</Option>
    </Select>
  );
  const columns: any = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
      render: (_1: any, _2: any, index: number) =>
        (pagination.page - 1) * pagination.size + index + 1,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: 'Fullname',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'User Photo',
      dataIndex: 'user_photo',
      key: 'user_photo',
      render: (_1: any, record: KYCAttributes) => {
        return (
          <div className='user_photo'>
            <input type='image' src={record.user_photo} alt='photo' />
          </div>
        );
      },
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Update At',
      dataIndex: 'update_at',
      key: 'update_at',
      render: function (_1: string, record: KYCAttributes) {
        return (
          <div>{format(new Date(record.update_at), 'yyyy-MM-dd HH:mm:ss')}</div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: function (text: StatusKYC) {
        return <div className={getColorStatus(text)}>{startCase(text)}</div>;
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text: string, record: KYCAttributes) => (
        <Button
          type='primary'
          onClick={() =>
            navigate(
              `/dashboard/kyc/detail/${record.uid}/${record.update_at}`,
              {
                state: 'KYC Detail',
              }
            )
          }
        >
          Update
        </Button>
      ),
    },
  ];
  return (
    <Style className='kyc-listing-page'>
      <div className='header d-flex flex-wrap justify-content-between'>
        <div className='header__search'>
          <Space direction='vertical'>
            <Input
              addonBefore={selectBefore}
              placeholder='Search kyc in here .....'
              value={searchState.value}
              onChange={(e) =>
                searchState.type === 'uid'
                  ? setSearchState({
                      ...searchState,
                      value: toUpper(e.target.value),
                    })
                  : setSearchState({ ...searchState, value: e.target.value })
              }
              addonAfter={
                <BsSearch cursor='pointer' onClick={() => handleSearch()} />
              }
            />
          </Space>
        </div>
        <div className='d-flex justify-content-end'>
          <Radio.Group
            value={statusState}
            onChange={(e) => setStatusState(e.target.value)}
          >
            <Radio.Button className={searchActiveClass} value='search'>
              List Of Search
            </Radio.Button>
            <Radio.Button className={processActiveClass} value='process'>
              Process
            </Radio.Button>
            <Radio.Button className={failedActiveClass} value='failed'>
              Failed
            </Radio.Button>
            <Radio.Button className={verifyActiveClass} value='verify'>
              Verify
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <Table
        dataSource={
          statusState === 'search' ? search_list?.users : kyc_list?.users
        }
        columns={columns}
        loading={statusState === 'search' ? isSearchLoading : isLoading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.size,
          total:
            statusState === 'search' ? search_list?.total : kyc_list?.total,
        }}
        onChange={(pagination) => {
          SetPagination({
            page: pagination.current || PAGE,
            size: pagination.pageSize || SIZE,
          });
        }}
        style={{
          marginTop: '1.5em',
        }}
      />
    </Style>
  );
};

export default React.memo(KYCListingPage);
