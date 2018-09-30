import _ from 'lodash';
// import _size from 'lodash/size';
// import _trim from 'lodash/trim';

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
