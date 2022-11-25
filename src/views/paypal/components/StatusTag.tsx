import { Tag } from "antd";
interface StatusProps {
  status: 0 | 1 | 2 | 3;
}

export const DepositStatusTag = (props: StatusProps) => {
  switch (Number(props.status)) {
    case 0:
      return (
        <Tag color={"grey"} key={props.status}>
          Pending
        </Tag>
      );
    case 1:
      return (
        <Tag color={"yellow"} key={props.status}>
          Waiting
        </Tag>
      );
    case 2:
      return (
        <Tag color={"green"} key={props.status}>
          Success
        </Tag>
      );
    case 3:
      return (
        <Tag color={"red"} key={props.status}>
          Failed
        </Tag>
      );

    default:
      return (
        <Tag color={"red"} key={props.status}>
          Invalid Status
        </Tag>
      );
  }
};

export const WithdrawStatusTag = (props: StatusProps) => {
  switch (Number(props.status)) {
    case 0:
      return (
        <Tag color={"yellow"} key={props.status}>
          Waiting
        </Tag>
      );
    case 1:
      return (
        <Tag color={"green"} key={props.status}>
          Success
        </Tag>
      );
    case 2:
      return (
        <Tag color={"red"} key={props.status}>
          Failed
        </Tag>
      );

    default:
      return (
        <Tag color={"red"} key={props.status}>
          Invalid Status
        </Tag>
      );
  }
};
