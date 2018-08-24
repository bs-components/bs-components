import toLower from 'lodash/toLower';

export default function getConfigBoolean(configValue: any) {
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
