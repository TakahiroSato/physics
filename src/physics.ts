import { threejsObject, myThreeJs } from "./myThreeJs";
import { cannonObject, myCannon } from "./myCannon";

let lastTime: number | null = null;

export class physicsObject {
  public threeObj: threejsObject;
  public cannonObj: cannonObject;
  constructor(threeObj: threejsObject, cannonObj: cannonObject) {
    this.threeObj = threeObj;
    this.cannonObj = cannonObj;
  }
  update() {
    this.threeObj.copy(
      this.cannonObj.body.position,
      this.cannonObj.body.quaternion
    );
  }
  setVelocity(x: number, y: number, z: number) {
    this.cannonObj.body.velocity.set(x, y, z);
    return this;
  }
  setAngularVelocity(x: number, y: number, z: number, damping:number=0.1) {
    this.cannonObj.body.angularVelocity.set(x, y, z);
    this.cannonObj.body.angularDamping = damping;
    return this;
  }
}

export class physics extends myThreeJs {
  private cannon: myCannon;
  private objArray: Array<physicsObject>;
  constructor(divid: string) {
    super(divid);
    this.cannon = new myCannon();
    this.drawPlane(0, 0, 0, 1000, 1000, "#999999");
    this.objArray = [];
  }
  addBox(obj: {
    mass: number;
    w: number;
    h: number;
    d: number;
    color: string;
    x?: number;
    y?: number;
    z?: number;
  }) {
    if (!obj.x) obj.x = 0;
    if (!obj.y) obj.y = 0;
    if (!obj.z) obj.z = obj.d;
    const cannonObj = this.cannon.addBox(obj);
    obj.w *= 2;
    obj.h *= 2;
    obj.d *= 2;
    const threeObj = super.drawBox(obj);
    const ret = new physicsObject(threeObj, cannonObj);
    this.objArray.push(ret);
    return ret;
  }
  addSphere(obj: {
    mass: number;
    radius: number;
    color: string;
    x?: number;
    y?: number;
    z?: number;
  }) {
    if (!obj.x) obj.x = 0;
    if (!obj.y) obj.y = 0;
    if (!obj.z) obj.z = obj.radius;
    const cannonObj = this.cannon.addSphere(obj);
    const threeObj = super.drawSphere(obj);
    const ret = new physicsObject(threeObj, cannonObj);
    this.objArray.push(ret);
    return ret;
  }
  update(time: number) {
    this.objArray.map(o => {
      o.update();
    });
    if (lastTime) {
      this.cannon.step(time, lastTime);
    }
    this.render();
    lastTime = time;
  }
}
