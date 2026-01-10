let solution = Shrodinger_solution(4, 0, 0, 1e-16, 1, 1)

const max_wavefuntion = Math.max(...solution.wavefunction)
const max_prob_density = Math.max(...solution.prob_density)

var wavefunction = {
  x: solution.x,
  y: solution.wavefunction.map(x => x / max_wavefuntion), //nomerlization
  type: 'scatter',
  mode: 'lines'
};

var prob_density = {
  x: solution.x,
  y: solution.prob_density.map(x => x / max_prob_density), //nomerlization
  type: 'scatter',
  mode: 'lines',
  name: "Hola"
};

var data = [wavefunction, prob_density];
Plotly.newPlot('1d_chart', data);
