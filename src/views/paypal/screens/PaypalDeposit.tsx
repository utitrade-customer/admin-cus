import { Button, Input, notification, Popover, Table, Tag } from "antd";
import { formatDistance } from "date-fns";
import {
  useAcceptPaypalDeposit,
  useFetchPaypalDepositList,
} from "hooks/paypal";
import React, { useState } from "react";
import { BsCheckLg, BsXCircle } from "react-icons/bs";
import styled from "styled-components";
import { DepositStatusTag } from "../components/StatusTag";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRejectPaypalDeposit } from "hooks/paypal/deposit/useRejectDeposit";

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

const PaypalDeposit = () => {
  // state
  const [selectedDepositId, setSelectedDepositId] = useState("");
  const [page, setpage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const loading = false;

  // hooks
  const { data, refetch } = useFetchPaypalDepositList(search);
  const acceptDeposit = useAcceptPaypalDeposit();
  const rejectDeposit = useRejectPaypalDeposit();

  // side effects
  React.useEffect(() => {
    if (acceptDeposit.isLoading) {
      notification.open({
        message: `Processing`,
      });
    }
    notification.destroy();
    if (acceptDeposit.isSuccess) {
      notification.success({
        message: `Accept successfully`,
      });
    }
    if (acceptDeposit.error) {
      notification.warning({
        message: `Request is failed`,
      });
    }
  }, [acceptDeposit.isLoading, acceptDeposit.isSuccess, acceptDeposit.error]);

  const handleAccept = () => {
    if (!selectedDepositId) {
      return notification.warn({
        message: `Missing deposit id`,
      });
    }

    acceptDeposit.mutate(
      { depositId: selectedDepositId },
      {
        onSuccess: () => {
          setSelectedDepositId("");
          refetch();
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedDepositId) {
      return notification.warn({
        message: `Missing deposit id`,
      });
    }

    rejectDeposit.mutate(
      { depositId: selectedDepositId },
      {
        onSuccess: () => {
          setSelectedDepositId("");
          refetch();
        },
      }
    );
  };

  const DepositApprovalConfirmationContent = (
    <>
      <p>Are you agree complete this deposit?</p>
      <Button type="primary" onClick={handleAccept}>
        Approve
      </Button>
    </>
  );

  const DepositRejectConfirmationContent = (
    <>
      <p>Are you agree reject this deposit?</p>
      <Button type="primary" danger onClick={handleReject}>
        Reject
      </Button>
    </>
  );

  const depositList =
    data &&
    data.map((deposit) => {
      return {
        ...deposit,
        action:
          Number(deposit.status) === 1 ? (
            <div className="d-flex gap-2">
              <Popover
                content={DepositApprovalConfirmationContent}
                title="Danger!"
                trigger="focus"
              >
                <Button
                  type="primary"
                  icon={<BsCheckLg />}
                  size={"middle"}
                  disabled={!deposit.id || acceptDeposit.isLoading}
                  onClick={() => {
                    setSelectedDepositId(deposit.id);
                  }}
                />
              </Popover>

              <Popover
                content={DepositRejectConfirmationContent}
                title="Danger!"
                trigger="focus"
              >
                <Button
                  type="primary"
                  danger
                  icon={<BsXCircle />}
                  size={"middle"}
                  onClick={() => {
                    setSelectedDepositId(deposit.id);
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
      render: (id: string) => (
        <>
          <code>{id}</code>
          <CopyToClipboard
            text={id}
            onCopy={() =>
              notification.success({
                message: `Copied`,
              })
            }
          >
            <Button className="ml-3">Copy</Button>
          </CopyToClipboard>
        </>
      ),
    },
    {
      title: "Deposit Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <Tag color={"green"} key={amount}>
          $ {amount}
        </Tag>
      ),
    },
    {
      title: "Deposit Fee",
      dataIndex: "depositFee",
      key: "depositFee",
      render: (depositFee: string) => (
        <Tag color={"red"} key={depositFee}>
          $ {depositFee}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: 0 | 1 | 2 | 3) => {
        return <DepositStatusTag status={status} />;
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

  const renderPaypalDepositList = () => {
    return (
      <React.Fragment>
        <Table
          columns={columns}
          dataSource={depositList}
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
          {renderPaypalDepositList()}
        </PaypalDepositListStyles>
      </div>
    </div>
  );
};

export default PaypalDeposit;
