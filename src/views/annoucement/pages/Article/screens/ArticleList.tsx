import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Tag } from 'antd';
import styled from 'styled-components';
import { useFetchArticleList } from 'hooks';
import moment from 'moment';

export const AnnoucementListStyles = styled.div`
  .redirect__to__create {
    margin-bottom: 40px;
    .create {
      text-decoration: none;
    }
  }

  .ant-table-cell {
    .btn__update {
      a {
        text-decoration: none;
      }
    }
  }
`;

const DEFAULT_PAGE_SIZE = 5;

export default function ArticleList() {
  const columns = [
    {
      title: 'Photo',
      dataIndex: 'photo_url',
      key: 'photo_url',
      render: (photo_url: string) => (
        <img src={photo_url} alt='' width={200} height={100} />
      ),
    },
    {
      title: 'Headline',
      dataIndex: 'headline',
      key: 'headline',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (active: string) => {
        let color = active === '1' ? 'green' : 'geekblue';
        let tag = active === '1' ? 'Published' : 'Draft';
        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string) => {
        return moment(new Date(created_at)).format('DD/MM/yyyy hh:mm');
      },
    },
    // {
    //   title: "Tags",
    //   dataIndex: "tags",
    //   key: "tags",
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const [page, setpage] = React.useState(1);
  const loading = false;

  const { data } = useFetchArticleList();
  const { announcement_list } = data || { announcement_list: [] };
  const announcementList = announcement_list.map((announcement) => {
    return {
      ...announcement,
      action: (
        <Button className='btn__update' type='primary'>
          <Link
            to={`/dashboard/announcement/article/detail/${announcement.id}`}
          >
            Update
          </Link>
        </Button>
      ),
    };
  });
  const renderAnnouncementList = () => {
    return (
      <React.Fragment>
        <Table
          columns={columns}
          dataSource={announcementList}
          loading={loading}
          pagination={{
            current: page,
            pageSize: DEFAULT_PAGE_SIZE,
            onChange: (page) => {
              setpage(page);
            },
          }}
        />
      </React.Fragment>
    );
  };
  return (
    <AnnoucementListStyles>{renderAnnouncementList()}</AnnoucementListStyles>
  );
}
