import { Button, Input, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { CurrencyIcon } from 'components';
import { useDeleteChildCurrency } from 'hooks';
import { toLower } from 'lodash';
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useRecoilValueLoadable } from 'recoil';
import { childCurrenciesState } from 'recoils';
import {
  AddChildCurrency,
  UpdateChildCurrencies,
} from 'views/wallet/components';

export interface ICurrencyRow {
  key: number;
  parent_id: string;
  id: number;
  childs: ChildCurrency[];
}
const PAGE = 1;
const SIZE = 10;
const ChildCurrenciesPage = () => {
  // API
  const queryAllChild = useRecoilValueLoadable(childCurrenciesState);
  const mutationDelete = useDeleteChildCurrency();

  // init state
  const [pagination, SetPagination] = useState({
    current: PAGE,
    pageSize: SIZE,
  });
  const [selectedChild, setSelectedChild] =
    useState<Omit<ICurrencyRow, 'key'>>();
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // ! Handle data render
  const dataRender = React.useMemo(() => {
    const newArr: ICurrencyRow[] = [];
    const currencies = queryAllChild.getValue();

    if (currencies) {
      for (let i = 0; i < currencies.length; i++) {
        const parent_id = currencies[i].parent_id;
        const itemExist = newArr.find((item) => item.parent_id === parent_id);
        if (itemExist) {
          itemExist.childs.push({
            ...currencies[i],
          });
        } else {
          newArr.push({
            key: i,
            parent_id,
            childs: [currencies[i]],
            id: currencies[i].id,
          });
        }
      }
    }
    return newArr;

    // eslint-disable-next-line
  }, [queryAllChild.state, queryAllChild.getValue()]);

  const columns: ColumnsType<ICurrencyRow> = [
    {
      title: 'Serial',
      dataIndex: 'serial',
      key: 'serial',
      render: (_1: any, _2: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Parent Currency',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parent_id: string) => (
        <span
          className='d-flex'
          style={{
            alignItems: 'center',
            textTransform: 'uppercase',
          }}
        >
          <CurrencyIcon
            currency_id={parent_id}
            isCircle={true}
            style={{
              height: '1.75rem',
              marginRight: '1rem',
            }}
          />
          {parent_id}
        </span>
      ),
    },
    {
      title: 'Child Currencies',
      key: 'childs',
      dataIndex: 'childs',
      render: (_, { childs }) => (
        <>
          {childs.map((tag, index) => {
            const color = index % 2 ? 'geekblue' : 'green';
            return (
              <Tag
                color={color}
                key={index}
                style={{
                  marginTop: '0.25rem',
                }}
              >
                {tag.child_id.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, Currency) => {
        return (
          <div className='d-flex justify-content-start'>
            <Button
              type='primary'
              onClick={() => {
                setSelectedChild(Currency);
              }}
            >
              Update
            </Button>
            <Button
              type='ghost'
              style={{
                marginLeft: '1rem',
              }}
              onClick={() => {
                mutationDelete.mutate(Currency);
              }}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className='wallet-child-currencies'>
      <div
        className='d-flex w-100 mb-3'
        style={{
          justifyContent: 'space-between',
        }}
      >
        <Space direction='vertical'>
          <Input
            placeholder='Search currency in here .....'
            addonAfter={<BsSearch cursor='pointer' />}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </Space>
        <Button type='primary' onClick={() => setOpenModalAdd(true)}>
          ADD +
        </Button>
      </div>
      <Table
        columns={columns}
        loading={queryAllChild.state === 'loading' || mutationDelete.isLoading}
        dataSource={dataRender
          .filter(
            (currency) =>
              toLower(currency.parent_id).includes(toLower(searchValue)) ||
              currency.childs.find(({ child_id }) =>
                toLower(child_id).includes(toLower(searchValue))
              )
          )
          .sort((prev, next) => +next.id - +prev.id)}
        pagination={{
          ...pagination,
          total: dataRender.length || 0,
        }}
        onChange={(pagination) => {
          SetPagination({
            current: pagination.current || PAGE,
            pageSize: pagination.pageSize || SIZE,
          });
        }}
      />
      {selectedChild && (
        <UpdateChildCurrencies
          {...selectedChild}
          reset={() => setSelectedChild(undefined)}
        />
      )}
      {openModalAdd && (
        <AddChildCurrency close={() => setOpenModalAdd(false)} />
      )}
    </div>
  );
};

export default ChildCurrenciesPage;
