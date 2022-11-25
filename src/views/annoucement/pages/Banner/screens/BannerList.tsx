import { Table } from 'antd';
import { useFetchBannerList } from 'hooks/announcement/article/useGetBanner';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { useUpdateShowBanner } from 'hooks/announcement/article/useUpdateShowBanner';

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

export default function BannerList() {
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
      title: 'Show Banner',
      dataIndex: 'show_banner',
      key: 'show_banner',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string) => {
        return moment(new Date(created_at)).format('DD/MM/yyyy hh:mm');
      },
    },
  ];

  const [page, setpage] = React.useState(1);
  const loading = false;

  const { data } = useFetchBannerList();
  const { list } = data || { list: [] };

  const fetchBannerListMuation = useFetchBannerList();
  const updateShowBannerMutation = useUpdateShowBanner();

  const handleToggleShowBanner = (announcementId: number, checked: boolean) => {
    updateShowBannerMutation.mutate(
      { id: announcementId, show: checked },
      {
        onSuccess: () => {
          fetchBannerListMuation.refetch();
        },
      }
    );
  };

  interface BannerJSXElement {
    id: number;
    headline: string;
    state?: boolean;
    priority?: number;
    photo_url?: string;
    show_banner: JSX.Element;
    created_at?: Date;
  }

  const announcementList = list.reduce(
    (currentList: BannerJSXElement[], announcement) => {
      if (!announcement.photo_url) return currentList;

      const banner = {
        ...announcement,
        show_banner: (
          <label>
            <Switch
              onChange={(checked) =>
                handleToggleShowBanner(announcement.id, checked)
              }
              checked={Boolean(announcement.show_banner)}
            />
          </label>
        ),
      };

      return currentList.concat(banner);
    },
    []
  );

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
          rowKey='id'
        />
      </React.Fragment>
    );
  };
  return (
    <AnnoucementListStyles>{renderAnnouncementList()}</AnnoucementListStyles>
  );
}
