// datos de prueba
//let solution = Shrodinger_solution(2, 0, 0, 1e-16, 1, 1);

//leer l1 y n1
const l1 = document.getElementById("1d_l1_value");
const n1 = document.getElementById("1d_n1_value");
const standing_wave = document.getElementById("standing_wave")
let animationRunning = false;
var frames = [];
const Nt = 60;
const omega = 2 * Math.PI;



// funcion temporal
function psiAtTime(psi, t, omega = 1) {
  return psi.map(v => v * Math.cos(omega * t));
}

function rhoAtTime(psi, t, omega = 1) {
  const f = Math.sin(omega * t);
  return psi.map(v => (v * f) ** 2);
}


// generacion de frames
function generate_frames(psi0, maxPsi) {
  for (let k = 0; k < Nt; k++) {
    const t = (k / Nt) * 2 * Math.PI;

    frames.push({
      name: `t=${t.toFixed(2)}`,
      data: [
        {
          y: psiAtTime(psi0, t, omega).map(v => v / maxPsi)
        }/*,
        {
          y: rhoAtTime(psi0, t, omega).map(v => v / maxRho)
        }*/
      ]
    });
  }
}

function animateLoop() {
  const standing_wave = document.getElementById("standing_wave");
  if (standing_wave.checked) {
    animationRunning = false;
    return; // corta limpio
  }

  animationRunning = true;

  Plotly.animate(
    '1d_chart',
    frames.map(f => f.name),
    {
      frame: { duration: 40, redraw: true },
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
  const standing_wave_active = standing_wave.value;

  //convertir a nm l1
  let value_l1_nm = value_l1 * 10e-9
  //solucion de SE
  let solution = Shrodinger_solution(value_n1, 0, 0, value_l1_nm, 1, 1)

  // parametros para funcion estacionaria
  const x = solution.x;
  const psi0 = solution.wavefunction_x;
  const rho0 = solution.prob_density;

  // normalizacion
  const maxPsi = Math.max(...psi0.map(v => Math.abs(v)));
  const maxRho = Math.max(...rho0);

  generate_frames(psi0, maxPsi)

  var wavefunction = {
    x: x,
    y: psiAtTime(psi0, 0).map(v => v / maxPsi),
    type: 'scatter',
    mode: 'lines',
  }

  var data = [wavefunction]

  //var data = [wavefunction, prob_density];
  // layout y controles
  var layout = {
    title: 'Función de onda 1D dependiente del tiempo',
    xaxis: { title: 'x' },
    yaxis: { title: 'ψ(x,t)', range: [-1.1, 1.1] },
    /*yaxis2: {
      title: '|ψ(x,t)|²',
      overlaying: 'y',
      side: 'right',
      range: [0, 1.1]
    }*/
  };


  Plotly.newPlot(
    '1d_chart',
    [
      {
        x: x,
        y: psiAtTime(psi0, 0, omega).map(v => v / maxPsi),
        mode: 'lines',
        name: 'ψ'
      }/*,
    {
      x: x,
      y: rhoAtTime(psi0, 0, omega).map(v => v / maxRho),
      mode: 'lines',
      name: '|ψ|²'
    }*/
    ],
    {
      xaxis: { title: 'x' },
      yaxis: { range: [-1.2, 1.2] },
      showlegend: true
    }
  ).then(() => {
    Plotly.addFrames('1d_chart', frames);
    if (standing_wave_active == "yes") {
      animateLoop();
    }
  });

}

reset_view()
l1.addEventListener("input", reset_view);
n1.addEventListener("input", reset_view);
standing_wave.addEventListener("change", reset_view);
