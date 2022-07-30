class Mesh {
    vertices = [];
    positionBuffer = -1;
    positionShader = -1;

    colors = [];
    colorBuffer = -1;
    colorShader = -1;

    indices = [];
    indexBuffer = -1;

    normals = [];
    normalBuffer = -1;
    normalShader = -1;

    texCoords = [];
    texCoordBuffer = -1;
    texCoordShader = -1;
    texUnitShader = -1;
    material = null;

    matAmbientShader = -1;
    matDiffuseShader = -1;
    matSpecularShader = -1;
    matAlphaShader = -1;

    lightDirectionShader = -1;
    lightAmbientShader = -1;
    lightDiffuseShader = -1;
    lightSpecularShader = -1;

    constructor(vertices, colors, indices, normals, texCoords, material) {
        this.vertices = vertices;
        this.colors = colors;
        this.indices = indices;
        this.normals = normals;
        this.texCoords = texCoords;
        this.material = material;
    }

    static createMesh(vertices, colors, indices, normals, texCoords, material) {
        return new Mesh(vertices, colors, indices, normals, texCoords, material);
    }

    setupGL(shaderProgram) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW);
        this.positionShader = gl.getAttribLocation(shaderProgram, "position");

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);
        this.colorShader = gl.getAttribLocation(shaderProgram, "color");

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);
        this.normalShader = gl.getAttribLocation(shaderProgram, "normal");

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);
        this.texCoordShader = gl.getAttribLocation(shaderProgram, "texCoord");
        this.texUnitShader = gl.getUniformLocation(shaderProgram, "texUnit");

        this.modelMatrixShader = gl.getUniformLocation(shaderProgram, "modelMatrix");
        this.cameraMatrixShader = gl.getUniformLocation(shaderProgram, "cameraMatrix");
        this.projectionMatrixShader = gl.getUniformLocation(shaderProgram, "projectionMatrix");

        this.matAmbientShader = gl.getUniformLocation(shaderProgram, "matAmbient");
        this.matDiffuseShader = gl.getUniformLocation(shaderProgram, "matDiffuse");
        this.matSpecularShader = gl.getUniformLocation(shaderProgram, "matSpecular");
        this.matAlphaShader = gl.getUniformLocation(shaderProgram, "matAlpha");

        this.lightDirectionShader = gl.getUniformLocation(shaderProgram, "lightDirection");
        this.lightAmbientShader = gl.getUniformLocation(shaderProgram, "lightAmbient");
        this.lightDiffuseShader = gl.getUniformLocation(shaderProgram, "lightDiffuse");
        this.lightSpecularShader = gl.getUniformLocation(shaderProgram, "lightSpecular");

        console.log("Finished setting up mesh");
    }

    draw(light, modelMatrix) {
        if (this.positionBuffer == -1 ||
            this.colorBuffer == -1 ||
            this.indexBuffer == -1 ||
            this.normalBuffer == -1 ||
            this.texCoordBuffer == -1) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.colorShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(this.normalShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordShader, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
        gl.uniform1i(this.texUnitShader, 0);

        gl.uniformMatrix4fv(this.modelMatrixShader, false, flatten(modelMatrix));
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
        gl.enableVertexAttribArray(this.texCoordShader);
        console.log("Num indices: " + this.indices.length);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
        gl.disableVertexAttribArray(this.positionShader);
        gl.disableVertexAttribArray(this.colorShader);
        gl.disableVertexAttribArray(this.normalShader);
        gl.disableVertexAttribArray(this.texCoordShader);
    }
}