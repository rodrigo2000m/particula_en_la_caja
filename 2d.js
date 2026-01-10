// --- Solución base ---
let solution = Shrodinger_solution(2, 5, 0, 1e-16, 1e-16, 1e-16);

const x = solution.x;
const y = solution.y;
const baseZ = solution.structured_wavefunction;

// --- Utilidades ---
const maxAbs = Math.max(...baseZ.flat().map(v => Math.abs(v)));

function waveAtTime(Z0, t, omega = 1) {
  const factor = Math.sin(omega * t);
  return Z0.map(row => row.map(v => v * factor));
}

// --- Trace inicial ---
var data = [{
  type: 'surface',
  x: x,
  y: y,
  z: waveAtTime(baseZ, 0),
  colorscale: 'RdBu',
  cmin: -maxAbs,
  cmax:  maxAbs,
  showscale: true,
}];

// --- Frames (animación temporal) ---
var frames = [];
const Nt = 60;
const omega = 2 * Math.PI;

for (let k = 0; k < Nt; k++) {
  const t = (k / Nt) * 2 * Math.PI;

  frames.push({
    name: `t=${t.toFixed(2)}`,
    data: [{
      z: waveAtTime(baseZ, t, omega)
    }]
  });
}

// --- Layout ---
var layout = {
  autosize: true,
  scene: {
    xaxis: { title: 'x' },
    yaxis: { title: 'y' },
    zaxis: {
      title: 'ψ(x,y,t)',
      range: [-maxAbs, maxAbs]
    }
  },
  updatemenus: [{
    type: 'buttons',
    showactive: false,
    x: 0.1,
    y: 0,
    buttons: [
      {
        label: '▶ Play',
        method: 'animate',
        args: [null, {
          frame: { duration: 100, redraw: true },
          transition: { duration: 0 },
        }]
      },
      {
        label: '⏸ Pause',
        method: 'animate',
        args: [[null], {
          mode: 'immediate',
          frame: { duration: 0, redraw: false }
        }]
      }
    ]
  }]
};

// --- Plot ---
Plotly.newPlot('2d_chart', data, layout).then(() => {
  Plotly.addFrames('2d_chart', frames);
});

