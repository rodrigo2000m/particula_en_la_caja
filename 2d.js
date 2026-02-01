import { Shrodinger_solution } from './wavefunction_energies.js';
// --- Solución base ---
//let solution = Shrodinger_solution(2, 5, 0, 1e-16, 1e-16, 1e-16);

//leer l1, l2, n1, n2 y si esta activa la funcion estacionaria
const l1 = document.getElementById("2d_l1_value");
const l2 = document.getElementById("2d_l2_value");
const n1 = document.getElementById("2d_n1_value");
const n2 = document.getElementById("2d_n2_value");
const standing_wave = document.getElementById("standing_wave_2d");
let animationRunning = false;
let frames = [];
const Nt = 60;
const omega = 2 * Math.PI;

// funcion temporal
function psiAtTime(psi0, t, omega = 1) {
  const factor = Math.cos(omega * t);
  return psi0.map(row => row.map(v => v * factor));
}

// generacion de frames
function generate_frames(psi0, maxPsi) {
  for (let k = 0; k < Nt; k++) {
    const t = (k / Nt) * 2 * Math.PI;

    frames.push({
      name: `t=${t.toFixed(2)}`,
      data: [
        {
          z: psiAtTime(psi0, t, omega) //.map(v => v / maxPsi)
        }
      ]
    });
  }

  /*
for (let k = 0; k < Nt; k++) {
  const t = (k / Nt) * 2 * Math.PI;

  frames.push({
    name: `t=${t.toFixed(2)}`,
    data: [{
      z: waveAtTime(baseZ, t, omega)
    }]
  });
}*/

}

function animateLoop() {
  if (standing_wave.checked) {
    animationRunning = false;
    return; // corta limpio
  }

  animationRunning = true;

  Plotly.animate(
    '2d_chart',
    frames.map(f => f.name),
    {
      frame: { duration: 80, redraw: true },
      transition: { duration: 0 },
      mode: 'immediate'
    }
  ).then(() => {
    if (!standing_wave.checked) {
      animateLoop();
    } else {
      animationRunning = false;
    }
  });
}


function reset_view() {
  const value_l1 = l1.value;
  const value_n1 = n1.value;
  const value_l2 = l2.value;
  const value_n2 = n2.value;
  const standing_wave_active = standing_wave.value;

  //convertir a nm l1 y l2
  let value_l1_nm = value_l1 * 10 ** -9
  let value_l2_nm = value_l2 * 10 ** -9
  //solucion de SE
  let solution = Shrodinger_solution(value_n1, value_n2, 0, value_l1_nm, value_l2_nm, 1)

  // parametros para funcion estacionaria
  const x = solution.x;
  const y = solution.y;
  const psi0 = solution.structured_wavefunction;

  // normalizacion
  const maxPsi = Math.max(...psi0.flat().map(v => Math.abs(v)));

  generate_frames(psi0, maxPsi)

  // --- Trace inicial ---
  var data = [{
    type: 'surface',
    x: x,
    y: y,
    z: psiAtTime(psi0, 0),
    colorscale: 'RdBu',
    cmin: -maxPsi,
    cmax: maxPsi,
    showscale: true,
  }];

  // --- Layout ---
  var layout = {
    autosize: true,
    scene: {
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
      zaxis: {
        title: 'ψ(x,y,t)',
        range: [-maxPsi, maxPsi]
      }
    }
  };

  // --- Plot ---
  //Plotly.newPlot('2d_chart', data, layout).then(() => {
  //Plotly.addFrames('2d_chart', frames);
  //});

  Plotly.newPlot('2d_chart', data, layout).then(() => {
      Plotly.addFrames('2d_chart', frames);
      if (!standing_wave.checked) {
        animateLoop();
      }
    });

}





reset_view()
l1.addEventListener("input", reset_view);
n1.addEventListener("input", reset_view);
l2.addEventListener("input", reset_view);
n2.addEventListener("input", reset_view);
standing_wave.addEventListener("change", reset_view);












/////////////////////////////////////////////////////////////


