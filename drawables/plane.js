class Plane extends Drawable {
    constructor(transform, scale, rotation, colors) {
        super(transform[0], transform[1], transform[2], scale, rotation[0], rotation[1], rotation[2], colors);
        if (this.shaderProgram == -1) {
            this.initialize();
        }
    }

    initialize() {
        this.vertexPositions = [
            vec3(-1, 0, 1),
            vec3(1, 0, 1),
            vec3(1, 0, -1),
            vec3(-1, 0, -1),
        ];

        this.indices = [
            0, 1, 2,
            0, 2, 3
        ];

        this.setupGL();
    }

    draw() {
        gl.useProgram(this.shaderProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionShader, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(this.colorShader, 4, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.modelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(this.cameraMatrixShader, false, flatten(Camera.current.cameraMatrix));
        gl.uniformMatrix4fv(this.projectionMatrixShader, false, flatten(Camera.current.projectionMatrix));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.enableVertexAttribArray(this.positionShader);
        gl.enableVertexAttribArray(this.colorShader);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);

        gl.disableVertexAttribArray(this.positionShader);
        gl.disableVertexAttribArray(this.colorShader);
    }
}

