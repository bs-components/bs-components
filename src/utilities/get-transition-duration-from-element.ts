import _toNumber from 'lodash/toNumber';
import _max from 'lodash/max';
import _isNaN from 'lodash/isNaN';
import _trimEnd from 'lodash/trimEnd';
import _toLower from 'lodash/toLower';
import _split from 'lodash/split';

function transformTransitionDuration(stringDuration) {
  // always get the first duration (same as bootstrap)
  const durationArr = _split(stringDuration, ',');
  const timeInSeconds = _toNumber(_trimEnd(_toLower(durationArr[0]), 's'));
  if (_isNaN(timeInSeconds)) {
    return 0;
  }
  return timeInSeconds * 1000;
}

// modified from bootstrap file bootstrap.bundle.js
export default function getTransitionDurationFromElement(element) {
  if (!element) {
    return 0;
  }
  const elementStyle = window.getComputedStyle(element, null);
  const animationDuration = elementStyle.getPropertyValue('animation-duration');
  const transitionDuration = elementStyle.getPropertyValue('transition-duration');
  const durationArr = [];
  durationArr.push(transformTransitionDuration(animationDuration));
  durationArr.push(transformTransitionDuration(transitionDuration));
  return _max(durationArr);
}
