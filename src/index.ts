import { physics } from "./physics";
import * as THREE from "three";
const Stats = require("stats-js");

const phy = new physics("canvas3d");

for (let k = 0; k < 4; k++) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      phy.addBox({
        mass: 0.01,
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
  // const mouseX = (e.clientX/window.innerWidth) * 2 - 1;
  // const mouseY = -(e.clientY/window.innerHeight) * 2 + 1;
  // const pos = phy.unproject(mouseX, mouseY);
  const pos = phy.cameraPos();
  const mv = phy.cameraLookVec();
  ball(pos.x, pos.y, pos.z, mv.x, mv.y, mv.z);
  //randomBox();
})

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// main loop
function animate(time: number) {
  requestAnimationFrame(animate);
  stats.begin();
  // monitored code goes here
  phy.update(time);
  stats.end();
}

requestAnimationFrame(animate);

function ball(x:number, y:number, z:number, mx:number, my:number, mz:number) { 
  phy
    .addSphere({
      mass: 0.2,
      radius: 2,
      color: "#aaaaff",
      x: x+mx*5,
      y: y+my*5,
      z: z+mz*5
    })
    .setVelocity(mx*30, my*30, mz*30)
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
        w: 1,
        h: 1,
        d: 1,
        x: x,
        y: y,
        z: z,
        color: "#ffaabb"
      })
      .setVelocity(mx, my, mz);
  }
}
