export default function getDuplicatesInArray(rawArr) {
  const checkingArr = [];
  const dupArr = [];
  for (let j = 0, len = rawArr.length; j < len; j += 1) {
    if (checkingArr.indexOf(rawArr[j]) === -1) {
      checkingArr.push(rawArr[j]);
    } else if (dupArr.indexOf(rawArr[j]) === -1) {
      dupArr.push(rawArr[j]);
    }
  }
  return dupArr;
}
