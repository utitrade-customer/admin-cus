import { Button, Form, Modal, notification, Select } from 'antd';
import { CurrencyIcon } from 'components';
import { ChildCurrencyDto, useAddChildCurrencies } from 'hooks';
import { toLower, toUpper } from 'lodash';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { childCurrenciesState, currenciesState } from 'recoils';
import Style from './style';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface AddChildCurrencyProps {
  close: () => void;
}
export const AddChildCurrency = (props: AddChildCurrencyProps) => {
  const { close } = props;
  const mutation = useAddChildCurrencies();

  // recoils
  const currencies = useRecoilValue(currenciesState);
  const childCurrencies = useRecoilValue(childCurrenciesState);

  const childsAvailiable = currencies.filter(({ id: currency_id }) => {
    const isInvalid = childCurrencies.find(
      (child) =>
        toLower(child.child_id) === toLower(currency_id) ||
        toLower(child.parent_id) === toLower(currency_id)
    );
    return !isInvalid;
  });

  // states
  const [parentID, setParentID] = React.useState('');

  React.useEffect(() => {
    if (mutation.isSuccess) {
      close();
      notification.success({
        message: 'Add child currency success',
      });
    }
    if (mutation.error) {
      notification.warn({
        message: 'Add child currency failed',
      });
    }
  }, [mutation.isSuccess, mutation.error, close]);

  const handleSubmit = (value: ChildCurrencyDto) => {
    mutation.mutate({
      ...value,
    });
  };

  return (
    <Modal
      title='Modal add child currency'
      visible={true}
      footer={[]}
      onCancel={close}
      maskClosable={false}
    >
      <Style>
        <Form
          {...layout}
          name='control-hooks'
          onFinish={(value) => handleSubmit(value)}
        >
          <Form.Item
            name='parent_id'
            label='Parent Currency'
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Parent currency must be provided',
              },
            ]}
          >
            <Select
              placeholder='Select Parent Currency'
              allowClear
              showSearch
              labelInValue={false}
              onChange={(value: string) => {
                setParentID(value);
              }}
            >
              {childsAvailiable?.map((curr) => (
                <Option key={curr.id} value={curr.id} className='select-option'>
                  <CurrencyIcon
                    currency_id={curr.id}
                    isCircle={true}
                    style={{
                      marginRight: '0.5rem',
                    }}
                  />
                  {toUpper(curr.id)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='childs'
            label='Childs'
            rules={[
              {
                required: true,
                message: 'Child currency must be provided',
              },
            ]}
          >
            <Select
              placeholder='Select child currencies'
              allowClear
              showSearch
              mode='tags'
              labelInValue={false}
            >
              {childsAvailiable
                ?.filter((item) => item.id !== parentID)
                .map((curr) => (
                  <Option key={curr.id} value={curr.id}>
                    <CurrencyIcon
                      currency_id={curr.id}
                      isCircle={true}
                      style={{
                        marginRight: '0.5rem',
                      }}
                    />
                    {toUpper(curr.id)}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type='primary'
              htmlType='submit'
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Loading ...' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </Style>
    </Modal>
  );
};
