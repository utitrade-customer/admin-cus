import {
  Search,
  useDeleteBlackList,
  useFetchBlackListKYC,
  useSearchBlackList,
} from '@/hooks';
import { KYCAttributes } from '@/hooks/kyc/model';
import { Button, Input, notification, Select, Space, Table } from 'antd';
import format from 'date-fns/format';
import { toUpper } from 'lodash';
import React from 'react';
import { BiRefresh } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Style from './style';

const { Option } = Select;

const PAGE = 1;
const SIZE = 10;
const KYCBlackListPage = () => {
  const navigate = useNavigate();

  // state
  const [searchState, setSearchState] = React.useState<{
    type: Search;
    value: string;
  }>({
    type: 'uid',
    value: '',
  });
  const [pagination, SetPagination] = React.useState({
    page: PAGE,
    size: SIZE,
  });
  const [isSubmitSearch, setIsSubmitSearch] = React.useState(false);

  // hooks
  const mutation = useDeleteBlackList();
  const {
    data: kyc_list,
    isFetching,
    refetch,
  } = useFetchBlackListKYC({
    ...pagination,
  });

  const { data: search_list, isFetching: isSearchLoading } = useSearchBlackList(
    {
      uid: searchState.value,
      enabled: searchState.value.trim() !== '' && isSubmitSearch,
    }
  );

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
    </Select>
  );

  React.useEffect(() => {
    if (mutation.isLoading) {
      notification.open({
        message: `Deleting...`,
      });
    }
    notification.destroy();
    if (mutation.isSuccess) {
      notification.success({
        message: `Delete Successfully`,
      });
      refetch();
    }
    if (mutation.error) {
      notification.warning({
        message: `Delete Failed`,
      });
    }
    // eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isLoading, mutation.isSuccess, mutation.error]);
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
      title: 'Ip Address',
      dataIndex: 'user_ip',
      key: 'user_ip',
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Document Photo',
      dataIndex: 'document_photo',
      key: 'document_photo',
      render: (_1: any, record: KYCAttributes) => {
        return (
          <div className='user_photo'>
            <input type='image' src={record.document_photo} alt='photo' />
          </div>
        );
      },
    },
    {
      title: 'Update At',
      dataIndex: 'update_at',
      key: 'update_at',
      render: function (_1: any, record: KYCAttributes) {
        return (
          <div>{format(new Date(record.update_at), 'yyyy-MM-dd HH:mm:ss')}</div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: function () {
        return <div className='status--failed'>Failed</div>;
      },
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text: string, record: KYCAttributes) => (
        <div className='d-flex'>
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
            Detail
          </Button>
          <Button
            type='ghost'
            className='status--failed'
            onClick={() =>
              mutation.mutate({
                uid: record.uid,
              })
            }
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const handleRefresh = () => {
    setIsSubmitSearch(false);
    refetch();
  };
  const data = search_list?.users && isSubmitSearch ? search_list : kyc_list;

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
                setSearchState({
                  ...searchState,
                  value: toUpper(e.target.value),
                })
              }
              addonAfter={
                <BsSearch
                  cursor='pointer'
                  onClick={() => setIsSubmitSearch(true)}
                />
              }
            />
          </Space>
        </div>
        <div className='d-flex justify-content-end w-50'>
          <Button
            type='primary'
            className='d-flex justify-content-center align-items-center'
            onClick={() => handleRefresh()}
          >
            <BiRefresh fontSize='1.25rem' /> Refresh
          </Button>
        </div>
      </div>

      <Table
        dataSource={data?.users}
        columns={columns}
        loading={isFetching || isSearchLoading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.size,
          total: kyc_list?.total,
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

export default KYCBlackListPage;
