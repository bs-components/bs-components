import toNumber from 'lodash/toNumber';
import max from 'lodash/max';
import isNaN from 'lodash/isNaN';
import trimEnd from 'lodash/trimEnd';
import toLower from 'lodash/toLower';
import split from 'lodash/split';

function transformTransitionDuration(stringDuration) {
  // we always get the first duration (same as bootstrap)
  const durationArr = split(stringDuration, ',');
  // console.log('durationArr: ', durationArr);
  return toNumber(trimEnd(toLower(durationArr[0]), 's'));
}


// modified from bootstrap file bootstrap.bundle.js
export default function getTransitionDurationFromElement(element) {
  if (!element) {
    return 0;
  }
  const elementStyle = window.getComputedStyle(element, null);
  const animDuration = elementStyle.getPropertyValue('animation-duration');
  const transDuration = elementStyle.getPropertyValue('transition-duration');
  const animDurationNumber = transformTransitionDuration(animDuration);
  const transDurationNumber = transformTransitionDuration(transDuration);
  const durationArr = [];
  if (!isNaN(animDurationNumber)) {
    durationArr.push(animDurationNumber * 1000);
  }
  if (!isNaN(transDurationNumber)) {
    durationArr.push(transDurationNumber * 1000);
  }
  return max(durationArr);
}