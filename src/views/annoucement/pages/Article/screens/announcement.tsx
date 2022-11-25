import React from 'react';
import styled from 'styled-components';
import { Form, Input, notification } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { TopBar } from '../components/TopBar';
import { useCreateArticle } from 'hooks';

export const AnnoucementCreateStyles = styled.div`
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
    border: 1px solid #9999;
    background-color: #fff;
    border-radius: 2px;
    height: 400px;
  }
`;
export default function ArticleCreate() {
  // hooks
  const mutation = useCreateArticle();
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const [announcement, setAnnouncement] = React.useState({
    headline: '',
    description: '',
    state: false,
    body: '',
    priority: 1,
    photo_url: '',
    tags: '',
    name: '',
  });
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const handleSubmitAnnouncement = () => {};

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
        message: `Creating`,
      });
    }
    notification.destroy();
    if (mutation.isSuccess) {
      setAnnouncement({
        headline: '',
        description: '',
        state: false,
        body: '',
        priority: 1,
        photo_url: '',
        tags: '',
        name: '',
      });
      notification.success({
        message: `Create Success`,
      });
    }
    if (mutation.error) {
      notification.warning({
        message: `Create Fail`,
      });
    }
  }, [mutation.isLoading, mutation.isSuccess, mutation.error]);

  const handleCreateDraftArticle = () => {
    return mutation.mutate({
      ...announcement,
      state: false,
      priority: 1,
    });
  };

  const handleCreatePublishArticle = () => {
    return mutation.mutate({
      ...announcement,
      state: true,
      priority: 1,
    });
  };

  return (
    <AnnoucementCreateStyles>
      <TopBar
        announcement={announcement}
        onPublish={handleCreatePublishArticle}
        onDraft={handleCreateDraftArticle}
      />
      <Form {...layout} name='control-ref' onFinish={handleSubmitAnnouncement}>
        <Form.Item
          name='headline'
          label='Headline'
          rules={[{ required: true }]}
        >
          <Input
            name='headline'
            placeholder='Enter headline'
            allowClear
            value={announcement.headline}
            onChange={(e) =>
              setAnnouncement((el) => ({ ...el, headline: e.target.value }))
            }
          />
        </Form.Item>
        <Form.Item name='description' label='Description'>
          <Input
            name='description'
            allowClear
            onChange={(e) =>
              setAnnouncement((el) => ({
                ...el,
                description: e.target.value,
              }))
            }
          />
        </Form.Item>
        <div className=' rounded-lg shadow-xl bg-gray-50 lg:w-1/2 flex flex-row align-items-center justify-content-center mx-auto mb-3'>
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
        <Form.Item name='body' label='Content'>
          <Editor
            editorState={editorState}
            wrapperClassName='demo-wrapper'
            editorClassName='demo-editor'
            onEditorStateChange={handleEditorChange}
          />
        </Form.Item>
      </Form>
    </AnnoucementCreateStyles>
  );
}
