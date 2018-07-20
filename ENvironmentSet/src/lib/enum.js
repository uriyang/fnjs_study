import { p } from 'genf';
import inf from './inf';
import fetch from './fetch'

export default function enumGen(...vars) {
  const numbers = inf();
  return p.reduce((name, acc) => (acc[name] = fetch(numbers), acc), p.identity, {});
}