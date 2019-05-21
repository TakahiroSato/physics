import { myThreeJs } from "./myThreeJs";
const Cannon = require("cannon");
const Stats = require("stats-js");

const world = new Cannon.World();
world.gravity.set(0, 0, -9.8);
world.broadphase = new Cannon.NaiveBroadphase();
//world.solver.iterations = 8;
//world.solver.torerance = 0.1;

const mass = 100;
const shape = new Cannon.Box(new Cannon.Vec3(5, 5, 5));
const phyBox = new Cannon.Body({mass, shape});
phyBox.position.set(-10, 10, 10);
phyBox.velocity.set(10, 0, 0);
phyBox.angularVelocity.set(0, 5, 10);
phyBox.angularDamping = 0.1;
world.add(phyBox);

const sphereShape = new Cannon.Sphere(5);
const sphereBody = new Cannon.Body({mass: 5, shape: sphereShape});
sphereBody.position.set(10, 10, 10);
world.add(sphereBody);

const phyPlane = new Cannon.Body({mass: 0, shape: new Cannon.Plane()});
//phyPlane.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), -Math.PI/ 2);
world.add(phyPlane);

const three = new myThreeJs("canvas3d");
const box = three.drawBox(0, 0, 10, 10, 10, '#ff00ff');
const sphere = three.drawSphere(10, 10, 10, 5, 8, 6, '#00ffff');

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// main loop
(function animate() {
  stats.begin();
  // monitored code goes here
  box.copy(phyBox.position, phyBox.quaternion);
  sphere.copy(sphereBody.position, sphereBody.quaternion);
  world.step(1 / 60);
  three.render();
  stats.end();
  requestAnimationFrame(animate);
})();
