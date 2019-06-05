import * as THREE from "three";
import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";

export class threejsObject {
  protected threejs: myThreeJs;
  public mesh: THREE.Mesh | THREE.Line | THREE.Sprite | null;
  public geometry: THREE.Geometry | null;
  public material: THREE.Material | THREE.SpriteMaterial | null;
  public texture: THREE.Texture | null;
  constructor(parent: myThreeJs) {
    this.threejs = parent;
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.texture = null;
  }
  setPos(x: number, y: number, z: number) {
    if (this.mesh) {
      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = z;
    }
  }
  setRotation(x: number, y: number, z: number) {
    if (this.mesh) {
      this.mesh.rotation.x = x;
      this.mesh.rotation.y = y;
      this.mesh.rotation.z = z;
    }
  }
  copy(position: any, quaternion: any) {
    if (this.mesh) {
      this.mesh.position.copy(position);
      this.mesh.quaternion.copy(quaternion);
    }
  }
  remove() {
    this.threejs.remove(this);
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.texture = null;
  }
}

export class myThreeJs {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private controls: OrbitControls;
  private div: HTMLDivElement;
  private _width: number;
  get width(): number {
    return this._width;
  }
  private _height: number;
  get height(): number {
    return this._height;
  }
  private fov: number;
  private near: number;
  private far: number;
  private sx: number;
  private sy: number;
  private backGroundColor: string;
  private objectsArray: Array<threejsObject>;
  public fillStyle: string;
  public lineWidth: number;
  public globalAlpha: number;
  constructor(divid: string) {
    this._width = 0;
    this._height = 0;
    this.fov = 90; // 画角
    this.near = 0.1; // 視体積手前までの距離
    this.far = 250; // 視体積奥までの距離
    this.sx = 0;
    this.sy = 0;
    this.backGroundColor = "#000000";
    this.objectsArray = [];
    this.fillStyle = "#000000";
    this.lineWidth = 1;
    this.globalAlpha = 1;
    this.div = <HTMLDivElement>document.getElementById(divid);
    this._width = this.div.clientWidth;
    this._height = this.div.clientHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); // レンダラーの生成
    this.renderer.setSize(this._width, this._height); // レンダラーのサイズをdivのサイズに設定
    this.renderer.setClearColor(this.backGroundColor, 1); // レンダラーの背景色を黒色（透過）に設定
    this.renderer.shadowMap.enabled = true;
    this.div.appendChild(this.renderer.domElement); // div領域にレンダラーを配置
    this.scene = new THREE.Scene(); // シーンの生成
    // 座標軸を表示
    let axes = new THREE.AxesHelper(this.width);
    this.scene.add(axes);
    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-500, 0, 1000);
    //directionalLight.lookAt(0, 0, 0);
    directionalLight.shadow.camera.near = this.near;
    directionalLight.shadow.camera.far = this.far;
    directionalLight.shadow.camera.top = this.far;
    directionalLight.shadow.camera.bottom = this.far * -1;
    directionalLight.shadow.camera.left = this.far * -1;
    directionalLight.shadow.camera.right = this.far;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this._width / this._height,
      this.near,
      this.far
    );
    // this.camera = new THREE.OrthographicCamera(
    //   this.width / -2,
    //   this.width / 2,
    //   this.height / 2,
    //   this.height / -2,
    //   this.near,
    //   this.far
    // );
    //this.camera.up.set(0, 1, 0);
    //this.camera.position.set(0, 0, this.height / 2);
    this.camera.position.set(0, -25, 25);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.0;
    this.controls.enablePan = true;
    // 環境光源
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  }
  setCameraPosition(x: number, y: number, z: number) {
    this.camera.position.set(-x, y, this._height / 2 + z);
  }
  setCameraLookAt(x: number, y: number, z: number) {
    this.camera.lookAt(new THREE.Vector3(x, y, z));
  }
  moveTo(x: number, y: number) {
    this.sx = x;
    this.sy = y;
  }
  lineTo(x: number, y: number) {
    this.drawLine(this.sx, this.sy, x, y, this.lineWidth, this.fillStyle);
    this.sx = x;
    this.sy = y;
  }
  drawLine(
    sx: number,
    sy: number,
    dx: number,
    dy: number,
    w: number,
    color: string
  ) {
    dy *= -1;
    sy *= -1;
    let obj = new threejsObject(this);
    // geometryの宣言と生成
    obj.geometry = new THREE.Geometry();
    // 頂点座標の追加
    obj.geometry.vertices.push(
      new THREE.Vector3(sx - this._width / 2, sy + this._height / 2, 0)
    );
    obj.geometry.vertices.push(
      new THREE.Vector3(dx - this._width / 2, dy + this._height / 2, 0)
    );
    // 線オブジェクトの生成
    obj.material = new THREE.LineBasicMaterial({
      linewidth: w,
      color: color
    });
    obj.mesh = new THREE.Line(obj.geometry, obj.material);
    this.objectsArray.push(obj);
    // sceneにlineを追加
    this.scene.add(obj.mesh);
  }
  fillRect(x: number, y: number, w: number, h: number) {
    return this.drawRect(x, y, w, h, this.fillStyle);
  }
  drawRect(x: number, y: number, w: number, h: number, color: string) {
    y *= -1;
    let obj = new threejsObject(this);
    obj.geometry = new THREE.PlaneGeometry(w, h);
    obj.material = new THREE.MeshBasicMaterial({ color: color });
    obj.material.transparent = true;
    obj.material.opacity = this.globalAlpha;
    obj.mesh = new THREE.Mesh(obj.geometry, obj.material);
    obj.mesh.position.x = x - (this._width - w) / 2;
    obj.mesh.position.y = y + (this._height - h) / 2;
    obj.mesh.position.z = 0;
    this.objectsArray.push(obj);
    this.scene.add(obj.mesh);
    return obj;
  }
  drawBox(obj: {
    x?: number;
    y?: number;
    z?: number;
    w: number;
    h: number;
    d: number;
    color: string;
  }) {
    const ret = new threejsObject(this);
    ret.geometry = new THREE.BoxGeometry(obj.w, obj.h, obj.d, 2, 2);
    ret.material = new THREE.MeshLambertMaterial({ color: obj.color });
    ret.material.transparent = true;
    ret.material.opacity = this.globalAlpha;
    ret.mesh = new THREE.Mesh(ret.geometry, ret.material);
    ret.mesh.castShadow = true;
    this.scene.add(ret.mesh);
    ret.setPos(obj.x || 0, obj.y || 0, obj.z || 0);
    this.objectsArray.push(ret);
    return ret;
  }
  drawSphere(obj: {
    x?: number;
    y?: number;
    z?: number;
    radius: number;
    color: string;
  }) {
    const ret = new threejsObject(this);
    ret.geometry = new THREE.SphereGeometry(obj.radius);
    ret.material = new THREE.MeshLambertMaterial({ color: obj.color });
    ret.mesh = new THREE.Mesh(ret.geometry, ret.material);
    ret.mesh.castShadow = true;
    ret.setPos(obj.x || 0, obj.y || 0, obj.z || 0);
    this.scene.add(ret.mesh);
    this.objectsArray.push(ret);
    return ret;
  }
  drawPlane(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    color: string
  ) {
    const obj = new threejsObject(this);
    obj.geometry = new THREE.PlaneGeometry(w, h, 1, 1);
    obj.material = new THREE.MeshLambertMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    obj.mesh = new THREE.Mesh(obj.geometry, obj.material);
    //obj.mesh.receiveShadow = true;
    obj.setPos(x, y, z);
    this.scene.add(obj.mesh);
    this.objectsArray.push(obj);
    return obj;
  }
  unproject(normX: number, normY: number, normZ: number=1):THREE.Vector3{
    const pos = new THREE.Vector3(normX, normY, normZ);
    return pos.unproject(this.camera);
  }
  cameraPos():THREE.Vector3{
    return this.camera.position;
  }
  cameraLookVec():THREE.Vector3{
    const forward = (new THREE.Vector4(0, 0, -1, 0).applyMatrix4(this.camera.matrix).normalize());
    return new THREE.Vector3(forward.x, forward.y, forward.z);
  }
  clear() {
    while (this.objectsArray.length > 0) {
      this.objectsArray[0].remove();
    }
  }
  remove(obj: threejsObject) {
    if (this.objectsArray.indexOf(obj) != -1) {
      this.objectsArray.splice(this.objectsArray.indexOf(obj), 1);
    }
    if (obj.mesh !== null) this.scene.remove(obj.mesh);
    if (obj.geometry !== null) obj.geometry.dispose();
    if (obj.material !== null) obj.material.dispose();
    if (obj.texture !== null) obj.texture.dispose();
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
