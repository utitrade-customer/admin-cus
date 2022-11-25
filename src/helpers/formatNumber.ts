import _toNumber from 'lodash/toNumber';
import _toString from 'lodash/toString';

export const formatNumber = (value: any) => {
  let result = _toString(value);
  let convertValue = _toString(value);
  if (convertValue.indexOf('e') !== -1) {
    const exponent = parseInt(convertValue.split('-')[1], 10);
    result = _toNumber(convertValue).toFixed(exponent);
  }
  const stringFormat = `${result}`;
  const x = stringFormat.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : '';
  const regex = /(\d+)(\d{3})/;
  while (regex.test(x1)) {
    x1 = x1.replace(regex, '$1,$2');
  }

  return x1 + x2;
};
