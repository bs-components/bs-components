import _ from 'lodash';

export default function getUniqueId(prefix) {
  const randomString = btoa(_.toString(Math.random())).substring(5, 10);
  return _.uniqueId(`${prefix}-${randomString}-`);
}
