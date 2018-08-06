import toNumber from 'lodash/toNumber';
import max from 'lodash/max';
import isNaN from 'lodash/isNaN';
import trimEnd from 'lodash/trimEnd';
import toLower from 'lodash/toLower';
import split from 'lodash/split';

function transformTransitionDuration(stringDuration) {
  // always get the first duration (same as bootstrap)
  const durationArr = split(stringDuration, ',');
  const timeInSeconds = toNumber(trimEnd(toLower(durationArr[0]), 's'));
  if (isNaN(timeInSeconds)) {
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
  return max(durationArr);
}