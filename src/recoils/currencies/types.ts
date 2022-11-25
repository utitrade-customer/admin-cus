export interface Currency {
  id: string;
  name: string;
  description: '';
  homepage: '';
  parent_id: string;
  price: number;
  blockchain_key: string;
  explorer_transaction: string;
  explorer_address: string;
  type: string;
  deposit_enabled: boolean;
  withdrawal_enabled: boolean;
  deposit_fee: number;
  min_deposit_amount: number;
  withdraw_fee: number;
  min_withdraw_amount: number;
  withdraw_limit_24h: number;
  withdraw_limit_72h: '0.0';
  base_factor: number;
  precision: number;
  position: number;
  icon_url: string;
  min_confirmations: number;
}
