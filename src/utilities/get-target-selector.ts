import _ from 'lodash';

export default function getTargetSelector(element) {
  if (_.toLower(element.tagName) === 'a') {
    const href = _.trim(element.getAttribute('href'));
    if (_.size(href) > 1) {
      // 1 is chosen because href might simply be '#'
      return href;
    }
  }
  return element.dataset.target;
}
