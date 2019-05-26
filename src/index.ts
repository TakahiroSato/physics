import { physics } from "./physics";
import * as THREE from "three";
const Stats = require("stats-js");

const phy = new physics("canvas3d");

for (let k = 0; k < 4; k++) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      phy.addBox({
        mass: 0.1,
        w: 1,
        h: 1,
        d: 1,
        color: "#ffaabb",
        x: 2 * j - 4,
        y: 2 * i,
        z: 2 * k + 1
      });
    }
  }
}

document.addEventListener("click", e => {
  const mouseX = (e.clientX/window.innerWidth) * 2 - 1;
  const mouseY = -(e.clientY/window.innerHeight) * 2 + 1;
  const pos = phy.unproject(mouseX, mouseY);
  ball(pos.x, pos.y, pos.z);
})

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// main loop
function animate(time: number) {
  stats.begin();
  // monitored code goes here
  phy.update(time);
  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

function ball(x:number, y:number, z:number) { 
  phy
    .addSphere({
      mass: 1,
      radius: 2,
      color: "#aaaaff",
      x: x,
      y: y,
      z: z
    })
    .setVelocity(0, 30, 0)
}

function randomBox() {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * 250) - 125;
    const y = Math.floor(Math.random() * 250) - 125;
    const z = Math.floor(Math.random() * 125);
    const mx = Math.floor(Math.random() * 50) - 25;
    const my = Math.floor(Math.random() * 50) - 25;
    const mz = Math.floor(Math.random() * 50) - 25;
    phy
      .addBox({
        mass: 0.1,
        w: Math.abs(mx),
        h: Math.abs(my),
        d: Math.abs(mz),
        x: x,
        y: y,
        z: z,
        color: "#ffaabb"
      })
      .setVelocity(mx, my, mz);
  }
}
