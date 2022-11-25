import React from 'react';
import _find from 'lodash/find';
import _toLower from 'lodash/toLower';
import { useRecoilValue } from 'recoil';
import { currenciesState } from '@/recoils';

interface CurrencyIconProps {
  currency_id: string;
  style?: React.CSSProperties;
  isCircle?: boolean;
  width?: number | string;
  height?: number | string;
}
const CurrencyIcon = (props: CurrencyIconProps) => {
  const { currency_id, style, isCircle, width, height } = props;
  const currencies = useRecoilValue(currenciesState);
  const findIcon = () => {
    try {
      const currency = _find(currencies, { id: _toLower(currency_id) });
      if (currency) {
        return currency.icon_url;
      }
      return require(`../../../node_modules/cryptocurrency-icons/128/color/${currency_id.toLowerCase()}.png`)
        .default;
    } catch (err) {
      return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg')
        .default;
    }
  };
  return (
    <img
      width={width}
      height={height}
      style={{
        height: '30px',
        ...(style ?? { ...(isCircle ? { borderRadius: 100 } : {}) }),
      }}
      src={findIcon()}
      alt={currency_id}
    />
  );
};

export default CurrencyIcon;
