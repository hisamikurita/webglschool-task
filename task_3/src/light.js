export class PointLight {
    constructor() {
        this.color = 0xffffff;
        this.intensity = 1;
        this.x = 5;
        this.y = 5;
        this.z = 10;
    }
}

export class AmbientLight {
    constructor() {
        this.color = 0xffffff;
        this.intensity = .2;
    }
}