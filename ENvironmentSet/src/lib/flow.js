import { p } from 'genf';

export default function flow(f, ...args) {
  return p.call(f, ...args);
}