import { Loading } from '@/components';
import { StatusKYC } from '@/hooks/kyc/model';
import { Button, Modal, notification, PageHeader, Radio, Select } from 'antd';
import clsx from 'clsx';
import format from 'date-fns/format';
import { useFetchKYCDetail, useUpdateKYC } from '@/hooks';
import { toString } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Style from './style';

const { Option } = Select;
const KYCDetailPage = () => {
  const { uid, update_at } = useParams();
  const { data: userInfo, isLoading } = useFetchKYCDetail({
    uid: toString(uid),
    update_at: toString(update_at),
  });
  const mutation = useUpdateKYC();
  // state
  const [statusState, setStatusSate] = React.useState<StatusKYC | 'criminal'>(
    'process'
  );
  const [reasonState, setReasonState] = React.useState('');
  const [iSOpenReasonModal, setOpenModalReason] = React.useState(false);
  const [modalVisible, setIsModalVisible] = React.useState({
    status: false,
    img: '',
    type: '',
  });

  React.useEffect(() => {
    if (userInfo && userInfo?.status) {
      setStatusSate(userInfo?.status);
    }
  }, [uid, update_at, userInfo]);

  React.useEffect(() => {
    if (mutation.isLoading) {
      notification.open({
        message: `Updating Status ${uid}`,
      });
    }
    notification.destroy();
    if (mutation.isSuccess) {
      notification.success({
        message: `Update KYC ${uid} Success`,
      });
      window.history.back();
    }
    if (mutation.error) {
      notification.warning({
        message: `Update Status ${uid} Error`,
      });
    }
    // eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isLoading, mutation.isSuccess, mutation.error]);
  // class
  const processActiveClass = clsx(
    statusState === 'process' && 'status--process'
  );
  const failedActiveClass = clsx(statusState === 'failed' && 'status--failed');
  const verifyActiveClass = clsx(statusState === 'verify' && 'status--verify');
  const criminalActiveClass = clsx(statusState === 'criminal' && 'text-black');

  // render
  const renderModalPhoto = () => {
    return (
      <Modal
        title={modalVisible.type}
        visible={modalVisible.status}
        onCancel={() => setIsModalVisible({ ...modalVisible, status: false })}
        onOk={() => setIsModalVisible({ ...modalVisible, status: false })}
      >
        <img
          src={modalVisible.img}
          alt={modalVisible.type}
          style={{
            width: '100%',
            height: '100%',
          }}
        ></img>
      </Modal>
    );
  };

  const renderInfo = (key: string, value: string | undefined | number) => {
    return (
      <div
        className='w-100'
        style={{ padding: '5px 0', display: 'inline-flex' }}
      >
        <div className='info__key w-50'>{key}</div>
        <div className='info__value w-50'>{value}</div>
      </div>
    );
  };
  const renderReasonModal = () => {
    return (
      <Modal
        visible={iSOpenReasonModal}
        title={`Description Why ${statusState}`}
        onCancel={() => setOpenModalReason(false)}
        onOk={() => setOpenModalReason(false)}
      >
        <Select
          value={reasonState}
          onChange={(value) => setReasonState(value)}
          style={{ width: 300 }}
        >
          <Option value=''>Choose Reason</Option>
          <Option value='Your document picture is not clearly'>
            Your document picture is not clearly
          </Option>
          <Option value='Your picture selfie is incorrect'>
            Your picture selfie is incorrect
          </Option>
          <Option value='Your Information does not match'>
            Your Information does not match
          </Option>
        </Select>
      </Modal>
    );
  };

  const renderOptionsIp = () => {
    if (!userInfo?.repeat_ip) {
      return null;
    }
    const uids = userInfo?.repeat_ip.split(',');
    return uids.map((uid) => (
      <Option key={uid} value={uid}>
        {uid}
      </Option>
    ));
  };
  // handle
  const handleClickPhoto = (type: string, img: string | undefined) => {
    setIsModalVisible({
      img: toString(img),
      type: type,
      status: true,
    });
  };
  const handleSubmit = () => {
    return mutation.mutate({
      status: statusState,
      reason: reasonState,
      uid: toString(uid),
      update_at: toString(update_at),
    });
  };
  const getSafeDate = (date: string | undefined) => {
    if (!date) return new Date();
    return new Date(date);
  };

  return (
    <Style className='kyc-detail-page'>
      {renderModalPhoto()}
      {renderReasonModal()}
      {isLoading ? (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{
            minHeight: '40em',
          }}
        >
          <Loading cover='center' />
        </div>
      ) : (
        <React.Fragment>
          <div className='kyc-detail-page__header'>
            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title='Personal Information'
            >
              <Select
                defaultValue='User duplicate IP address'
                style={{ width: 300 }}
              >
                {renderOptionsIp()}
              </Select>
            </PageHeader>
          </div>
          <div className='kyc-detail-page__content'>
            <div className='line-text'>
              <span>Information</span>
            </div>
            <div className='w-100 d-flex flex-wrap'>
              <div className='content__info w-50 col-md-6'>
                {renderInfo('Fullname: ', userInfo?.fullname)}
                {renderInfo('UID: ', userInfo?.uid)}
                {renderInfo(
                  'Date Of Birth: ',
                  format(getSafeDate(userInfo?.date_of_birth), 'yyyy-MM-dd')
                )}
                {renderInfo('Nationality: ', userInfo?.nationality)}
                {renderInfo('Email: ', userInfo?.email)}
                {renderInfo('IP address: ', userInfo?.user_ip)}
              </div>
              <div className='w-50 d-flex justify-content-center'>
                <div
                  className='content__avt w-50 m-auto d-flex justify-content-center flex-wrap'
                  id='user'
                >
                  <strong className='w-100 text-center'>New User Photo</strong>
                  <div
                    className='m-auto w-100 d-flex justify-content-center'
                    onClick={() =>
                      handleClickPhoto(
                        `New User Photo ${userInfo?.uid}`,
                        userInfo?.user_photo
                      )
                    }
                  >
                    <input
                      type='image'
                      src={userInfo?.user_photo}
                      alt='user-photo'
                    ></input>
                  </div>
                </div>
                {userInfo?.old_photo ? (
                  <div
                    className='content__avt w-50 d-flex justify-content-center flex-wrap'
                    onClick={() =>
                      handleClickPhoto(
                        `Old User Photo ${userInfo?.uid}`,
                        userInfo?.old_photo
                      )
                    }
                  >
                    <strong>Old User Photo</strong>
                    <div className='m-auto w-100 d-flex justify-content-center'>
                      <input
                        type='image'
                        src={userInfo?.old_photo}
                        alt='old-photo'
                        className='w-100'
                      ></input>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className='line-text'>
              <span>Current Address</span>
            </div>
            <div className='w-100 d-flex flex-wrap justify-content-center'>
              <div className='current-address w-50'>
                {renderInfo(
                  'Residential address:',
                  userInfo?.residential_address
                )}
                {renderInfo('City:', userInfo?.city)}
                {renderInfo('Country:', userInfo?.country)}
                {renderInfo('Postal Code:', userInfo?.postal_code)}
                {renderInfo('Document:', userInfo?.document)}
                {renderInfo('Document Number:', userInfo?.document_number)}
                {renderInfo('Total Submit', userInfo?.total_submit)}
              </div>
              <div
                className='current-address__card w-50'
                onClick={() =>
                  handleClickPhoto(
                    `Photo Document Of ${uid}`,
                    userInfo?.photo_document
                  )
                }
              >
                <div>
                  <input
                    type='image'
                    src={userInfo?.photo_document}
                    alt='user-photo'
                  ></input>
                </div>
              </div>
            </div>
            <div className='mt-5'>
              <Radio.Group
                value={statusState}
                onChange={(e) => setStatusSate(e.target.value)}
              >
                <Radio.Button className={processActiveClass} value='process'>
                  Process
                </Radio.Button>
                <Radio.Button
                  className={failedActiveClass}
                  value='failed'
                  onClick={() => setOpenModalReason(true)}
                >
                  Failed
                </Radio.Button>
                <Radio.Button className={verifyActiveClass} value='verify'>
                  Verify
                </Radio.Button>
                <Radio.Button className={criminalActiveClass} value='criminal'>
                  Criminal
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className='mt-3'>
              <Button type='primary' onClick={() => handleSubmit()}>
                Save
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </Style>
  );
};

export default KYCDetailPage;
