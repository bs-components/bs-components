// import isBoolean from 'lodash/isBoolean';
// import isString from 'lodash/isString';
import toLower from 'lodash/toLower';

export default function getConfigBoolean(configValue: any) {
  // if (isBoolean(configValue)) {
  //   return configValue;
  // }
  // if (isString(configValue)) {
  //   return toLower(configValue) === 'true';
  // }
  if (configValue === true) {
    return true;
  }
  if (toLower(configValue) === 'true') {
    return true;
  }
  if (configValue === 1) {
    return true;
  }
  if (configValue === '1') {
    return true;
  }
  return false;
}
