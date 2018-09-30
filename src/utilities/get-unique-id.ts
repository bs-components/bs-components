import _ from 'lodash';
// import _toString from 'lodash/toString';

export default function getUniqueId(prefix) {
  const randomString = btoa(_.toString(Math.random())).substring(5, 10);
  return _.uniqueId(`${prefix}-${randomString}-`);
}
