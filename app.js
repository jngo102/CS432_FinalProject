var canvas;
var textCanvas;
var gl;

const FRAME_TIME = 1 / 60;
var shipCam;
var planetCam;
var cameraController;
var inputManager;

var sun;
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
var bodies;
var clickables;

var cone;
var selectedBodyName = "";

var sunRotation = 0;

const orbitFactor = 0.01;
var orbitAngles = {
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

const diameters = {
    "Sun": 865,
    "Mercury": 3.03,
    "Venus": 7.52,
    "Earth": 7.92,
    "Mars": 4.21,
    "Jupiter": 86.9,
    "Saturn": 72.4,
    "Uranus": 31.5,
    "Neptune": 30.6,
    "Pluto": 1.48,
}

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

const spinSpeeds = {
    "Mercury": 10.83,
    "Venus": -6.52,
    "Earth": 15.74,
    "Mars": 8.66,
    "Jupiter": 45.58,
    "Saturn": 36.84,
    "Uranus": 14.79,
    "Neptune": 9.72,
    "Pluto": 10.62,
};

var planetRotations = {
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

var ctx;
// var bodyInfo = {
//     "Sun": "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that can accelerate the Sun in order to maintain its temperature. It is by far the most important source of energy for life on Earth. Its diameter is about 1.39 million kilometers, and its mass is about 330,000 times that of Earth, accounting for about 99.86% of the total mass of the Solar System.",
//     "Mercury": "Mercury is the smallest and innermost planet in the Solar System. Its orbital period is 88 days, the shortest of all the planets in the Solar System. It is named after the Roman deity Mercury, the messenger of the gods.",
//     "Venus": "Venus is the second planet from the Sun, orbiting it every 224.7 Earth days. It has the longest rotation period of any planet in the Solar System and rotates in the opposite direction to most other planets. It has no natural satellites. It is named after the Roman goddess of love and beauty.",
//     "Earth": "Earth is the third planet from the Sun and the only object in the Universe known to harbor life. According to radiometric dating and other sources of evidence, Earth formed over 4.5 billion years ago. Earth's gravity interacts with other objects in space, especially the Sun and the Moon.",
//     "Mars": "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, after Mercury. In English, Mars is called 'the Red Planet' because the reddish iron oxide prevalent on its surface gives it a reddish appearance that is distinctive among the astronomical bodies visible to the naked eye.",
//     "Jupiter": "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a giant planet with a mass one-thousandth that of the Sun, but is two and a half times the mass of all the other planets in the Solar System combined. Jupiter is a gas giant; it is a gas giant because it is mostly hydrogen and helium.",
//     "Saturn": "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth. It has only one-eighth the average density of Earth, but with its larger volume, it is over twice as dense as Earth.",
//     "Uranus": "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Uranus is similar in composition to Neptune, and both have bulk chemical compositions which are similar to those of the other two giant planets in the Solar System, Neptune and Sun.",
//     "Neptune": "Neptune is the eighth and farthest known planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. Neptune is 17 times the mass of Earth and is slightly more massive than its near-twin Uranus.",
//     "Pluto": "Pluto is the ninth and most distant planet from the Sun. It is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of the Sun. It was the first Kuiper belt object to be discovered. The name is a portmanteau of the words Pluto and dwarf.",
// };

var bodyInfo = {
    "Sun": "Mass: 1.99*10^30 kg\nDiamter: 1.39*10^6 km\nGravity: 274 m/s^2\nSurface temperature: 5800 K\nLength of day: 27 hours",
    "Mercury": "Mass: 33*10^23 kg\nDiameter: 4,879 km\nGravity: 3.7m/s^2\nDistance from Sun: 5.79*10^7 km\nLength of day: 4222.6 hours\nLength of year: 88 days",
    "Venus": "Mass: 4.87*10^24 kg\nDiameter: 12,104 km\nGravity: 8.9m/s^2\nDistance from Sun: 1.08*10^8 km\nLength of day: 2802.0 hours\nLength of year: 224 days",
    "Earth": "Mass: 5.97*10^24 kg\nDiameter: 12,756 km\nGravity: 9.8m/s^2\nDistance from Sun: 1.49*10^8 km\nLength of day: 24.7 hours\nLength of year: 365 days",
    "Mars": "Mass: 6.42*10^23 kg\nDiameter: 6,794 km\nGravity: 3.7m/s^2\nDistance from Sun: 2.279*10^8 km\nLength of day: 24.7 hours\nLength of year: 687 days",
    "Jupiter": "Mass: 1.90*10^27 kg\nDiameter: 142,984 km\nGravity: 24.8m/s^2\nDistance from Sun: 7.78*10^9 km\nLength of day: 9.9 hours\nLength of year: 11.9 years",
    "Saturn": "Mass: 5.68*10^26 kg\nDiameter: 120,536 km\nGravity: 10.0m/s^2\nDistance from Sun: 1.427*10^12 km\nLength of day: 10.7 hours\nLength of year: 29.5 years",
    "Uranus": "Mass: 8.68*10^25 kg\nDiameter: 51,118 km\nGravity: 8.7m/s^2\nDistance from Sun: 2.870*10^12 km\nLength of day: 17.2 hours\nLength of year: 84.0 years",
    "Neptune": "Mass: 1.02*10^26 kg\nDiameter: 49,528 km\nGravity: 11.0m/s^2\nDistance from Sun: 4.498*10^12 km\nLength of day: 16.1 hours\nLength of year: 164.8 years",
    "Pluto": "Mass: 1.31*10^22 kg\nDiameter: 2,724 km\nGravity: 0.6m/s^2\nDistance from Sun: 5.9*10^12 km\nLength of day: 153.3 hours\nLength of year: 248.7 years",
};

var runTime = 0;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    canvas.onclick = function() {
        canvas.requestPointerLock();
    }

    // Resize canvas to fit most of the window
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);

    textCanvas = document.getElementById("text-canvas");
    ctx = textCanvas.getContext("2d");

    sky = new skyBox(
        vec3(0, 0, 0),
        1,
        vec3(0, 0, 0)
    );
    
    sun = new ObjModel(
        "Sun",
        "../models/SolarSystem/Sun/Sun.obj",
        "../models/SolarSystem/Sun/Sun.mtl",
        vec3(0, 0, 0),
        -0.1,
        vec3(0, 0, 0),
        "../shaders/vshader-flat.glsl",
        "../shaders/fshader-flat.glsl");

    mercury = new ObjModel(
        "Mercury",
        "../models/SolarSystem/Mercury/Mercury.obj",
        "../models/SolarSystem/Mercury/Mercury.mtl",
        vec3(orbitDistances["Mercury"], 0, 0),
        -0.1);

    venus = new ObjModel(
        "Venus",
        "../models/SolarSystem/Venus/Venus.obj",
        "../models/SolarSystem/Venus/Venus.mtl",
        vec3(orbitDistances["Venus"], 0, 0),
        -0.1);

    earth = new ObjModel(
        "Earth",
        "../models/SolarSystem/Earth/Earth.obj", 
        "../models/SolarSystem/Earth/Earth.mtl",
        vec3(orbitDistances["Earth"], 0, 0), 
        -0.1);

    mars = new ObjModel(
        "Mars",
        "../models/SolarSystem/Mars/Mars.obj", 
        "../models/SolarSystem/Mars/Mars.mtl",
        vec3(orbitDistances["Mars"], 0, 0), 
        -0.1);
    
    jupiter = new ObjModel(
        "Jupiter",
        "../models/SolarSystem/Jupiter/Jupiter.obj",
        "../models/SolarSystem/Jupiter/Jupiter.mtl",
        vec3(orbitDistances["Jupiter"], 0, 0), 
        -0.1);

    saturnBody = new ObjModel(
        "Saturn",
        "../models/SolarSystem/Saturn/SaturnBody.obj",
        "../models/SolarSystem/Saturn/SaturnBody.mtl",
        vec3(orbitDistances["Saturn"], 0, 0), 
        -0.1);

    saturnRings = new ObjModel(
        "Saturn",
        "../models/SolarSystem/Saturn/SaturnRings.obj",
        "../models/SolarSystem/Saturn/SaturnRings.mtl",
        vec3(orbitDistances["Saturn"], 0, 0),
        -0.1);

    uranus = new ObjModel(
        "Uranus",
        "../models/SolarSystem/Uranus/Uranus.obj",
        "../models/SolarSystem/Uranus/Uranus.mtl",
        vec3(orbitDistances["Uranus"], 0, 0), 
        -0.1);

    neptune = new ObjModel(
        "Neptune",
        "../models/SolarSystem/Neptune/Neptune.obj",
        "../models/SolarSystem/Neptune/Neptune.mtl",
        vec3(orbitDistances["Neptune"], 0, 0), 
        -0.1);

    pluto = new ObjModel(
        "Pluto",
        "../models/SolarSystem/Pluto/Pluto.obj",
        "../models/SolarSystem/Pluto/Pluto.mtl",
        vec3(orbitDistances["Pluto"], 0, 0), 
        -0.1);

    bodies = [sun, mercury, venus, earth, mars, jupiter, saturnBody, saturnRings, uranus, neptune, pluto];

    cone = new Cone(vec3(0, 0, 64), 2, vec3(0, 0, -90), "../shaders/vshader-flat.glsl", "../shaders/fshader-flat.glsl");

    var u = vec3(1, 0, 0);
    var v = vec3(0, 1, 0);
    var n = vec3(0, 0, 1);
    planetCam = new Camera(vec3(100, 100, 100), u, v, n, 65, 16 / 9, 0.1, 1000);
    planetCam.lookAt(vec3(0, 0, 0));
    shipCam = new Camera(vec3(0, 1, 0), u, v, n, 65, 16 / 9, 0.1, 1000);
    shipCam.vrp = vec3(0, 0, 108);
    var sunLight = new Light(
        vec3(0, 0, 0), 
        vec3(0, 0, 0),
        vec4(0.25, 0.25, 0.25, 1), 
        vec4(1, 1, 1, 1), 
        vec4(1, 1, 1, 1), 
        1, 128, 0, 1);
    var inputActions = new InputActions(
        new PlayerAction("KeyA"),
        new PlayerAction("KeyD"),
        new PlayerAction("KeyW"),
        new PlayerAction("KeyS"),
        new PlayerAction("Space"),
        new PlayerAction("ShiftLeft"),
    );
    inputManager = new InputManager(inputActions, 2);
    cameraController = new CameraController();

    var _ = new LightManager([sunLight]);

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

    sunRotation = (sunRotation + deltaTime * 0.1) % 360;
    sun.setRotation(0, sunRotation, 0);
    [mercury, venus, earth, mars, jupiter, saturnBody, saturnRings, uranus, neptune, pluto].forEach(function (body) {
        orbitAngles[body.name] += (orbitSpeeds[body.name] * deltaTime * orbitFactor) % 360;
        planetRotations[body.name] += (spinSpeeds[body.name] * deltaTime) % 360;
        body.setPosition(orbitDistances[body.name] * Math.sin(orbitAngles[body.name]), 0, orbitDistances[body.name] * Math.cos(orbitAngles[body.name]));
        body.setRotation(0, planetRotations[body.name], 0);
    });

    if (selectedBodyName != "") {
        bodies.forEach((body) => {
            if (body.name == selectedBodyName) {
                var bodyPos = body.getPosition();
                cone.setPosition(bodyPos[0], bodyPos[1] + diameters[body.name] * 0.05 + 4, bodyPos[2]);
                
                planetCam.setCameraVRP(vec3(bodyPos[0], bodyPos[1] + diameters[body.name] * 0.1 + 0.25, bodyPos[2] + diameters[body.name] * 0.05));
                planetCam.lookAt(bodyPos);
            }
        });  
    }
}

window.addEventListener("keydown", function(event) {
    if (!event.code.includes("Digit")) {
        return;
    }

    var digitCode = event.code;
    var index = parseInt(digitCode.replace("Digit", ""));
    // Skip Saturn's rings
    if (index > 6) {
        index++;
    }

    var body = bodies[index];

    if (Camera.current == shipCam) {
        Camera.current = planetCam;
    } else if (Camera.current == planetCam && selectedBodyName == bodies[index].name) {
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        shipCam.setCameraVRP(planetCam.getCameraVRP());
        shipCam.lookAt(body.getPosition());
        Camera.current = shipCam;
        return;
    }

    var bodyName = body.name;
    selectedBodyName = bodyName;
    
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "24px Arial";
    var info = bodyInfo[bodyName];
    var infoLines = info.split("\n");

    ctx.fillText(bodyName, 32, 32);
    infoLines.forEach((line, index) => {
        ctx.fillText(line, 32, 32 + (index + 1) * 24);
    });
});

// Update only graphics
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    sky.draw();
    bodies.forEach(function (body) {
        body.draw();
    });
    if (selectedBodyName != "") {
        cone.draw();
    }
}