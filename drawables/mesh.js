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

    lightSpotAngleShader1 = -1;
    lightCutoffShader1 = -1;
    lightStatusShader1 = -1;
    lightLocationShader1 = -1;
    lightDirectionShader1 = -1;
    lightAmbientShader1 = -1;
    lightDiffuseShader1 = -1;
    lightSpecularShader1 = -1;
    lightTypeShader1 = -1;

    lightSpotAngleShader2 = -1;
    lightCutoffShader2 = -1;
    lightStatusShader2 = -1;
    lightLocationShader2 = -1;
    lightDirectionShader2 = -1;
    lightAmbientShader2 = -1;
    lightDiffuseShader2 = -1;
    lightSpecularShader2 = -1;
    lightTypeShader2 = -1;

    lit = true;

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

        if (this.material != null) {
            this.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);
            this.texCoordShader = gl.getAttribLocation(shaderProgram, "texCoord");
            this.texUnitShader = gl.getUniformLocation(shaderProgram, "texUnit");
        }

        this.modelMatrixShader = gl.getUniformLocation(shaderProgram, "modelMatrix");
        this.cameraMatrixShader = gl.getUniformLocation(shaderProgram, "cameraMatrix");
        this.projectionMatrixShader = gl.getUniformLocation(shaderProgram, "projectionMatrix");

        if (this.normals.length <= 0) {
            console.log("Normals are empty. This mesh does not have material or lighting properties.");
            this.lit = false;
            return;
        }

        this.normalBuffer = gl.createBuffer();
        this.normalShader = gl.getAttribLocation(shaderProgram, "normal");

        if (this.normalShader == -1 || this.normalShader == null) {
            console.log("Normal attribute could be located. This mesh does not have material or lighting properties.");
            this.lit = false;
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);

        this.matAmbientShader = gl.getUniformLocation(shaderProgram, "matAmbient");
        this.matDiffuseShader = gl.getUniformLocation(shaderProgram, "matDiffuse");
        this.matSpecularShader = gl.getUniformLocation(shaderProgram, "matSpecular");
        this.matAlphaShader = gl.getUniformLocation(shaderProgram, "matAlpha");

        this.lightSpotAngleShader1 = gl.getUniformLocation(shaderProgram, "lightSpotAngle1");
        this.lightCutoffShader1 = gl.getUniformLocation(shaderProgram, "lightCutoff1");
        this.lightStatusShader1 = gl.getUniformLocation(shaderProgram, "lightStatus1");
        this.lightLocationShader1 = gl.getUniformLocation(shaderProgram, "lightLocation1");
        this.lightDirectionShader1 = gl.getUniformLocation(shaderProgram, "lightDirection1");
        this.lightAmbientShader1 = gl.getUniformLocation(shaderProgram, "lightAmbient1");
        this.lightDiffuseShader1 = gl.getUniformLocation(shaderProgram, "lightDiffuse1");
        this.lightSpecularShader1 = gl.getUniformLocation(shaderProgram, "lightSpecular1");
        this.lightTypeShader1 = gl.getUniformLocation(shaderProgram, "lightType1");

        // this.lightSpotAngleShader2 = gl.getUniformLocation(shaderProgram, "lightSpotAngle2");
        // this.lightCutoffShader2 = gl.getUniformLocation(shaderProgram, "lightCutoff2");
        // this.lightStatusShader2 = gl.getUniformLocation(shaderProgram, "lightStatus2");
        // this.lightLocationShader2 = gl.getUniformLocation(shaderProgram, "lightLocation2");
        // this.lightDirectionShader2 = gl.getUniformLocation(shaderProgram, "lightDirection2");
        // this.lightAmbientShader2 = gl.getUniformLocation(shaderProgram, "lightAmbient2");
        // this.lightDiffuseShader2 = gl.getUniformLocation(shaderProgram, "lightDiffuse2");
        // this.lightSpecularShader2 = gl.getUniformLocation(shaderProgram, "lightSpecular2");
        // this.lightTypeShader2 = gl.getUniformLocation(shaderProgram, "lightType2");
    }

    computeNormals() {
        var normalSum = [];
        var counts = [];

        for (var i = 0; i < this.vertices.length; i++) {
            normalSum.push(vec3(0, 0, 0));
            counts.push(0);
        }

        for (var i = 0; i < this.indices.length; i += 3) {
            var a = this.indices[i];
            var b = this.indices[i + 1];
            var c = this.indices[i + 2];

            var edge1 = subtract(this.vertices[b], this.vertices[a])
            var edge2 = subtract(this.vertices[c], this.vertices[b])
            var N = cross(edge1, edge2)

            normalSum[a] = add(normalSum[a], normalize(N));
            counts[a]++;
            normalSum[b] = add(normalSum[b], normalize(N));
            counts[b]++;
            normalSum[c] = add(normalSum[c], normalize(N));
            counts[c]++;
        }

        for (var i = 0; i < this.vertices.length; i++) {
            this.normals[i] = mult(1.0 / counts[i], normalSum[i]);
        }
    }

    draw(modelMatrix) {
        if (this.positionBuffer == -1 ||
            this.colorBuffer == -1 ||
            this.indexBuffer == -1) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.colorShader, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        if (this.material != null) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.vertexAttribPointer(this.texCoordShader, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
            gl.uniform1i(this.texUnitShader, 0);
        }

        gl.uniformMatrix4fv(this.modelMatrixShader, false, flatten(modelMatrix));
        gl.uniformMatrix4fv(this.cameraMatrixShader, false, flatten(Camera.current.cameraMatrix));
        gl.uniformMatrix4fv(this.projectionMatrixShader, false, flatten(Camera.current.projectionMatrix));

        if (this.lit) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.vertexAttribPointer(this.normalShader, 3, gl.FLOAT, false, 0, 0);

            gl.uniform4fv(this.matAmbientShader, this.material.ambient);
            gl.uniform4fv(this.matDiffuseShader, this.material.diffuse);
            gl.uniform4fv(this.matSpecularShader, this.material.specular);
            gl.uniform1f(this.matAlphaShader, this.material.alpha);

            var lights = LightManager.getLights();
            
            gl.uniform1i(this.lightStatusShader1, lights[0].status);
            gl.uniform1i(this.lightTypeShader1, lights[0].type);
            gl.uniform1f(this.lightSpotAngleShader1, lights[0].spotAngle);
            gl.uniform1f(this.lightCutoffShader1, lights[0].cutoff);
            gl.uniform3fv(this.lightLocationShader1, lights[0].location);
            gl.uniform3fv(this.lightDirectionShader1, lights[0].direction);
            gl.uniform4fv(this.lightAmbientShader1, lights[0].ambient);
            gl.uniform4fv(this.lightDiffuseShader1, lights[0].diffuse);
            gl.uniform4fv(this.lightSpecularShader1, lights[0].specular);

            // gl.uniform1i(this.lightStatusShader2, lights[1].status);
            // gl.uniform1i(this.lightTypeShader2, lights[1].type);
            // gl.uniform1f(this.lightSpotAngleShader2, lights[1].spotAngle);
            // gl.uniform1f(this.lightCutoffShader2, lights[1].cutoff);
            // gl.uniform3fv(this.lightLocationShader2, lights[1].location);
            // gl.uniform3fv(this.lightDirectionShader2, lights[1].direction);
            // gl.uniform4fv(this.lightAmbientShader2, lights[1].ambient);
            // gl.uniform4fv(this.lightDiffuseShader2, lights[1].diffuse);
            // gl.uniform4fv(this.lightSpecularShader2, lights[1].specular);
        }

        gl.enableVertexAttribArray(this.positionShader);
        gl.enableVertexAttribArray(this.colorShader);
        if (this.lit) {
            gl.enableVertexAttribArray(this.normalShader);   
        }
        if (this.material != null) {
            gl.enableVertexAttribArray(this.texCoordShader);
        }
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
        gl.disableVertexAttribArray(this.positionShader);
        gl.disableVertexAttribArray(this.colorShader);
        if (this.lit) {
            gl.disableVertexAttribArray(this.normalShader);
        }
        if (this.material != null) {
            gl.disableVertexAttribArray(this.texCoordShader);
        }
    }
}