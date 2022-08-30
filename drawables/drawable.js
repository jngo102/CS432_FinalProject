/// Base class for renderable objects
class Drawable {
    shaderProgram = -1;

    meshes = [];

    textureLoaded = false;

    constructor(tx, ty, tz, scale, rotX, rotY, rotZ) {
        this.tx = tx;
        this.ty = ty;
        this.tz = tz;
        this.scale = scale;
        this.rotX = rotX;
        this.rotY = rotY;
        this.rotZ = rotZ;

        this.updateModelMatrix();
    }

    setModelMatrix(mm) {
        this.modelMatrix = mm;
    }

    getModelMatrix() {
        return this.modelMatrix;
    }

    getPosition() {
        return vec3(this.tx, this.ty, this.tz);
    }

    setPosition(x, y, z) {
        this.tx = x;
        this.ty = y;
        this.tz = z;
        this.updateModelMatrix();
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

    setupGL() {
        this.shaderProgram = initShaders(gl, "../shaders/vshader.glsl", "../shaders/fshader.glsl");

        this.meshes.forEach(mesh => {
            mesh.setupGL(this.shaderProgram);
        });
    }

    draw() {
        if (this.shaderProgram == -1) {
            return;
        }

        gl.useProgram(this.shaderProgram);

        this.meshes.forEach((mesh) => {
            mesh.draw(this.modelMatrix);
        });
    }
}