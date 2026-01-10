function run1d(n,boxLength) {
	
  // Constantes básicas
  const width = 1000;
  const height = 400;
  const boxMargin = 50;
  const pts = 200;
  const baseOmega = 0.004;
  const amp = 1;
  const L = boxLength;
  const maxMultiple = 1;
  const pxPerUnit = 100; 
  const graphWidth  = pxPerUnit * L * maxMultiple *0.9+ 2 * boxMargin;
  const graphHeight = 500;      // keep your old height
  const tickVals = d3.range(0, maxMultiple + 1).map(k => k * L);

  // Limpiar SVG anterior
  const svg = d3.select("#sim");
  svg.selectAll("*").remove();
  svg.attr("viewBox", `0 0 ${graphWidth} ${graphHeight}`);
  
  //
  const wellH = height * 0.8;
  const boxTop = (height - wellH) / 4;

  // Crear escalas X e Y
  const xScale = d3.scaleLinear()
	.domain([0, L * maxMultiple])
	.range([boxMargin, graphWidth - boxMargin]);
  const yScale = d3.scaleLinear()
	.domain([-1.5, 1.5])
	.range([boxTop + wellH, boxTop]);
  
  // Crear ejes X e Y
  const xAxis = d3.axisBottom(xScale)
	.tickValues(tickVals)
	.tickFormat(d => d === 0 ? "0" : d);    // shows 2, 4, 6, … instead of 1L 2L 3L
  const yAxis = d3.axisLeft(yScale)
	.ticks(5);
  
  // Crear linea Y = 0
  const line = d3.line()
	.x(d => xScale(d.x))
	.y(d => yScale(d.val));
  
  // Crear area Psi^2
  const area = d3.area()
	.x(d => xScale(d.x))
	.y0(yScale(0))
	.y1(d => yScale(d.val));
  
  // Crear rectángulo para el gráfico
  svg.append("rect")
    .attr("x", boxMargin)
    .attr("y", boxTop)
   .attr("width", graphWidth - 2 * boxMargin)   // ← here
   .attr("height", wellH)
    .attr("fill", "none")
    .attr("stroke", "#222");
  
  // Ubicar ejes X e Y en sus posiciones
  svg.append("g")
	.attr("transform", `translate(0, ${boxTop + wellH})`)
	.call(xAxis);
 
 svg.append("g")
	.attr("transform", `translate(${boxMargin}, 0)`)
	.call(yAxis);

 // Agregar linea Y = 0
  svg.append("line")
    .attr("x1", boxMargin)
    .attr("x2", graphWidth - boxMargin)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", "grey")
    .attr("stroke-width", 2);
  
  // Agregar área Psi^2
  const probArea = svg.append("path")
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "none");
  
  // Agregar lineas parte Real e Imaginaria
  const realLine = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  const imagLine = svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2);

  // Agregar etiquetas
  const realLabel = svg.append("text")
    .attr("fill", "steelblue")
    .attr("font-size", "12px")
    .attr("text-anchor", "start")
    .text("Re(ψ)");

  const imagLabel = svg.append("text")
    .attr("fill", "orange")
    .attr("font-size", "12px")
    .attr("text-anchor", "start")
    .text("Im(ψ)");

  // Ubicar etiquetas
  const labelX = xScale(L) - 40;
  const realLabelY = boxTop + 15;
  const imagLabelY = boxTop + 35;
  
  // Dibujar etiquetas
  realLabel.attr("x", labelX)
           .attr("y", realLabelY);

  imagLabel.attr("x", labelX)
           .attr("y", imagLabelY);

  // MATEMÁTICA
  const omega = baseOmega * n * n; // Frecuencia para la ecuación dependiente del tiempo ¿Dejamos que varíe con n o la dejamos fija para que se pueda ver?
  const norm = Math.sqrt(2 / L);

  let baseψ = [];
  for (let i = 0; i <= pts; i++) {
    const x = (i / pts) * L;
    const psi0 = amp * Math.sin(n * Math.PI * x / L);
    baseψ.push({ x, psi0 });
  }

  const realVals = new Float64Array(pts + 1);
  const imagVals = new Float64Array(pts + 1);
  const probVals = new Float64Array(pts + 1);
  
  const realData = baseψ.map(p => ({ x: p.x, val: 0 }));
  const imagData = baseψ.map(p => ({ x: p.x, val: 0 }));
  const probData = baseψ.map(p => ({ x: p.x, val: 0 }));

  const standing_wave = d3.select("#standing_wave"); // Revisar el estado del checkbox "Onda estacionaria"
  const t0 = performance.now();

  // ANIMACIÓN
  function animate(now) {
	const t = now - t0;
	const isTimeOn = !standing_wave.property("checked");

	if (isTimeOn) {
		const phase = (omega * t) % (2 * Math.PI);
		for (let i = 0; i <= pts; i++) {
			realVals[i] = baseψ[i].psi0 * Math.cos(phase);
			imagVals[i] = -baseψ[i].psi0 * Math.sin(phase);
			probVals[i] = realVals[i] * realVals[i] + imagVals[i] * imagVals[i];
      
			realData[i].val = realVals[i];
			imagData[i].val = imagVals[i];
			probData[i].val = probVals[i];
		}

    probArea.attr("d", area(probData));
    realLine.attr("d", line(realData)).attr("visibility", "visible");
    imagLine.attr("d", line(imagData)).attr("visibility", "visible");
	} 
	
  else {
    for (let i = 0; i <= pts; i++) {
      realData[i].val = baseψ[i].psi0;
      probData[i].val = baseψ[i].psi0 * baseψ[i].psi0;
    }
    
	probArea.attr("d", area(probData));
    realLine.attr("d", line(realData)).attr("visibility", "visible");
    imagLine.attr("visibility", "hidden");
  }

  requestAnimationFrame(animate);
}

  animate(t0);
}















//Rodrigo .................................................................................


