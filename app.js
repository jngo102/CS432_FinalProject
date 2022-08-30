var canvas;
var gl;

const FRAME_TIME = 1 / 60;
var camera;
var cameraController;
var monkey;
var plane;
var inputManager;

var runTime = 0;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }
    // Resize canvas to fit window
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);

    sky = new skyBox(
        vec3(0, 0, 0),
        1,
        vec3(0, 0, 0)
    );

    monkey = new ObjModel(
        "../models/monkey.obj", 
        "../models/monkey.mtl",
        vec3(0, 1, -5), 
        1,
        vec3(0, 0, 0));

    earth = new ObjModel(
        "../models/SolarSystem/Earth/Earth.obj", 
        "../models/SolarSystem/Earth/Earth.mtl",
        vec3(8, 1, 0), 
        -1,
        vec3(0, 0, 0));

    mars = new ObjModel(
        "../models/SolarSystem/Mars/Mars.obj", 
        "../models/SolarSystem/Mars/Mars.mtl",
        vec3(0, 1, 0), 
        -1,
        vec3(0, 0, 0));

    plane = new Plane(
        vec3(0, 0, 0), 
        10, 
        vec3(0, 0, 0), 
        "../textures/256x grass block.png");
    var u = vec3(1, 0, 0);
    var v = vec3(0, 1, 0);
    var n = vec3(0, 0, 1);
    camera = new Camera(vec3(0, 1, 0), u, v, n, 65, 16 / 9, 0.1, 100);
    camera.lookAt(vec3(0, 0, -1));
    var sun = new Light(
        vec3(0, 100, 0), 
        vec3(-1, -1, 1), 
        vec4(0.2, 0.2, 0.2, 1), 
        vec4(0.4, 0.4, 0.4, 1), 
        vec4(0.4, 0.4, 0.4, 1), 
        1, 0, 45, 1);
    var flashlight = new Light(
        vec3(0, 0, 0), 
        vec3(0, -1, 0), 
        vec4(0.4, 0.4, 0.4, 1), 
        vec4(1, 1, 1, 1), 
        vec4(1, 1, 1, 1), 
        1, 10, 30, 2);
    var inputActions = new InputActions(
        new PlayerAction("KeyA"),
        new PlayerAction("KeyD"),
        new PlayerAction("KeyW"),
        new PlayerAction("KeyS"),
        new PlayerAction("KeyF"),
        new PlayerAction("KeyE"),
    );
    inputManager = new InputManager(window, inputActions, 2);
    cameraController = new CameraController(inputManager);

    var _ = new LightManager([sun, flashlight]);

    update();
};

function update() {
    setTimeout(function () {
        requestAnimationFrame(update);

        logic(FRAME_TIME);
        render();
    }, FRAME_TIME);
}

// Update only script logic
function logic(deltaTime) {
    cameraController.update(deltaTime);
    inputManager.update(deltaTime);
}

// Update only graphics
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    sky.draw();
    // plane.draw();
    // monkey.draw();
    earth.draw()
    mars.draw()
}