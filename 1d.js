function run1d(n) {
  console.log("Corriendo 1D "+ n);
  mainContent.innerHTML = `
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: space-between; width: 100%; height: 100%; box-sizing: border-box; padding: 10px;">
    <canvas id="canvas" style="border:1px solid black; width: 100%; flex: 1;"></canvas>
    <!--label>Quantum Number n: <span id="n-value">1</span>
      <input type="range" id="n-slider" min="1" max="10" value="1" />
    </label-->
    <label>Box Length L: <span id="l-value">1.00</span>
      <input type="range" id="l-slider" min="0.5" max="2" value="1" step="0.01" />
    </label>
  </div>
`;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const numPoints = 200;
  let L = 1; // Box length
  let quantumNumber = n; // Default quantum number
  let time = 0;
  let animationSpeed = 0.005;

  console.log("Dentro "+typeof(n_number))
  //const nSlider = document.getElementById("n-slider");

  const lSlider = document.getElementById("l-slider");
  //const nValue = document.getElementById("n-value");
  const lValue = document.getElementById("l-value");

  //nSlider.addEventListener("input", (event) => {
    //quantumNumber = parseInt(event.target.value);
    //nValue.textContent = quantumNumber;
  //});

  

  lSlider.addEventListener("input", (event) => {
    L = parseFloat(event.target.value);
    lValue.textContent = L.toFixed(2);
  });

  function waveFunction(n, x, t) {
    const k = Math.PI * n / L;
    return Math.sin(k * x) * Math.cos(k * k * t);
  }

  function drawAxes() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, height);
    ctx.stroke();

    // Labels
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText("x", width - 20, height / 2 - 10);
    ctx.fillText("ψ(x, t)", 60, 20);
  }

  function updateWave() {
    ctx.clearRect(0, 0, width, height);
    drawAxes();
    ctx.beginPath();
    ctx.moveTo(50, height / 2);

    for (let i = 0; i < numPoints; i++) {
      const x = (i / numPoints) * L;
      const y = height / 2 - waveFunction(quantumNumber, x, time) * 100;
      ctx.lineTo(50 + i * ((width - 100) / numPoints), y);
    }
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function animate() {
    updateWave();
    time += animationSpeed;
    requestAnimationFrame(animate);
  }

  animate();
}