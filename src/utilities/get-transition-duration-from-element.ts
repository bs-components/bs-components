// import _toNumber from 'lodash/toNumber';
// import _max from 'lodash/max';
// import _isNaN from 'lodash/isNaN';
// import _trimEnd from 'lodash/trimEnd';
// import _toLower from 'lodash/toLower';


const toNumber = require('lodash/toNumber');
const max = require('lodash/max');
const isNaN = require('lodash/isNaN');
const trimEnd = require('lodash/trimEnd');
const toLower = require('lodash/toLower');
const split = require('lodash/split');

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
