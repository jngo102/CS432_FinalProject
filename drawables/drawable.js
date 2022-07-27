class Drawable {
    shaderProgram = -1;
    flatShaderProgram = -1;
    flatShading = false;

    vertexPositions = [];
    positionBuffer = -1;
    positionShader = -1;

    vertexColors = [];
    colorBuffer = -1;
    colorShader = -1;

    indices = [];
    indexBuffer = -1;

    modelMatrixShader = null;

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ, colors) {
        this.tx = tx;
        this.ty = ty;
        this.tz = tz;
        this.scale = scale;
        this.rotX = rotX;
        this.rotY = rotY;
        this.rotZ = rotZ;
        this.vertexColors = colors;

        this.updateModelMatrix();
    }

    setModelMatrix(mm) {
        this.modelMatrix = mm;
    }

    getModelMatrix() {
        return this.modelMatrix;
    }

    getModelRotation() {
        return this.rotation;
    }

    setModelRotation(rotX, rotY, rotZ) {
        this.rotX = rotX;
        this.rotY = rotY;
        this.rotZ = rotZ;
        this.updateModelMatrix();
    }

    getScale() {
        return this.scale;
    }

    setScale(scale) {
        this.scale = scale;
        this.updateModelMatrix();
    }

    updateModelMatrix() {
        let t = translate(this.tx, this.ty, this.tz);
        let s = scale(this.scale, this.scale, this.scale);
        let rx = rotateX(this.rotX);
        let ry = rotateY(this.rotY);
        let rz = rotateZ(this.rotZ);

        this.modelMatrix = mult(t, mult(s, mult(rz, mult(ry, rx))));
    }

    toggleFlatShading() {
        this.flatShading = !this.flatShading;
        this.setupGL();
    }

    setupGL() {
        this.shaderProgram = initShaders(
            gl,
            "../shaders/vshader" + (this.flatShading ? "Flat" : "") + ".glsl",
            "../shaders/fshader" + (this.flatShading ? "Flat" : "") + ".glsl"
        );

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexPositions), gl.STATIC_DRAW);
        this.positionShader = gl.getAttribLocation(this.shaderProgram, "position");

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexColors), gl.STATIC_DRAW);
        this.colorShader = gl.getAttribLocation(this.shaderProgram, "color");

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);

        this.modelMatrixShader = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
        this.cameraMatrixShader = gl.getUniformLocation(this.shaderProgram, "cameraMatrix");
        this.projectionMatrixShader = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
    }
}