import { p } from 'genf';

export default function curry(callee) {
  const requireLen = p.prop('length', callee);
  const args = [];

  return function takeArgument(arg) {
    args.push(arg);
    if(requireLen === args.length)
      return p.call(callee, ...args);
    return takeArgument;
  }
}