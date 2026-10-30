// Stateless 32-bit integer mixing: an index has the same value in every seek order.
export function randomAt(seed, index) {
  let bits = (seed ^ Math.imul(index + 1, 0x9e3779b9)) >>> 0;
  bits = Math.imul(bits ^ (bits >>> 16), 0x21f0aaad);
  bits = Math.imul(bits ^ (bits >>> 15), 0x735a2d97);
  return ((bits ^ (bits >>> 15)) >>> 0) / 4294967296;
}
