import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { ArticlePreview } from '../containers/ArticlePreview';
import { Article } from 'hooks/announcement/types';
import { useNavigate } from 'react-router-dom';
interface TopBarProps {
  announcement: Article;
  onPublish: () => void;
  onDraft: () => void;
}
export const TopBar = (props: TopBarProps) => {
  const { announcement, onPublish, onDraft } = props;
  // state
  const [isShowPreview, showPreview] = React.useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <Modal
        title='Preview'
        width='80vw'
        visible={isShowPreview}
        onCancel={() => showPreview(false)}
        onOk={() => showPreview(false)}
      >
        <ArticlePreview article={announcement} />
      </Modal>
      <div className='prev__announcement__list flex flex-row justify-between'>
        <div>
          <ArrowLeftOutlined onClick={goBack} />
          <span>Announcement List</span>
        </div>
        <div className='flex flex-row gap-2'>
          <button
            onClick={onPublish}
            className='bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'
          >
            Publish
          </button>
          <button
            onClick={onDraft}
            className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
          >
            Draft
          </button>
          <button
            onClick={() => showPreview(true)}
            className='flex flex-row align-items-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
            <span>Preview</span>
          </button>
        </div>
      </div>
    </>
  );
};
