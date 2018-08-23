import closest from './closest';

export default function clickWasInside(el, selector) {
  return (closest(el, selector) !== null);
}
