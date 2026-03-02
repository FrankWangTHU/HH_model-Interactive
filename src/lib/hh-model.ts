export interface HHParams {
  C_m: number; // uF/cm^2
  g_Na: number; // mS/cm^2
  g_K: number; // mS/cm^2
  g_L: number; // mS/cm^2
  E_Na: number; // mV
  E_K: number; // mV
  E_L: number; // mV
  I_ext: number; // uA/cm^2
  I_start: number; // ms
  I_end: number; // ms
  duration: number; // ms
  dt: number; // ms
}

export const defaultParams: HHParams = {
  C_m: 1.0,
  g_Na: 120.0,
  g_K: 36.0,
  g_L: 0.3,
  E_Na: 50.0,
  E_K: -77.0,
  E_L: -54.387,
  I_ext: 10.0,
  I_start: 10.0,
  I_end: 40.0,
  duration: 50.0,
  dt: 0.01,
};

// Rate functions
const alpha_n = (V: number) => {
  const v = V + 55;
  if (Math.abs(v) < 1e-6) return 0.1; // L'Hopital
  return (0.01 * v) / (1 - Math.exp(-v / 10));
};
const beta_n = (V: number) => 0.125 * Math.exp(-(V + 65) / 80);

const alpha_m = (V: number) => {
  const v = V + 40;
  if (Math.abs(v) < 1e-6) return 1.0; // L'Hopital
  return (0.1 * v) / (1 - Math.exp(-v / 10));
};
const beta_m = (V: number) => 4.0 * Math.exp(-(V + 65) / 18);

const alpha_h = (V: number) => 0.07 * Math.exp(-(V + 65) / 20);
const beta_h = (V: number) => 1.0 / (1 + Math.exp(-(V + 35) / 10));

export function simulateHH(params: HHParams) {
  const {
    C_m,
    g_Na,
    g_K,
    g_L,
    E_Na,
    E_K,
    E_L,
    I_ext,
    I_start,
    I_end,
    duration,
    dt,
  } = params;

  const steps = Math.floor(duration / dt);
  const data = [];

  // Initial conditions (resting state)
  let V = -65.0;
  let n = alpha_n(V) / (alpha_n(V) + beta_n(V));
  let m = alpha_m(V) / (alpha_m(V) + beta_m(V));
  let h = alpha_h(V) / (alpha_h(V) + beta_h(V));

  // Downsample for charting to keep UI responsive
  const downsampleFactor = Math.max(1, Math.floor(0.1 / dt));

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const I = t >= I_start && t <= I_end ? I_ext : 0;

    if (i % downsampleFactor === 0) {
      data.push({
        t: parseFloat(t.toFixed(2)),
        V: parseFloat(V.toFixed(2)),
        n: parseFloat(n.toFixed(4)),
        m: parseFloat(m.toFixed(4)),
        h: parseFloat(h.toFixed(4)),
        I_Na: parseFloat((g_Na * Math.pow(m, 3) * h * (V - E_Na)).toFixed(2)),
        I_K: parseFloat((g_K * Math.pow(n, 4) * (V - E_K)).toFixed(2)),
        I_L: parseFloat((g_L * (V - E_L)).toFixed(2)),
        I_ext: I,
      });
    }

    // Euler method
    const dV =
      (I -
        g_Na * Math.pow(m, 3) * h * (V - E_Na) -
        g_K * Math.pow(n, 4) * (V - E_K) -
        g_L * (V - E_L)) /
      C_m;
    const dn = alpha_n(V) * (1 - n) - beta_n(V) * n;
    const dm = alpha_m(V) * (1 - m) - beta_m(V) * m;
    const dh = alpha_h(V) * (1 - h) - beta_h(V) * h;

    V += dV * dt;
    n += dn * dt;
    m += dm * dt;
    h += dh * dt;
  }

  return data;
}
