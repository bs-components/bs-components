import uniqueId from 'lodash/uniqueId';
import toString from 'lodash/toString';

export default function getUniqueId(prefix) {
  const randomString = btoa(toString(Math.random())).substring(5, 10);
  return uniqueId(`${prefix}-${randomString}-`);
}
