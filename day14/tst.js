

let clearbits = ~(1);
let setbits = (1 << 2) | (1 << 3);

let tst = 32 + 16 + 2 + 1;

console.log("before: " + tst);

tst &= clearbits;
console.log("clearbits: " + tst);

tst |= setbits;
console.log("setbits: " + tst);

