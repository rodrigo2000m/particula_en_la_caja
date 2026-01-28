// =====================================
// SOLUCIÓN BASE
// =====================================
let solution = Shrodinger_solution(2, 2, 2, 1e-16, 1e-16, 1e-16);

const tensor = solution.structured_wavefunction;

// Dimensiones
const nz = tensor.length;
const nx = tensor[0].length;
const ny = tensor[0][0].length;

// =====================================
// PREPROCESADO ESPACIAL
// =====================================
let x = [], y = [], z = [], psi0 = [];
let maxPsi2 = 0;

// máximo de |ψ|²
for (let k = 0; k < nz; k++) {
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const v = tensor[k][i][j];
      maxPsi2 = Math.max(maxPsi2, v * v);
    }
  }
}

// umbral para no dibujar todo
const threshold = 0.05;

for (let k = 0; k < nz; k++) {
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const v = tensor[k][i][j];
      if ((v * v) / maxPsi2 > threshold) {
        x.push(i);
        y.push(j);
        z.push(k);
        psi0.push(v);
      }
    }
  }
}

const maxAbs = Math.max(...psi0.map(v => Math.abs(v)));

// =====================================
// FUNCIÓN TEMPORAL
// =====================================
function waveAtTime(values, t, omega = 1) {
  const factor = Math.sin(omega * t);
  return values.map(v => v * factor);
}

// =====================================
// TRACE INICIAL
// =====================================
var data = [{
  type: 'scatter3d',
  mode: 'markers',
  x: x,
  y: y,
  z: z,
  marker: {
    size: psi0.map(v => 4 + 8 * Math.abs(v) / maxAbs),
    color: waveAtTime(psi0, 0),
    colorscale: 'RdBu',
    cmin: -maxAbs,
    cmax:  maxAbs,
    opacity: 0.85,
    colorbar: { title: 'ψ(x,y,z,t)' }
  }
}];

// =====================================
// FRAMES (ANIMACIÓN TEMPORAL)
// =====================================
var frames = [];
const Nt = 60;
const omega = 2 * Math.PI;

for (let k = 0; k < Nt; k++) {
  const t = (k / Nt) * 2 * Math.PI;

  frames.push({
    name: `t=${t.toFixed(2)}`,
    data: [{
      marker: {
        color: waveAtTime(psi0, t, omega),
        size: psi0.map(v =>
          4 + 8 * Math.abs(v * Math.sin(omega * t)) / maxAbs
        )
      }
    }]
  });
}

// =====================================
// LAYOUT + CONTROLES
// =====================================
var layout = {
  title: 'Función de onda 3D dependiente del tiempo',
  scene: {
    xaxis: { title: 'x' },
    yaxis: { title: 'y' },
    zaxis: { title: 'z' }
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
          frame: { duration: 80, redraw: true },
          transition: { duration: 0 },
          mode: 'immediate'
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

// =====================================
// PLOT
// =====================================
Plotly.newPlot('3d_chart', data, layout).then(() => {
  Plotly.addFrames('3d_chart', frames);
});
