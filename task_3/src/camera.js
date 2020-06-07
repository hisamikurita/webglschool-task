// const THREE = require('three');

export class Camera {
    constructor() {
        this.fovy = 60;
        this.aspect = window.innerWidth / window.innerHeight;
        this.near = .1;
        this.far = 30;
        this.x = 0;
        this.y = 4;
        this.z = 8;
        this.lookAt = new THREE.Vector3(0, 0, 0);
    }
}