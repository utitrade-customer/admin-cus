import { Button, Input, Modal, notification, Popover, Table, Tag } from "antd";
import { formatDistance } from "date-fns";
import { useFetchPaypalWithdrawList } from "hooks/paypal/withdraw";
import React, { useState } from "react";
import { BsCheckLg, BsXCircle } from "react-icons/bs";
import styled from "styled-components";
import { WithdrawStatusTag } from "../components/StatusTag";
import _toNumber from "lodash/toNumber";
import { useAcceptPaypalWithdraw } from "hooks/paypal/withdraw/useAcceptWithdraw";
import { useCancelPaypalWithdraw } from "hooks/paypal/withdraw/useCancelWithdraw";

export const PaypalDepositListStyles = styled.div`
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

const PaypalWithdraw = () => {
  // state
  const [paypalTransactionId, setPaypalTransactionId] = useState("");
  const [isShowEnterPaypalID, setShowEnterPaypalID] = useState(false);
  const [selectedWithdrawId, setSelectedWithdrawId] = useState("");
  const [page, setpage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const loading = false;

  // hooks
  const { data, refetch } = useFetchPaypalWithdrawList(search);
  const acceptWithdrawMutation = useAcceptPaypalWithdraw();
  const cancelWithdrawMutation = useCancelPaypalWithdraw();

  // side effects
  React.useEffect(() => {
    if (acceptWithdrawMutation.isLoading) {
      notification.open({
        message: `Processing`,
      });
    }
    notification.destroy();
    if (acceptWithdrawMutation.isSuccess) {
      notification.success({
        message: `Accept successfully`,
      });
    }
    if (acceptWithdrawMutation.error) {
      notification.warning({
        message: `Request is failed`,
      });
    }
  }, [
    acceptWithdrawMutation.isLoading,
    acceptWithdrawMutation.isSuccess,
    acceptWithdrawMutation.error,
  ]);

  const handleAccept = () => {
    if (!selectedWithdrawId) {
      return notification.warn({
        message: `Missing withdraw id`,
      });
    }

    if (!paypalTransactionId) {
      return notification.warn({
        message: `Missing paypal transaction id`,
      });
    }

    acceptWithdrawMutation.mutate(
      {
        withdrawId: selectedWithdrawId,
        paypalTransactionId: paypalTransactionId,
      },
      {
        onSuccess: () => {
          setSelectedWithdrawId("");
          setShowEnterPaypalID(false);
          refetch();
        },
      }
    );
  };

  const handleCancelWithdraw = () => {
    if (!selectedWithdrawId) {
      return notification.warn({
        message: `Missing withdraw id`,
      });
    }

    cancelWithdrawMutation.mutate(
      { withdrawId: selectedWithdrawId },
      {
        onSuccess: () => {
          setSelectedWithdrawId("");
          refetch();
        },
      }
    );
  };

  const WithdrawCancelConfirmationContent = (
    <>
      <p>Are you agree cancel this withdraw?</p>
      <Button type="primary" danger onClick={handleCancelWithdraw}>
        Cancel
      </Button>
    </>
  );

  const withdrawList =
    data &&
    data.map((withdraw) => {
      return {
        ...withdraw,
        action:
          Number(withdraw.aasmState) === 0 ? (
            <div className="d-flex gap-2">
              <Button
                type="primary"
                icon={<BsCheckLg />}
                size={"middle"}
                disabled={!withdraw.id || acceptWithdrawMutation.isLoading}
                onClick={() => {
                  setSelectedWithdrawId(withdraw.id);
                  setShowEnterPaypalID(true);
                }}
              />
              <Popover
                content={WithdrawCancelConfirmationContent}
                title="Danger!"
                trigger="focus"
              >
                <Button
                  type="primary"
                  danger
                  icon={<BsXCircle />}
                  size={"middle"}
                  onClick={() => {
                    setSelectedWithdrawId(withdraw.id);
                  }}
                />
              </Popover>
            </div>
          ) : (
            <span>NONE</span>
          ),
      };
    });
  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Paypal Transaction ID",
      dataIndex: "paypalTransactionId",
      key: "paypalTransactionId",
      render: (paypalTransactionId: string) => (
        <Tag
          color={paypalTransactionId ? "green" : "red"}
          key={paypalTransactionId}
        >
          {paypalTransactionId ?? "Waiting admin sending paypal money"}
        </Tag>
      ),
    },
    {
      title: "Withdraw Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <Tag color={"green"} key={amount}>
          $ {_toNumber(amount)}
        </Tag>
      ),
    },
    {
      title: "Withdraw Fee",
      dataIndex: "fee",
      key: "fee",
      render: (withdrawFee: string) => (
        <Tag color={"red"} key={withdrawFee}>
          $ {_toNumber(withdrawFee)}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "aasmState",
      key: "aasmState",
      render: (status: 0 | 1 | 2) => {
        return <WithdrawStatusTag status={status} />;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (created_at: string) => {
        return formatDistance(new Date(created_at), new Date(), {
          addSuffix: true,
        });
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const renderPaypalWithdrawList = () => {
    return (
      <React.Fragment>
        <Table
          columns={columns}
          dataSource={withdrawList}
          loading={loading}
          pagination={{
            current: page,
            pageSize: 5,
            onChange: (page) => {
              setpage(page);
            },
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <div>
      <div>
        <Input.Search
          style={{ width: 300 }}
          size="large"
          placeholder="Search"
          enterButton
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <PaypalDepositListStyles>
          {renderPaypalWithdrawList()}
          <Modal
            title="Paypal Transaction ID"
            visible={isShowEnterPaypalID}
            onOk={handleAccept}
            onCancel={() => {
              setPaypalTransactionId("");
              setShowEnterPaypalID(false);
            }}
          >
            <Input
              placeholder="Please enter Paypal Transaction ID"
              value={paypalTransactionId}
              onChange={(e) => setPaypalTransactionId(e.target.value)}
            />
          </Modal>
        </PaypalDepositListStyles>
      </div>
    </div>
  );
};

export default PaypalWithdraw;
