import _ from 'lodash';

export default function getConfigBoolean(configValue: any) {
  if (configValue === true) {
    return true;
  }
  if (_.toLower(configValue) === 'true') {
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
