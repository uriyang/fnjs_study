export default function* inf() {
  let num = 0;
  while(true) yield num++;
}