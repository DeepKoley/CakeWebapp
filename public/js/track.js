/* =========================================================
   CAKERMAKER - LIVE DELIVERY TRACKER & TELEMETRY ENGINE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLiveAgentSimulation();
  initOrderSearchForm();
});

// Live Agent Simulation State
let simulationProgress = 0.45; // 45% along route initially
let etaSeconds = 18 * 60; // 18 minutes in seconds
let remainingDistanceKm = 1.4;

function initLiveAgentSimulation() {
  const agentPin = document.getElementById('liveAgentPin');
  const hudEta = document.getElementById('hudEta');
  const hudDistance = document.getElementById('hudDistance');
  const hudSpeed = document.getElementById('hudSpeed');
  const hudTemp = document.getElementById('hudTemp');
  const hudLocation = document.getElementById('agentCurrentLocationText');

  if (!agentPin) return;

  // Waypoints along a curved road from Bakery (16%, 25%) to Customer (84%, 75%)
  const waypoints = [
    { x: 16, y: 25, loc: 'Park Street Central Bakery' },
    { x: 26, y: 30, loc: 'Exide Crossing' },
    { x: 38, y: 42, loc: 'Camac Street Roundabout' },
    { x: 50, y: 50, loc: 'Park Street Flyover (1.4 km away)' },
    { x: 62, y: 58, loc: 'Mullick Bazar Crossing' },
    { x: 74, y: 68, loc: 'Approaching Your Street' },
    { x: 84, y: 75, loc: 'Arriving at Your Doorstep!' }
  ];

  // 1. Move vehicle every 3.5 seconds
  setInterval(() => {
    if (simulationProgress < 0.96) {
      simulationProgress += 0.025;
      remainingDistanceKm = Math.max(0.1, +(remainingDistanceKm - 0.05).toFixed(2));
      etaSeconds = Math.max(60, etaSeconds - 15);
    } else {
      // Loop or stay close
      simulationProgress = 0.95;
    }

    // Interpolate coordinates along the curve
    const t = simulationProgress;
    // Cubic bezier or parametric interpolation
    const startX = 16, startY = 25;
    const ctrl1X = 40, ctrl1Y = 20;
    const ctrl2X = 55, ctrl2Y = 80;
    const endX = 84, endY = 75;

    // Cubic Bezier formula
    const curX = Math.pow(1 - t, 3) * startX +
                 3 * Math.pow(1 - t, 2) * t * ctrl1X +
                 3 * (1 - t) * Math.pow(t, 2) * ctrl2X +
                 Math.pow(t, 3) * endX;

    const curY = Math.pow(1 - t, 3) * startY +
                 3 * Math.pow(1 - t, 2) * t * ctrl1Y +
                 3 * (1 - t) * Math.pow(t, 2) * ctrl2Y +
                 Math.pow(t, 3) * endY;

    agentPin.style.left = `${curX}%`;
    agentPin.style.top = `${curY}%`;

    // Update Telemetry
    if (hudDistance) hudDistance.innerText = `${remainingDistanceKm} km`;
    
    // Slight jitter to speed (24 to 34 km/h)
    const simulatedSpeed = Math.floor(25 + Math.random() * 8);
    if (hudSpeed) hudSpeed.innerText = `${simulatedSpeed} km/h`;

    // Box temperature slightly fluctuates around 4.1°C - 4.4°C
    const simulatedTemp = (4.1 + Math.random() * 0.3).toFixed(1);
    if (hudTemp) hudTemp.innerText = `${simulatedTemp}°C`;

    // Current landmark name
    const wpIndex = Math.min(waypoints.length - 1, Math.floor(t * waypoints.length));
    if (hudLocation && waypoints[wpIndex]) {
      hudLocation.innerText = waypoints[wpIndex].loc;
    }
  }, 3000);

  // 2. Countdown Clock (every 1 second)
  setInterval(() => {
    if (etaSeconds > 60) {
      etaSeconds--;
      const mins = Math.floor(etaSeconds / 60);
      const secs = etaSeconds % 60;
      if (hudEta) {
        hudEta.innerText = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
      }
    }
  }, 1000);
}

function initOrderSearchForm() {
  const form = document.getElementById('orderSearchForm');
  const input = document.getElementById('orderSearchInput');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) {
        alert('Please enter an Order ID (e.g. CK-10928).');
        return;
      }
      window.location.href = `/track/${encodeURIComponent(val)}`;
    });
  }
}

function quickTrackOrder(orderId) {
  const input = document.getElementById('orderSearchInput');
  if (input) input.value = orderId;
  window.location.href = `/track/${encodeURIComponent(orderId)}`;
}
