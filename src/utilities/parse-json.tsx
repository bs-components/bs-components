export default function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
}
