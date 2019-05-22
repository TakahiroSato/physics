import { myThreeJs } from "./myThreeJs";
import { physics } from "./physics";
const Stats = require("stats-js");

const phy = new physics("canvas3d");
for(let i = 0; i < 100; i++){
  const x = Math.floor(Math.random() * 250) - 125;
  const y = Math.floor(Math.random() * 250) - 125;
  const z = Math.floor(Math.random() * 125);
  const mx = Math.floor(Math.random() * 50) - 25;
  const my = Math.floor(Math.random() * 50) - 25;
  const mz = Math.floor(Math.random() * 50) - 25;
  phy
    .addBox({
      mass: 1,
      w: 10,
      h: 10,
      d: 10,
      x: x,
      y: y,
      z: z,
      color: "#ff0000"
    })
    .setVelocity(mx, my, mz);
  }

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// main loop
(function animate() {
  stats.begin();
  // monitored code goes here
  phy.update();
  stats.end();
  requestAnimationFrame(animate);
})();
