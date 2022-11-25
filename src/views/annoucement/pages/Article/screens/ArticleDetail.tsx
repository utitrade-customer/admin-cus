import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { toNumber } from 'lodash';
import { TopBar } from '../components/TopBar';
import { Article } from 'hooks/announcement/types';
import { useGetArticleById } from 'hooks/announcement/article/useGetArticleById';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useUpdateArticle } from 'hooks';
import notification from 'antd/lib/notification';

export const AnnoucementDetailStyles = styled.div`
  .prev__announcement__list {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    span {
      margin-left: 1.2rem;
      font-weight: bold;
    }
  }
  .rdw-editor-main {
    overflow: auto;
    box-sizing: border-box;
    border: 3px solid #9999;
    border-radius: 2px;
    height: 400px;
    background-color: #fff;
  }
`;

export default function ArticleDetail() {
  const articleId = window.location.href.split('/').pop();

  // state
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  // hooks
  const mutation = useUpdateArticle();
  const { data } = useGetArticleById(toNumber(articleId));
  const { announcement: announcementDetail } = data || {
    announcement: { id: 0, photo_url: '', body: '', headline: '' },
  };

  // sideEffect
  useEffect(() => {
    setAnnouncement(announcementDetail);
    if (announcementDetail.body) {
      setEditorState(() =>
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(announcementDetail.body ?? '').contentBlocks
          )
        )
      );
    }
  }, [announcementDetail.id, announcementDetail]);
  const [announcement, setAnnouncement] = React.useState<Article>(
    announcementDetail ?? {}
  );

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);
    setAnnouncement((prev) => ({
      ...prev,
      body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    }));
  };

  // side effects
  React.useEffect(() => {
    if (mutation.isLoading) {
      notification.open({
        message: `Updating`,
      });
    }
    notification.destroy();
    if (mutation.isSuccess) {
      notification.success({
        message: `Update Success`,
      });
    }
    if (mutation.error) {
      notification.warning({
        message: `Update Fail`,
      });
    }
  }, [mutation.isLoading, mutation.isSuccess, mutation.error]);

  const handleUpdatePublish = () => {
    if (announcement.id) {
      return mutation.mutate({
        id: announcement.id,
        body: {
          ...announcement,
          state: true,
          priority: 1,
        },
      });
    }
  };
  const handleUpdateDraft = () => {
    if (announcement.id) {
      return mutation.mutate({
        id: announcement.id,
        body: {
          ...announcement,
          state: false,
          priority: 1,
        },
      });
    }
  };

  return (
    <AnnoucementDetailStyles>
      <TopBar
        announcement={announcement}
        onPublish={handleUpdatePublish}
        onDraft={handleUpdateDraft}
      />
      <div className='grid grid-cols-1'>
        <div className='mb-3'>
          <label
            htmlFor='formFile'
            className='form-label inline-block mb-2 text-gray-700'
          >
            Headline
          </label>
          <input
            required
            defaultValue={announcement.headline}
            value={announcement.headline}
            onChange={(e) =>
              setAnnouncement((el) => ({ ...el, headline: e.target.value }))
            }
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            type='text'
            placeholder='https://i.imgur.com/BsKB4xq.jpeg'
            id='formFile'
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='formFile'
            className='form-label inline-block mb-2 text-gray-700'
          >
            Description
          </label>
          <input
            required
            defaultValue={announcement.description}
            value={announcement.description}
            onChange={(e) =>
              setAnnouncement((el) => ({
                ...el,
                description: e.target.value,
              }))
            }
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            type='text'
            placeholder='https://i.imgur.com/BsKB4xq.jpeg'
            id='formFile'
          />
        </div>
        <div className='w-100 rounded-lg shadow-xl bg-gray-50 lg:w-1/2 flex flex-row align-items-center justify-content-center mx-auto mb-3'>
          <div className='m-4'>
            <div className='flex justify-center'>
              <div className='mb-3 w-96'>
                <label
                  htmlFor='formFile'
                  className='form-label inline-block mb-2 text-gray-700'
                >
                  Photo URL
                </label>
                <input
                  required
                  defaultValue={announcementDetail.photo_url}
                  onChange={(e) =>
                    setAnnouncement((el) => ({
                      ...el,
                      photo_url: e.target.value,
                    }))
                  }
                  className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                  type='text'
                  placeholder='https://i.imgur.com/BsKB4xq.jpeg'
                  id='formFile'
                />
              </div>
            </div>
          </div>
          <div>
            <img src={announcement.photo_url} alt='' width={300} />
          </div>
        </div>
        <Editor
          editorState={editorState}
          wrapperClassName='demo-wrapper'
          editorClassName='demo-editor'
          onEditorStateChange={handleEditorChange}
        />
      </div>
    </AnnoucementDetailStyles>
  );
}
