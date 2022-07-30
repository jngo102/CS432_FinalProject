/// Base class for renderable objects
class Drawable {
    shaderProgram = -1;

    materials = [];
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

    computeNormals() {
        var normalSum = [];
        var counts = [];

        for (var i = 0; i < this.vertexPositions.length; i++) {
            normalSum.push(vec3(0, 0, 0));
            counts.push(0);
        }

        for (var i = 0; i < this.indices.length; i += 3) {
            var a = this.indices[i];
            var b = this.indices[i + 1];
            var c = this.indices[i + 2];

            var edge1 = subtract(this.vertexPositions[b], this.vertexPositions[a])
            var edge2 = subtract(this.vertexPositions[c], this.vertexPositions[b])
            var N = cross(edge1, edge2)

            normalSum[a] = add(normalSum[a], normalize(N));
            counts[a]++;
            normalSum[b] = add(normalSum[b], normalize(N));
            counts[b]++;
            normalSum[c] = add(normalSum[c], normalize(N));
            counts[c]++;
        }

        for (var i = 0; i < this.vertexPositions.length; i++) {
            this.vertexNormals[i] = mult(1.0 / counts[i], normalSum[i]);
        }
    }

    setupGL() {
        this.shaderProgram = initShaders(gl, "../shaders/vshader.glsl", "../shaders/fshader.glsl");

        this.meshes.forEach(mesh => {
            mesh.setupGL(this.shaderProgram);
        });
    }

    draw(light) {
        if (this.meshes.length <= 0) {
            return;
        }

        gl.useProgram(this.shaderProgram);

        this.meshes.forEach((mesh) => {
            mesh.draw(light, this.modelMatrix);
        })
    }
}