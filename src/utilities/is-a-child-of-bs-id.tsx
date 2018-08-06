import includes from 'lodash/includes';

export default function isAChildOfBsId(haystack, needle) {
  const returnArr = [];
  if (haystack.parentNode === null) {
    return false;
  }
  let currentNode = haystack.parentNode
  while(currentNode.parentNode !== null) {
    if (includes(currentNode.dataset, needle)) {
      return true;
    }
    returnArr.push(currentNode.id);
    currentNode = currentNode.parentNode;
  }
  return false;
}