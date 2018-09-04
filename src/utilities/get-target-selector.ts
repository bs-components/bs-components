import _toLower from 'lodash/toLower';
import _size from 'lodash/size';
import _trim from 'lodash/trim';

export default function getTargetSelector(element) {
  if (_toLower(element.tagName) === 'a') {
    const href = _trim(element.getAttribute('href'));
    if (_size(href) > 1) {
      // 1 is chosen because href might simply be '#'
      return href;
    }
  }
  return element.dataset.target;
}
