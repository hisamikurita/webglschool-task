//無名関数で全体を囲んで外部から参照されないようにする。
(() => {
    //ページが読み込まれたとき
    window.addEventListener('load', () => {
        init();

        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Escape':
                    run = event.key !== 'Escape';
                    break;
                case ' ':
                    isDown = true;
                    break;
                default:
            }
        }, false);
        window.addEventListener('keyup', (event) => {
            isDown = false;
        }, false);
        run = true;

        // リサイズイベントの定義
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        render();
    });

    var run = true, isDown = false,
        width = window.innerWidth,
        height = window.innerHeight,
        wrapper,
        scene,
        camera, cameraparam,
        renderer, rendererparam,
        geometry, boxmesh, boxmeshArray = [],
        material, materialparam,
        directionalLight, directionallightparam, ambientLight, ambientlightparam,
        axesHelper, controls;

    class RendererParam {
        constructor() {
            this.clearcolor = 0x566666; // 背景をクリアする色
            this.width = width;
            this.height = height;
        }
    }
    rendererparam = new RendererParam();

    class CameraParam {
        constructor() {
            this.fovy = 60;
            this.aspect = width / height;
            this.near = .1;
            this.far = 50;
            this.x = 0;
            this.y = 6;
            this.z = 10;
            this.lookAt = new THREE.Vector3(0, 0, 0);
        }
    }
    cameraparam = new CameraParam();

    class MaterialParam {
        constructor() {
            this.color = 0x2194ce;
            this.specular = 0xff0101;
        }
    }
    materialparam = new MaterialParam();

    class DirectionalLightParam {
        constructor() {
            this.color = 0xffffff;
            this.intensity = 1;
            this.x = 1;
            this.y = 1;
            this.z = 1;
        }
    }
    directionallightparam = new DirectionalLightParam();

    class AmbientLightParam {
        constructor() {
            this.color = 0xffffff;
            this.intensity = .2;
        }
    }
    ambientlightparam = new AmbientLightParam();

    //初期化処理
    function init() {
        //シーンを作成
        scene = new THREE.Scene();

        //レンダラーを作成
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(rendererparam.clearcolor));
        renderer.setSize(rendererparam.width, rendererparam.height);
        wrapper = document.querySelector('#webgl');
        wrapper.appendChild(renderer.domElement);

        //カメラを作成
        camera = new THREE.PerspectiveCamera(
            cameraparam.fovy,
            cameraparam.aspect,
            cameraparam.near,
            cameraparam.far,
        );
        camera.position.set(cameraparam.x, cameraparam.y, cameraparam.z);
        camera.lookAt(cameraparam.lookAt);

        //ジオメトリを作成
        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);

        //マテリアルを作成
        material = new THREE.MeshPhongMaterial({ color: materialparam.color, specular: materialparam.specular });

        for (let i1 = -5; i1 < 5; i1++) {
            for (let i2 = -5; i2 < 5; i2++) {
                //メッシュの作成
                boxmesh = new THREE.Mesh(geometry, material);
                boxmesh.position.x = i1 + .5;
                boxmesh.position.y = i2 + .5;
                boxmeshArray.push(boxmesh);
                scene.add(boxmesh);
            }
        }

        // ディレクショナルライト
        directionalLight = new THREE.DirectionalLight(
            directionallightparam.color,
            directionallightparam.intensity
        );
        directionalLight.position.x = directionallightparam.x;
        directionalLight.position.y = directionallightparam.y;
        directionalLight.position.z = directionallightparam.z;
        scene.add(directionalLight);

        // アンビエントライト
        ambientLight = new THREE.AmbientLight(
            ambientlightparam.color,
            ambientlightparam.intensity
        );
        scene.add(ambientLight);

        // 軸ヘルパーの作成
        axesHelper = new THREE.AxesHelper(10.0);
        scene.add(axesHelper);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function render() {
        renderer.render(scene, camera);
        if (isDown) {
            for (let i = 0; i < 100; i++) {
                var p = boxmeshArray[i];
                p.rotation.x += .01;
                p.rotation.y += .01;
            }
        }
        if (run) {
            requestAnimationFrame(render);
        }
    }
})();