class Plane extends Drawable {
    constructor(transform, scale, rotation, texturePath) {
        super(transform[0], transform[1], transform[2], scale, rotation[0], rotation[1], rotation[2]);
        if (this.shaderProgram == -1) {
            this.initialize(texturePath);
        }
    }

    initialize(texturePath) {
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

        this.vertexColors = [
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1)
        ];

        this.computeNormals();

        var amb = vec4(0.2, 0.2, 0.2, 1.0);
        var dif = vec4(0.6, 0.1, 0.0, 1.0);
        var spec = vec4(1.0, 1.0, 1.0, 1.0);
        var shine = 100.0
        this.setupMaterial(texturePath, amb, dif, spec, shine);
        this.waitSetupGL();
    }
}

