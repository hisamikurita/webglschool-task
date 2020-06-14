window.addEventListener('load', () => {
    //canvas要素取得
    var c = document.getElementById('canvas');
    var size = Math.min(window.innerWidth, window.innerHeight);
    c.width = size;
    c.height = size;

    // WebGL コンテキストを取得
    var gl = c.getContext('webgl');

    var position = null;
    var vbo = null;
    var shader = null;
    var program = null;
    var uniform = null;
    //コンパイル後のシェーダーオブジェクトを入れるための変数
    var vs = null;
    var fs = null;
    var mouse = [0, 0];

    //マウスイベントを設定する
    window.addEventListener('mousemove', (e) => {
        mouse[0] = event.clientX / window.innerWidth;
        mouse[1] = event.clientY / window.innerHeight;
    })

    //頂点シェーダーを最初に読み込む
    shaderLoadFile('../shader/main.vert')
        //thenの引数に戻り値が返ってくる。
        //vertexShaderSourceに頂点シェーダのソースコードが入っている
        .then((vertexShaderSource) => {
            vs = createShaderObject(vertexShaderSource, gl.VERTEX_SHADER);
            //次にフラグメントシェーダーを読み込む
            return shaderLoadFile('../shader/main.frag');
        })
        //fragmentShaderSourceにフラグメントシェーダのソースコードが入っている
        .then((fragmentShaderSource) => {
            fs = createShaderObject(fragmentShaderSource, gl.FRAGMENT_SHADER);
            //プログラムオブジェクトの生成
            program = createProgramObject(vs, fs);
            setupGeometry();
            setupLocation();
            setupRendering();
            render();
        });

    function setupGeometry() {
        //JavaScriptで各頂点を配列で定義する
        position = [
            0.0, 0.5, 0.0, // ひとつ目の頂点の x, y, z 座標
            0.5, -0.5, 0.0, // ふたつ目の頂点の x, y, z 座標
            -0.5, -0.5, 0.0,  // みっつ目の頂点の x, y, z 座標

            0.0, 0.5, 0.0, // ひとつ目の頂点の x, y, z 座標
            1, 0.5, 0.0, // ふたつ目の頂点の x, y, z 座標
            0.5, -0.5, 0.0,  // みっつ目の頂点の x, y, z 座標
            
            0.0, 0.5, 0.0, // ひとつ目の頂点の x, y, z 座標
            -1, 0.5, 0.0, // ふたつ目の頂点の x, y, z 座標
            -0.5, -0.5, 0.0,  // みっつ目の頂点の x, y, z 座標
        ];
        color = [
            1.0, 0.0, 0.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 1.0, 0.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現

            1, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            1, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            1, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現

            1.0, 0.0, 0.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 1.0, 0.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
            0.0, 0.0, 1.0, 1.0, // RGBA を 0.0 ～ 1.0 の値で表現
        ];

        //頂点バッファの作成(あらかじめJavaScriptで定義した配列の情報をGPUに渡すため)
        vbo = [
            createVBO(position),
            createVBO(color),
        ]
    }

    function setupLocation() {
        //ロケーションを関連づける
        const aPosition = gl.getAttribLocation(program, 'position');
        enableAttribute(vbo[0], aPosition, 3);
        const aColor = gl.getAttribLocation(program, 'color');
        enableAttribute(vbo[1], aColor, 4);
        // uniform 変数のロケーションを取得する @@@
        uniform = {
            mouse: gl.getUniformLocation(program, 'mouse'),
        };
    }

    function setupRendering() {
        //ビューポート
        gl.viewport(0, 0, c.width, c.height);
        // クリアする色を設定する（RGBA で 0.0 ～ 1.0 の範囲で指定する）
        gl.clearColor(0.3, 0.3, 0.3, 1.0);
        // 実際にクリアする（gl.COLOR_BUFFER_BIT で色をクリアしろ、という指定になる）
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    function render() {
        requestAnimationFrame(render);
        setupRendering();
        gl.uniform2fv(uniform.mouse, mouse);
        // ドローコール（描画命令）
        gl.drawArrays(gl.TRIANGLES, 0, position.length / 3);
    }

    //webgl utility function

    function shaderLoadFile(path) {
        return new Promise((resolve, reject) => {
            // fetch を使ってファイルにアクセスする
            fetch(path)
                .then((res) => {
                    // テキストとして処理する
                    return res.text();
                })
                .then((text) => {
                    // テキストを引数に Promise を解決する
                    resolve(text);
                })
                .catch((err) => {
                    // なんらかのエラー
                    reject(err);
                });
        });
    }

    function createShaderObject(source, type) {
        // 空のシェーダオブジェクトを生成する
        shader = gl.createShader(type);
        // シェーダオブジェクトにソースコードを割り当てる
        gl.shaderSource(shader, source);
        // シェーダをコンパイルする
        gl.compileShader(shader);
        // コンパイル後のステータスを確認し問題なければシェーダオブジェクトを返す
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            throw new Error(gl.getShaderInfoLog(shader));
            return null;
        }
    }

    function createProgramObject(vs, fs) {
        // 空のプログラムオブジェクトを生成する
        program = gl.createProgram();
        // ２つのシェーダをアタッチ（関連付け）する
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        // シェーダオブジェクトをリンクする
        gl.linkProgram(program);
        // リンクが完了するとシェーダオブジェクトは不要になるので削除する
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        // リンク後のステータスを確認し問題なければプログラムオブジェクトを返す
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            return program;
        } else {
            throw new Error(gl.getProgramInfoLog(program));
            return null;
        }
    }

    function createVBO(vertexArray) {
        // 空のバッファオブジェクトを生成する
        const vbo = gl.createBuffer();
        // バッファを gl.ARRAY_BUFFER としてバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        // バインドしたバッファに Float32Array オブジェクトに変換した配列を設定する
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
        // 安全のために最後にバインドを解除してからバッファオブジェクトを返す
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }

    function enableAttribute(vbo, attLocation, attStride) {
        // 有効化したいバッファをまずバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        // 頂点属性ロケーションの有効化を行う
        gl.enableVertexAttribArray(attLocation);
        // 対象のロケーションのストライドやデータ型を設定する
        gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);
    }
})
