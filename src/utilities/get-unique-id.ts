import _uniqueId from 'lodash/uniqueId';
import _toString from 'lodash/toString';

export default function getUniqueId(prefix) {
  const randomString = btoa(_toString(Math.random())).substring(5, 10);
  return _uniqueId(`${prefix}-${randomString}-`);
}
