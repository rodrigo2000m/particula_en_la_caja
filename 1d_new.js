// =====================================
// SOLUCIÓN BASE
// =====================================
let solution = Shrodinger_solution(2, 0, 0, 1e-16, 1, 1);

const x = solution.x;
const psi0 = solution.wavefunction_x;
const rho0 = solution.prob_density;

// normalización
const maxPsi = Math.max(...psi0.map(v => Math.abs(v)));
const maxRho = Math.max(...rho0);

// =====================================
// FUNCIÓN TEMPORAL
// =====================================
function psiAtTime(psi, t, omega = 1) {
  return psi.map(v => v * Math.sin(omega * t));
}

function rhoAtTime(psi, t, omega = 1) {
  const f = Math.sin(omega * t);
  return psi.map(v => (v * f) ** 2);
}

// =====================================
// TRACE INICIAL
// =====================================
var wavefunction = {
  x: x,
  y: psiAtTime(psi0, 0).map(v => v / maxPsi),
  type: 'scatter',
  mode: 'lines',
  name: 'ψ(x,t)',
  line: { color: 'blue' }
};

var prob_density = {
  x: x,
  y: rhoAtTime(psi0, 0).map(v => v / maxRho),
  type: 'scatter',
  mode: 'lines',
  name: '|ψ(x,t)|²',
  yaxis: 'y2',
  line: { color: 'red' }
};

var data = [wavefunction, prob_density];

// =====================================
// FRAMES
// =====================================
var frames = [];
const Nt = 60;
const omega = 2 * Math.PI;

for (let k = 0; k < Nt; k++) {
  const t = (k / Nt) * 2 * Math.PI;

  frames.push({
    name: `t=${t.toFixed(2)}`,
    data: [
      {
        y: psiAtTime(psi0, t, omega).map(v => v / maxPsi)
      },
      {
        y: rhoAtTime(psi0, t, omega).map(v => v / maxRho)
      }
    ]
  });
}

// =====================================
// LAYOUT + CONTROLES
// =====================================
var layout = {
  title: 'Función de onda 1D dependiente del tiempo',
  xaxis: { title: 'x' },
  yaxis: { title: 'ψ(x,t)', range: [-1.1, 1.1] },
  yaxis2: {
    title: '|ψ(x,t)|²',
    overlaying: 'y',
    side: 'right',
    range: [0, 1.1]
  },
  updatemenus: [{
    type: 'buttons',
    showactive: false,
    x: 0.1,
    y: 1.15,
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
Plotly.newPlot('1d_chart', data, layout).then(() => {
  Plotly.addFrames('1d_chart', frames);
});
