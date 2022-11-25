import { isObject } from 'util';

export const queryString = (params: any) => {
  if (isObject(params)) {
    return '';
  }
  return Object.keys(params)
    .map(function (key) {
      return key + '=' + params[key];
    })
    .join('&');
};
