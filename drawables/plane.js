class Plane extends Drawable {
    constructor(transform, scale, rotation, textureSource, colors, amb, dif, sp, sh) {
        super(transform[0], transform[1], transform[2], scale, rotation[0], rotation[1], rotation[2], colors, amb, dif, sp, sh);
        if (this.shaderProgram == -1) {
            this.initialize(textureSource);
        }
    }

    initialize(textureSource) {
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

        this.vertexTextureCoordinates = [
            vec2(0, 0),
            vec2(1, 0),
            vec2(1, 1),
            vec2(0, 1),
        ];

        this.setupTexture(textureSource);
    }
}

