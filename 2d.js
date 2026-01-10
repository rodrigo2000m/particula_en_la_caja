let solution = Shrodinger_solution(1, 1, 1, 3, 3, 2)


// pause
//console.log(solution)
const max_wavefuntion = Math.max(...solution.wavefunction)
const max_prob_density = Math.max(...solution.prob_density)
const max_x = Math.max(...solution.x)
const max_y = Math.max(...solution.y)
const max_z = Math.max(...solution.z)

/*
var data = [{
    type: 'surface',
    z: [
        solution.x.map(x => x / max_x), //nomerlization
        solution.y.map(y => y / max_y), //nomerlization
        solution.z.map(z => z / max_z),
        solution.z  //nomerlization
        //solution.prob_density //nomerlization
    ]
}];

var z = [
  [1, 1, 1, 1],
  [1, 1, 1, 2]

];

var data = [{
  type: 'surface',
  x: [0, 2, 4, 6],
  z: [0, 2, 4, 6],
  z: z
}];

var layout = {
    autosize: true
}


Plotly.newPlot('2d_chart', data, layout)
*/

  var x = [];
  var y = [];
  var z = [];

  // Nube de puntos 3D (paraboloide)
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      x.push(i/32);
      y.push(j/56);
      z.push(i*i+j*j);
    }
  }

console.log(x)
console.log(y)
console.log(z)
console.log(solution.x)
  var mesh = {
    type: 'mesh3d',
    x: x,
    y: y,
    z: z,
    alphahull: 0,
    opacity: 0.5
  };
  

  Plotly.newPlot('mesh', [mesh]);

