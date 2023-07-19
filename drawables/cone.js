class Cone extends Drawable {
    constructor(transform, scale, rotation, vshader="https://jngo102.github.io/CS432_FinalProject/shaders/vshader.glsl", fshader="https://jngo102.github.io/CS432_FinalProject/shaders/fshader.glsl") {
        super(transform[0], transform[1], transform[2], scale, rotation[0], rotation[1], rotation[2]);

        this.initialize(vshader, fshader);
    }

    initialize(vshader, fshader) {
        var vertices = [
            vec3(1.5, 0, 0),
            vec3(-1.5, 1, 0),
            vec3(-1.5, 0.809017, 0.587785),
            vec3(-1.5, 0.309017, 0.951057),
            vec3(-1.5, -0.309017, 0.951057),
            vec3(-1.5, -0.809017, 0.587785),
            vec3(-1.5, -1, 0),
            vec3(-1.5, -0.809017, -0.587785),
            vec3(-1.5, -0.309017, -0.951057),
            vec3(-1.5, 0.309017, -0.951057),
            vec3(-1.5, 0.809017, -0.58778)
        ];

        var colors = [
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1),
            vec4(1, 1, 0, 1)
        ]

        var indices = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 5,
            0, 5, 6,
            0, 6, 7,
            0, 7, 8,
            0, 8, 9,
            0, 9, 10,
            0, 10, 1
        ];

        this.meshes.push(new Mesh(vertices, colors, indices, [], [], null));

        this.setupGL(vshader, fshader);
    }
}