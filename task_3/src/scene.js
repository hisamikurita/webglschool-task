export class Scene {
    constructor() {
        this.fogColor = 0x000000; // フォグの色
        this.fogNear = 10.0;       // フォグの掛かり始めるカメラからの距離
        this.fogFar = 50.0;        // フォグが完全に掛かるカメラからの距離
    }
};