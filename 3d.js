import { Shrodinger_solution } from './wavefunction_energies.js';

// datos de prueba
//let solution = Shrodinger_solution(2, 2, 2, 1e-16, 1e-16, 1e-16);

//leer l1, l2, l3, n1, n2, n3
const l1 = document.getElementById("3d_l1_value");
const l2 = document.getElementById("3d_l2_value");
const l3 = document.getElementById("3d_l3_value");
const n1 = document.getElementById("3d_n1_value");
const n2 = document.getElementById("3d_n2_value");
const n3 = document.getElementById("3d_n3_value");
const standing_wave = document.getElementById("standing_wave_3d")

let animationRunning = false;
let frames = [];

const Nt = 60;
const omega = 2 * Math.PI;

// funcion temporal
function psiAtTime(psi, t, omega = 1) {
  const factor = Math.cos(omega * t);
  return psi.map(v => v * factor);
}

// generacion de frames
function generate_frames(psi0, maxPsi) {
  var frames = [];

  for (let k = 0; k < Nt; k++) {
    const t = (k / Nt) * 2 * Math.PI;

    frames.push({
      name: `t=${t.toFixed(2)}`,
      data: [{
        marker: {
          color: psiAtTime(psi0, t, omega),
          size: psiAtTime(psi0, t, omega).map(v => 4 + 8 * Math.abs(v) / maxPsi),
        }
      }]
    });
  }

  return frames;
}

function animateLoop() {
  if (standing_wave.checked) {
    animationRunning = false;
    return;
  }

  animationRunning = true;

  Plotly.animate(
    '3d_chart',
    frames.map(f => f.name),
    {
      frame: { duration: 60, redraw: true },
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
  const value_l2 = l2.value;
  const value_l3 = l3.value;
  const value_n1 = n1.value;
  const value_n2 = n2.value;
  const value_n3 = n3.value;
  const standing_wave_active = standing_wave.value;

  //convertir a nm l1, l2 y l3
  let value_l1_nm = value_l1 * 10 ** -9
  let value_l2_nm = value_l2 * 10 ** -9
  let value_l3_nm = value_l3 * 10 ** -9

  //solucion de SE
  let solution = Shrodinger_solution(value_n1, value_n2, value_n3, value_l1_nm, value_l2_nm, value_l3_nm)

  const tensor = solution.structured_wavefunction;

  // dimensiones
  const nz = tensor.length;
  const nx = tensor[0].length;
  const ny = tensor[0][0].length;

  // preprocesado donde agregar los datos
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

  const maxPsi = Math.max(...psi0.map(v => Math.abs(v)));

  psiAtTime(psi0, 0)

  frames = generate_frames(psi0, maxPsi);

  var data = [{
    type: 'scatter3d',
    mode: 'markers',
    hovermode: false,
    x: x,
    y: y,
    z: z,
    marker: {
      size: psi0.map(v => 4 + 8 * Math.abs(v) / maxPsi),
      color: psiAtTime(psi0, 0),
      colorscale: 'RdBu',
      cmin: -maxPsi,
      cmax: maxPsi,
      opacity: 0.85,
      colorbar: { title: 'ψ(x,y,z,t)' }
    }
  }];

  var layout = {
    title: 'Función de onda 3D dependiente del tiempo',
    scene: {
      xaxis: { title: 'x' },
      yaxis: { title: 'y' },
      zaxis: { title: 'z' }
    }
  };

  Plotly.newPlot('3d_chart', data, layout).then(() => {
    Plotly.addFrames('3d_chart', frames);
    if (!standing_wave.checked) {
      animateLoop();
    }
  });
}

reset_view()

l1.addEventListener("input", reset_view);
l2.addEventListener("input", reset_view);
l3.addEventListener("input", reset_view);
n1.addEventListener("input", reset_view);
n2.addEventListener("input", reset_view);
n3.addEventListener("input", reset_view);
standing_wave.addEventListener("change", reset_view);
