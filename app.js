var canvas;
var gl;

const FRAME_TIME = 1 / 60;
var camera;
var cameraController;
var plane;
var sun;
var inputManager;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);

    var amb = vec4(0.2, 0.2, 0.2, 1.0);
    var dif = vec4(0.6, 0.1, 0.0, 1.0);
    var spec = vec4(1.0, 1.0, 1.0, 1.0);
    var shine = 100.0
    plane = new Plane(
        vec3(0, 0, 0), 
        5, 
        vec3(0, 0, 0), 
        "../textures/256x grass block.png", 
        [
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1),
            vec4(1, 1, 1, 1)
        ],
        amb, dif, spec, shine);
    var u = vec3(1, 0, 0);
    var v = vec3(0, 1, 0);
    var n = vec3(0, 0, 1);
    camera = new Camera(vec3(0, 1, 0), u, v, n, 45, 16 / 9, 0.1, 100);
    camera.lookAt(vec3(0, 0, -1));
    sun = new Light(vec3(0, 2, 0), vec3(-1, -1, 1), vec4(1, 1, 1, 1), vec4(1, 1, 1, 1), vec4(1, 1, 1, 1), 1, 1000, 1)
    var inputActions = new InputActions(
        new PlayerAction("KeyA"),
        new PlayerAction("KeyD"),
        new PlayerAction("KeyW"),
        new PlayerAction("KeyS"),
        new PlayerAction("KeyE")
    );
    inputManager = new InputManager(window, inputActions, 2);
    cameraController = new CameraController(camera, inputManager);

    render();
};

function render() {
    setTimeout(function () {
        requestAnimationFrame(render);

        cameraController.update(FRAME_TIME);
        inputManager.update(FRAME_TIME);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        plane.draw(sun);
    }, FRAME_TIME);
}
