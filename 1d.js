// datos de prueba
//let solution = Shrodinger_solution(2, 0, 0, 1e-16, 1, 1);

//leer l1 y n1
const l1_order = document.getElementById("1d_l1_value").value;
const n1 = document.getElementById("1d_n1_value").value;

let l1 = l1_order*10e-9 

let solution = Shrodinger_solution(n1, 0, 0, l1, 1, 1)

// parametros para funcion estacionaria
const x = solution.x;
const psi0 = solution.wavefunction_x;
const rho0 = solution.prob_density;

// normalizacion
const maxPsi = Math.max(...psi0.map(v => Math.abs(v)));
const maxRho = Math.max(...rho0);

// funcion temporal
function psiAtTime(psi, t, omega = 1) {
  return psi.map(v => v * Math.sin(omega * t));
}

function rhoAtTime(psi, t, omega = 1) {
  const f = Math.sin(omega * t);
  return psi.map(v => (v * f) ** 2);
}

// trace inicial
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

// generacion de frames
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

// layour y controles
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

// graficar
Plotly.newPlot('1d_chart', data, layout).then(() => {
  Plotly.addFrames('1d_chart', frames);
});
