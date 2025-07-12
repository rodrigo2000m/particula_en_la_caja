// constants
const h = 6.62607015e-34 // units J*s 
const m = 9.1093837139e-31 // kg
const factor_J_to_eV = 6.242e+18 // factor of conversion of J to eV

function Shrodinger_solution(n1, n2, n3, l1, l2, l3){ // se puede usar una sola funcion, cuando es 1d n2=n3=0 y l2=l3=1 (para evitar problemas con las cuentas)
    let n_points = 100; // number of points between 0 and l
    let E = (h**2/(8*m))*(n1**2/(l1**2) + n2**2/(l2**2) + n3**2/(l3**2))*factor_J_to_eV;

    //grid from l1, l2 and l3
    let x = Array.from({length: n_points}, (_, i) => (i * l1) / (n_points-1));
    let y = Array.from({length: n_points}, (_, i) => (i * l2) / (n_points-1));
    let z = Array.from({length: n_points}, (_, i) => (i * l3) / (n_points-1));

    //components of wavefunction
    let wavefunction_x = x.map(i => Math.sqrt(2/(l1))*Math.sin(n1*Math.PI*i/l1)); // stationary function
    let wavefunction_y = y.map(i => Math.sqrt(2/(l2))*Math.sin(n2*Math.PI*i/l2));
    let wavefunction_z = z.map(i => Math.sqrt(2/(l3))*Math.sin(n3*Math.PI*i/l3)); 

    //probability density function
    let prob_density_x = wavefunction_x.map((value, i) => value*wavefunction_x[i])
    let prob_density_y = wavefunction_y.map((value, i) => value*wavefunction_y[i])
    let prob_density_z = wavefunction_z.map((value, i) => value*wavefunction_z[i])

    let wavefunction_x_y = wavefunction_x.map((value, i) => value*wavefunction_y[i])
    let wavefunction

    //results from dimension problem
    
    if (l2==1 & l3==1){
        wavefunction = wavefunction_x
        prob_density = prob_density_x

    }else if(l3=1){
        wavefunction = wavefunction_x_y
        prob_density = prob_density_x.map((value, i) => value*prob_density_y[i])
    }else{
        wavefunction = wavefunction_z.map((value, i) => value*wavefunction_x_y[i])
        prob_density_x_y = prob_density_x.map((value, i) => value*prob_density_y[i])
        prob_density = prob_density_x_y.map((value, i) => value*prob_density_z[i])
    }

    return x, y, z, E, wavefunction, prob_density //E, x, y, z wavefunction
}


//console.log(Shrodinger_solution(2, 2, 2, 1e-10, 1e-11, 1))

