import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Modal, notification, Select } from 'antd';
import { CurrencyIcon } from 'components';
import { useUpdateChildCurrencies } from 'hooks';
import { toLower } from 'lodash';
import toUpper from 'lodash/toUpper';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { childCurrenciesState, currenciesState } from 'recoils';
import { ICurrencyRow } from 'views/wallet/pages/ChildCurrencies';
import Style from './style';

interface UpdateChildCurrenciesProps extends Omit<ICurrencyRow, 'key'> {
  reset: () => void;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
export const UpdateChildCurrencies = (props: UpdateChildCurrenciesProps) => {
  const { reset, parent_id, childs: oldChilds } = props;
  // API
  const currencies = useRecoilValue(currenciesState);
  const childCurrencies = useRecoilValue(childCurrenciesState);

  const initOldChilds = oldChilds.map((child) => child.child_id);
  const [childSelected, setChildSelected] = React.useState(initOldChilds);

  const mutation = useUpdateChildCurrencies();

  // ! side-effects
  React.useEffect(() => {
    if (mutation.isSuccess) {
      reset();
      notification.success({
        message: 'Update child currency success',
      });
    }
    if (mutation.error) {
      notification.warn({
        message: 'Upade child currency failed',
      });
    }
  }, [mutation.isSuccess, mutation.error, reset]);
  const childsAvailiable = currencies.filter(({ id: currency_id }) => {
    const isInvalid = childCurrencies.find(
      (child) =>
        toLower(child.child_id) === toLower(currency_id) ||
        toLower(child.parent_id) === toLower(currency_id)
    );
    return !isInvalid;
  });
  // handle options
  const optionsValue = (() => {
    return [
      ...(childsAvailiable?.map((curr) => curr.id) || []),
      ...initOldChilds,
    ].filter((curr) => !childSelected.includes(curr));
  })();

  const handleSubmit = ({ childs: childsSelected }: { childs: string[] }) => {
    const newChilds = childsSelected.filter(
      (child) => !initOldChilds.includes(child)
    );
    const childsRemove = oldChilds.filter((child) => {
      return !childsSelected.includes(toLower(child.child_id));
    });
    mutation.mutate({
      newChilds,
      parent_id,
      childsRemove,
    });
  };

  return (
    <Modal
      title={`Modal update  child of ${toUpper(parent_id)}`}
      visible={true}
      onCancel={reset}
      footer={[]}
      maskClosable={false}
    >
      <Style>
        <div className='d-flex align-items-center justify-content-center mb-4'>
          <CurrencyIcon
            currency_id={parent_id}
            isCircle={true}
            style={{
              height: '30px',
              marginRight: '1rem',
            }}
          />
          <strong>Currency: {toUpper(parent_id)}</strong>
        </div>

        <Form
          name='dynamic_form_item'
          {...formItemLayoutWithOutLabel}
          style={{ marginLeft: '2rem' }}
          onValuesChange={(_, { childs }) => {
            setChildSelected(childs);
          }}
          onFinish={handleSubmit}
        >
          <Form.List name='childs' initialValue={childSelected}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'Child' : ''}
                    required={true}
                    key={index}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please input child's name or delete this field.",
                          type: 'string',
                        },
                      ]}
                      noStyle
                    >
                      <Select
                        placeholder='Select Parent Currency'
                        allowClear
                        showSearch
                        labelInValue={false}
                        style={{
                          width: '60%',
                        }}
                      >
                        {optionsValue?.map((currency_name, index) => (
                          <Select.Option
                            key={index}
                            value={currency_name}
                            className='select-option'
                          >
                            <CurrencyIcon
                              currency_id={currency_name}
                              isCircle={true}
                              style={{
                                marginRight: '0.5rem',
                              }}
                            />
                            {toUpper(currency_name)}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        className='dynamic-delete-button'
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    style={{ width: '60%' }}
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
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
