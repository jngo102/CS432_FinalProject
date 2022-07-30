/// Base class for renderable objects
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

    vertexNormals = [];
    normalBuffer = -1;
    normalShader = -1;

    vertexTextureCoordinates = [];
    textureCoordinateBuffer = -1;
    textureCoordinateShader = -1;
    textureUnitShader = -1;
    material = null;

    modelMatrixShader = null;

    matAmbientShader = -1;
    matDiffuseShader = -1;
    matSpecularShader = -1;
    matAlphaShader = -1;

    lightDirectionShader = -1;
    lightAmbientShader = -1;
    lightDiffuseShader = -1;
    lightSpecularShader = -1;

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

    setupMaterial(texturePath, ambient, diffuse, specular, alpha) {
        var image = new Image();

        image.onload = () => {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            this.material = new Material(texture, ambient, diffuse, specular, alpha);
        }

        image.src = texturePath;
    }

    setupGL() {
        this.shaderProgram = initShaders(gl, "../shaders/vshader.glsl", "../shaders/fshader.glsl");

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

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexNormals), gl.STATIC_DRAW);
        this.normalShader = gl.getAttribLocation(this.shaderProgram, "normal");

        this.textureCoordinateBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertexTextureCoordinates), gl.STATIC_DRAW);
        this.textureCoordinateShader = gl.getAttribLocation(this.shaderProgram, "textureCoord");
        this.textureUnitShader = gl.getUniformLocation(this.shaderProgram, "textureUnit");

        this.modelMatrixShader = gl.getUniformLocation(this.shaderProgram, "modelMatrix");
        this.cameraMatrixShader = gl.getUniformLocation(this.shaderProgram, "cameraMatrix");
        this.projectionMatrixShader = gl.getUniformLocation(this.shaderProgram, "projectionMatrix");

        this.matAmbientShader = gl.getUniformLocation(this.shaderProgram, "matAmbient");
        this.matDiffuseShader = gl.getUniformLocation(this.shaderProgram, "matDiffuse");
        this.matSpecularShader = gl.getUniformLocation(this.shaderProgram, "matSpecular");
        this.matAlphaShader = gl.getUniformLocation(this.shaderProgram, "matAlpha");

        this.lightDirectionShader = gl.getUniformLocation(this.shaderProgram, "lightDirection");
        this.lightAmbientShader = gl.getUniformLocation(this.shaderProgram, "lightAmbient");
        this.lightDiffuseShader = gl.getUniformLocation(this.shaderProgram, "lightDiffuse");
        this.lightSpecularShader = gl.getUniformLocation(this.shaderProgram, "lightSpecular");
    }

    draw(light) {
        if (this.material == null) {
            return;
        }

        gl.useProgram(this.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.colorShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.normalShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
       	gl.vertexAttribPointer(this.textureCoordinateShader, 2, gl.FLOAT, false, 0, 0 );

        gl.activeTexture(gl.TEXTURE0);
       	gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
       	gl.uniform1i(this.textureUnitShader, 0);

        gl.uniformMatrix4fv(this.modelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(this.cameraMatrixShader, false, flatten(Camera.current.cameraMatrix));
        gl.uniformMatrix4fv(this.projectionMatrixShader, false, flatten(Camera.current.projectionMatrix));

        gl.uniform4fv(this.matAmbientShader, this.material.ambient);
        gl.uniform4fv(this.matDiffuseShader, this.material.diffuse);
        gl.uniform4fv(this.matSpecularShader, this.material.specular);
        gl.uniform1f(this.matAlphaShader, this.material.alpha);

        if (light.status == 1) {
            gl.uniform3fv(this.lightDirectionShader, light.direction);
            gl.uniform4fv(this.lightAmbientShader, light.ambient);
            gl.uniform4fv(this.lightDiffuseShader, light.diffuse);
            gl.uniform4fv(this.lightSpecularShader, light.specular);
        }

        gl.enableVertexAttribArray(this.positionShader);
        gl.enableVertexAttribArray(this.colorShader);
        gl.enableVertexAttribArray(this.normalShader);
        gl.enableVertexAttribArray(this.textureCoordinateShader);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
        gl.disableVertexAttribArray(this.positionShader);
        gl.disableVertexAttribArray(this.colorShader);
        gl.disableVertexAttribArray(this.normalShader);
        gl.disableVertexAttribArray(this.textureCoordinateShader);
    }

    async waitSetupGL() {
        while (this.material == null) {
            await new Promise(r => setTimeout(r, 10));
        }

        console.log("Setting up GL");
        this.setupGL();
    }
}