const CANNON = require("cannon");

export class cannonObject{
  public body: any;
  constructor(body:any){
    this.body = body;
  }
}

export class myCannon {
  private world: any;
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -9.82);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 8;
    this.world.solver.torerance = 0.1;
    // 地面
    const phyPlane = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    //phyPlane.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), -Math.PI/ 2);
    this.world.add(phyPlane);
  }
  addBox(obj: {
      mass: number,
      w: number,
      h: number,
      d: number,
      x?: number,
      y?: number,
      z?: number
    }
  ) {
    if(!obj.x) obj.x = 0;
    if(!obj.y) obj.y = 0;
    if(!obj.z) obj.z = obj.d
    const shape = new CANNON.Box(new CANNON.Vec3(obj.w, obj.h, obj.d));
    const phyBox = new CANNON.Body({ mass: obj.mass, shape: shape });
    phyBox.position.set(obj.x, obj.y, obj.z);
    this.world.add(phyBox);
    return new cannonObject(phyBox);
  }
  addSphere(
    mass: number,
    radius: number,
    x: number = 0,
    y: number = 0,
    z: number = radius
  ) {
    const sphereShape = new CANNON.Sphere(radius);
    const sphereBody = new CANNON.Body({ mass: mass, shape: sphereShape });
    sphereBody.position.set(x, y, z);
    this.world.add(sphereBody);
    return new cannonObject(sphereBody);
  }
  step(){
    this.world.step(1 / 60);
  }
}
