var canvas;
var gl;

const FRAME_TIME = 1 / 60;
var camera;
var cameraController;
var monkey;
var plane;
var inputManager;
var sun;

var Sun;
var mercury;
var venus;
var earth;
var mars;
var jupiter;
var saturnBody;
var saturnRings;
var uranus;
var neptune;
var pluto;

var celestialBodies = [];

var sunRotation = 0;

const orbitFactor = 0.01;
const orbitAngles = {
    "Mercury": 0,
    "Venus": 0,
    "Earth": 0,
    "Mars": 0,
    "Jupiter": 0,
    "Saturn": 0,
    "Uranus": 0,
    "Neptune": 0,
    "Pluto": 0,
};

const orbitDistances = {
    "Mercury": 64,
    "Venus": 80,
    "Earth": 96,
    "Mars": 112,
    "Jupiter": 128,
    "Saturn": 144,
    "Uranus": 160,
    "Neptune": 176,
    "Pluto": 192,
};

const orbitSpeeds = {
    "Mercury": 47.9,
    "Venus": 35.0,
    "Earth": 29.8,
    "Mars": 24.1,
    "Jupiter": 13.0,
    "Saturn": 4.8,
    "Uranus": 6.8,
    "Neptune": 5.4,
    "Pluto": 6.1,
};

var runTime = 0;

var fov = 65
var aspectRatio = 16 / 9
var near = 0.1
var far = 1000

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
    
    Sun = new ObjModel(
        "Sun",
        "../models/SolarSystem/Sun/Sun.obj",
        "../models/SolarSystem/Sun/Sun.mtl",
        vec3(0, 0, 0),
        -0.1,
        vec3(0, 0, 0));

    mercury = new ObjModel(
        "Mercury",
        "../models/SolarSystem/Mercury/Mercury.obj",
        "../models/SolarSystem/Mercury/Mercury.mtl",
        vec3(orbitDistances["Mercury"], 0, 0),
        -0.1,
        vec3(0, 0, 0));

    venus = new ObjModel(
        "Venus",
        "../models/SolarSystem/Venus/Venus.obj",
        "../models/SolarSystem/Venus/Venus.mtl",
        vec3(orbitDistances["Venus"], 0, 0),
        -0.1,
        vec3(0, 0, 0));

    earth = new ObjModel(
        "Earth",
        "../models/SolarSystem/Earth/Earth.obj", 
        "../models/SolarSystem/Earth/Earth.mtl",
        vec3(orbitDistances["Earth"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));

    mars = new ObjModel(
        "Mars",
        "../models/SolarSystem/Mars/Mars.obj", 
        "../models/SolarSystem/Mars/Mars.mtl",
        vec3(orbitDistances["Mars"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));
    
    jupiter = new ObjModel(
        "Jupiter",
        "../models/SolarSystem/Jupiter/Jupiter.obj",
        "../models/SolarSystem/Jupiter/Jupiter.mtl",
        vec3(orbitDistances["Jupiter"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));

    saturnBody = new ObjModel(
        "Saturn",
        "../models/SolarSystem/Saturn/SaturnBody.obj",
        "../models/SolarSystem/Saturn/SaturnBody.mtl",
        vec3(orbitDistances["Saturn"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));

    saturnRings = new ObjModel(
        "Saturn",
        "../models/SolarSystem/Saturn/SaturnRings.obj",
        "../models/SolarSystem/Saturn/SaturnRings.mtl",
        vec3(orbitDistances["Saturn"], 0, 0),
        -0.1,
        vec3(0, 0, 0));

    uranus = new ObjModel(
        "Uranus",
        "../models/SolarSystem/Uranus/Uranus.obj",
        "../models/SolarSystem/Uranus/Uranus.mtl",
        vec3(orbitDistances["Uranus"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));

    neptune = new ObjModel(
        "Neptune",
        "../models/SolarSystem/Neptune/Neptune.obj",
        "../models/SolarSystem/Neptune/Neptune.mtl",
        vec3(orbitDistances["Neptune"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));

    pluto = new ObjModel(
        "Pluto",
        "../models/SolarSystem/Pluto/Pluto.obj",
        "../models/SolarSystem/Pluto/Pluto.mtl",
        vec3(orbitDistances["Pluto"], 0, 0), 
        -0.1,
        vec3(0, 0, 0));

    mirrorCube = new reflectiveCube(
        vec3(0, 0, 0),
        1,
        vec3(0, 0, 0)
    )

    var u = vec3(1, 0, 0);
    var v = vec3(0, 1, 0);
    var n = vec3(0, 0, 1);

    camera = new Camera(vec3(0, 1, 0), u, v, n, fov, aspectRatio, near, far);
    camera.vrp = vec3(0, 0, 108);
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
        new PlayerAction("KeyE"),
        new PlayerAction("Space"),
        new PlayerAction("ShiftLeft"),
    );
    inputManager = new InputManager(window, inputActions, 2);
    cameraController = new CameraController(inputManager);

    var _ = new LightManager([sun, flashlight]);

    celestialBodies = [Sun, mercury, venus, earth, mars, jupiter, saturnBody, saturnRings, uranus, neptune, pluto, mirrorCube]

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

    sunRotation = (sunRotation + deltaTime) % 360;
    Sun.setRotation(0, sunRotation, 0);
    [mercury, venus, earth, mars, jupiter, saturnBody, saturnRings, uranus, neptune, pluto].forEach(function (body) {
        orbitAngles[body.name] += (orbitSpeeds[body.name] * deltaTime * orbitFactor) % 360;
        body.setPosition(orbitDistances[body.name] * Math.sin(orbitAngles[body.name]), 0, orbitDistances[body.name] * Math.cos(orbitAngles[body.name]));
    });
}

// Update only graphics
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    sky.draw();
    // [Sun, mercury, venus, earth, mars, jupiter, saturnBody, saturnRings, uranus, neptune, pluto].forEach(function (body) {
    //     body.draw();
    // });
    celestialBodies.forEach(function (body) {
        body.draw();
    });
}