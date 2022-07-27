var canvas;
var gl;

var camera;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);

    camera = new Camera(vec3(0, 5, 5), vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1), 0.1, 100);

    render();
};

function render() {
    setTimeout(function () {
        requestAnimationFrame(render);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        camera.lookAt(vec3(0, 0, 0));
    });
}
