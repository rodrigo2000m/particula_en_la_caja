let solution = Shrodinger_solution(2, 0, 0, 1e-16, 1, 1)

const max_wavefuntion = Math.max(...solution.completed_wavefunction)
const max_prob_density = Math.max(...solution.prob_density)

var wavefunction = {
  x: solution.new_x,
  y: solution.completed_wavefunction.map(x => x / max_wavefuntion), //nomerlization
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
