// datos de prueba
//let solution = Shrodinger_solution(2, 0, 0, 1e-16, 1, 1);

//leer l1 y n1
const l1 = document.getElementById("1d_l1_value");
const n1 = document.getElementById("1d_n1_value");
const standing_wave = document.getElementById("standing_wave")

// funcion temporal
function psiAtTime(psi, t, omega = 1) {
  return psi.map(v => v * Math.cos(omega * t));
}

function rhoAtTime(psi, t, omega = 1) {
  const f = Math.sin(omega * t);
  return psi.map(v => (v * f) ** 2);
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

  var wavefunction = {
    x: x,
    y: psiAtTime(psi0, 0).map(v => v / maxPsi),
    type: 'scatter',
    mode: 'lines',
  }

  var data = [wavefunction]

  //var data = [wavefunction, prob_density];

  // generacion de frames
  var frames = [];
  let frameIndex = 0;

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
    /*yaxis2: {
      title: '|ψ(x,t)|²',
      overlaying: 'y',
      side: 'right',
      range: [0, 1.1]
    }*/
  };

  // graficar
  Plotly.newPlot('1d_chart', data, layout).then(() => {
    Plotly.addFrames('1d_chart', frames); 
  });
}

reset_view()
l1.addEventListener("input", reset_view);
n1.addEventListener("input", reset_view);
standing_wave.addEventListener("change", reset_view);
