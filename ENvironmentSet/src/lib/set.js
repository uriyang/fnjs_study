import { p } from 'genf';

export const set = p.If(
  p.pipe(
    p.wrap,
    p.cdr,
    p.cdr,
    p.isRefable
  ),
  (name, value, target) => target[name] = value,
  p.pipe(
    p.wrap,
    p.cdr,
    p.car
  )
);