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

        // マウスのクリックイベントの定義 @@@
        window.addEventListener('click', (event) => {

            const x = event.clientX / window.innerWidth * 2.0 - 1.0;
            const y = event.clientY / window.innerHeight * 2.0 - 1.0;
            const v = new THREE.Vector2(x, -y);

            raycaster.setFromCamera(v, camera);
            const intersects = raycaster.intersectObjects(boxmeshArray);

            boxmeshArray.forEach((mesh) => {
                mesh.material = material;
            });
            if (intersects.length > 0) {
                intersects[0].object.material = selectedMaterial;
            }
        }, false);

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
        material, materialparam, selectedMaterial,
        directionalLight, directionallightparam, ambientLight, ambientlightparam,
        axesHelper, controls,
        wrap;

    class SceneParam {
        constructor() {
            this.fogColor = 0x000000; // フォグの色
            this.fogNear = 10.0;       // フォグの掛かり始めるカメラからの距離
            this.fogFar = 50.0;        // フォグが完全に掛かるカメラからの距離
        }
    };
    sceneparam = new SceneParam();

    class RendererParam {
        constructor() {
            this.clearcolor = 0x000000; // 背景をクリアする色
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
            this.far = 30;
            this.x = 0;
            this.y = 5;
            this.z = 10;
            this.lookAt = new THREE.Vector3(0, 0, 0);
        }
    }
    cameraparam = new CameraParam();

    class MaterialParam {
        constructor() {
            this.color = 0x333333;
            this.specular = 0xff0101;
        }
    }
    materialparam = new MaterialParam();

    // クリック時用マテリアルのパラメータ @@@
    class MaterialParamSelected {
        constructor() {
            this.color = 0xffffff;
            this.specular = 0xffffff;
        }
    }
    materialparamselected = new MaterialParamSelected();

    class DirectionalLightParam {
        constructor() {
            this.color = 0xffffff;
            this.intensity = 1;
            this.x = 5;
            this.y = 5;
            this.z = 10;
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
        scene.fog = new THREE.Fog(
            sceneparam.fogColor,
            sceneparam.fogNear,
            sceneparam.fogFar
        );

        //レンダラーを作成
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
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
        selectedMaterial = new THREE.MeshPhongMaterial({ color: materialparamselected.color, specular: materialparamselected.specular });

        wrap = new THREE.Group();

        for (let i = 0; i < 1000; i++) {
            boxmesh = new THREE.Mesh(geometry, material);
            boxmesh.position.x = (Math.random() - 0.5) * 50;
            boxmesh.position.y = (Math.random() - 0.5) * 50;
            boxmesh.position.z = (Math.random() - 0.5) * 50;
            boxmesh.rotation.x = Math.random() * 2 * Math.PI;
            boxmesh.rotation.y = Math.random() * 2 * Math.PI;
            boxmesh.rotation.z = Math.random() * 2 * Math.PI;
            boxmeshArray.push(boxmesh);
            wrap.add(boxmesh);
        }

        scene.add(wrap);

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
        // axesHelper = new THREE.AxesHelper(10.0);
        // scene.add(axesHelper);

        // コントロール
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // レイキャスター @@@
        raycaster = new THREE.Raycaster();
    }

    function render() {
        renderer.render(scene, camera);
        scene.rotation.y += .01;
        if (run) {
            requestAnimationFrame(render);
        }
    }
})();