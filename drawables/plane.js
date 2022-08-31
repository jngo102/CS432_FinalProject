class Plane extends Drawable {
    constructor(transform, scale, rotation, texturePath, vshader="../shaders/vshader.glsl", fshader="../shaders/fshader.glsl") {
        super(transform[0], transform[1], transform[2], scale, rotation[0], rotation[1], rotation[2]);
        if (this.shaderProgram == -1) {
            this.initialize(texturePath, vshader, fshader);
        }
    }

    initialize(texturePath, vshader, fshader) {
        var vertices = [
            vec3(-1, 0, 1),
            vec3(1, 0, 1),
            vec3(1, 0, -1),
            vec3(-1, 0, -1),
        ];

        var indices = [
            0, 1, 2,
            0, 2, 3
        ];

        var texCoords = [
            vec2(0, 0),
            vec2(1, 0),
            vec2(1, 1),
            vec2(0, 1),
        ];

        var colors = [
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1)
        ];

        var amb = vec4(0.2, 0.2, 0.2, 1.0);
        var dif = vec4(0.6, 0.1, 0.0, 1.0);
        var spec = vec4(1.0, 1.0, 1.0, 1.0);
        var shine = 100.0;

        Material.createMaterial("Plane", texturePath, amb, dif, spec, shine).then((material) => {
            var mesh = Mesh.createMesh(vertices, colors, indices, [], texCoords, material);
            this.meshes.push(mesh);
            mesh.computeNormals();
    
            this.setupGL(vshader, fshader);
        });
    }
}

