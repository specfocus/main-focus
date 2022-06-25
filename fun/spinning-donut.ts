// https://www.a1k0n.net/2011/07/20/donut-math.html
// https://www.youtube.com/watch?v=DEqXNfs_HhY
// https://www.youtube.com/watch?v=55iwMYv8tGI

export interface Vector {
  x: number;
  y: number;
}

export const IDENTITY_VECTOR = { x: 0, y: 1024 }; 

const R = (mul: number, shift: number, v: Vector) => {
  let _ = v.x;
  v.x -= mul * v.y >> shift;
  v.y += mul * _ >> shift;
  _ = 3145728 - v.x * v.x - v.y * v.y >> 11;
  v.x = v.x * _ >> 10;
  v.y = v.y * _ >> 10;
};
const b = new Map<number, number>();
const z = new Map<number, number>();
// int8_t b[1760], z[1760];

const usleep = (ms: number) => { };
const printf = (...args: any[]) => console.log(...args);
const putchar = (...args: any[]) => { };

const COLORS = '.,-~:;=!*#$@';

export const next = (vA: Vector, vB: Vector): string => {
  const chars: number[] = [];
  const putchar = (ch: number) => chars.push(ch);

  b.set(32, 1760);  // text buffer
  z.set(127, 1760);   // z buffer
  let sj = 0;
  let cj = 1024;
  const vj: Vector = { x: cj, y: sj };
  for (let j = 0; j < 90; j++) {
    let si = 0, ci = 1024;  // sine and cosine of angle i
    const vi: Vector = { x: ci, y: si };
    for (let i = 0; i < 324; i++) {
      let R1 = 1, R2 = 2048, K2 = 5120 * 1024;

      let x0 = R1 * cj + R2,
        x1 = ci * x0 >> 10,
        x2 = vA.x * sj >> 10,
        x3 = si * x0 >> 10,
        x4 = R1 * x2 - (vA.y * x3 >> 10),
        x5 = vA.y * sj >> 10,
        x6 = K2 + R1 * 1024 * x5 + vA.x * x3,
        x7 = cj * si >> 10,
        x = 40 + 30 * (vB.x * x1 - vB.y * x4) / x6,
        y = 12 + 15 * (vB.x * x4 + vB.y * x1) / x6,
        N = (-vA.x * x7 - vB.x * ((-vA.y * x7 >> 10) + x2) - ci * (cj * vB.y >> 10) >> 10) - x5 >> 7;

      let o = x + 80 * y;
      let zz = (x6 - K2) >> 15;
      if (22 > y && y > 0 && x > 0 && 80 > x && zz < z[o]) {
        z[o] = zz;
        b[o] = COLORS[N > 0 ? N : 0];
      }
      R(5, 8, vi);  // rotate i
    }
    R(9, 7, vj);  // rotate j
  }
  for (let k = 0; 1761 > k; k++) {
    putchar(k % 80 ? b[k] : 10);
  }
  R(5, 7, vA);
  R(5, 8, vB);
  // usleep(15000);
  // printf('\x1b[23A');
  return String.fromCharCode.apply(null, chars);
};

export const animate = (ms: number = 250) => {
  const vA: Vector = { ...IDENTITY_VECTOR };
  const vB: Vector = { ...IDENTITY_VECTOR };
  const iId = setInterval(
    () => {
      const output = next(vA, vB);
      process.stdout.write('\r' + output + '\x1b[23A');
    },
    ms
  );

  return () => clearInterval(iId);
}

const twirlTimer = () => {
  const P = ['\\', '|', '/', '-'];
  let x = 0;
  return setInterval(
    () => {
      process.stdout.write('\r' + P[x++]);
      x &= 3;
    },
    250
  );
};
