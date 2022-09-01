/// Handles inputs from keyboard and mouse
class InputManager {
    constructor(inputActions, mouseSensitivity) {
        this.inputActions = inputActions;
        this.mouseVector = vec2(0, 0);
        this.mouseSensitivity = mouseSensitivity

        this.setupInput();
    }

    setupInput() {
        // Key press
        window.addEventListener("keydown", (event) => {
            switch (event.code) {
                case this.inputActions.left.key:
                    this.inputActions.left.isPressed = true;
                    this.inputActions.left.wasPressed = true;
                    break;
                case this.inputActions.right.key:
                    this.inputActions.right.isPressed = true;
                    this.inputActions.right.wasPressed = true;
                    break;
                case this.inputActions.up.key:
                    this.inputActions.up.isPressed = true;
                    this.inputActions.up.wasPressed = true;
                    break;
                case this.inputActions.down.key:
                    this.inputActions.down.isPressed = true;
                    this.inputActions.down.wasPressed = true;
                    break;
                case this.inputActions.ascend.key:
                    this.inputActions.ascend.isPressed = true;
                    this.inputActions.ascend.wasPressed = true;
                    break;
                case this.inputActions.descend.key:
                    this.inputActions.descend.isPressed = true;
                    this.inputActions.descend.wasPressed = true;
                    break;
            }
        });

        // Key release
        window.addEventListener("keyup", (event) => {
            switch (event.code) {
                case this.inputActions.left.key:
                    this.inputActions.left.isPressed = false;
                    this.inputActions.left.wasReleased = true;
                    break;
                case this.inputActions.right.key:
                    this.inputActions.right.isPressed = false;
                    this.inputActions.right.wasReleased = true;
                    break;
                case this.inputActions.up.key:
                    this.inputActions.up.isPressed = false;
                    this.inputActions.up.wasReleased = true;
                    break;
                case this.inputActions.down.key:
                    this.inputActions.down.isPressed = false;
                    this.inputActions.down.wasReleased = true;
                    break;
                case this.inputActions.ascend.key:
                    this.inputActions.ascend.isPressed = false;
                    this.inputActions.ascend.wasReleased = true;
                    break;
                case this.inputActions.descend.key:
                    this.inputActions.descend.isPressed = false;
                    this.inputActions.descend.wasReleased = true;
                    break;
            }
        });

        // Mouse motion
        window.addEventListener("mousemove", (event) => {
            this.mouseVector = vec2(event.movementX * this.mouseSensitivity, event.movementY * this.mouseSensitivity);
        });

        window.addEventListener("click", (event) => {
            if (event.button != 0) {
                return;
            }
        
            var w = canvas.width;
            var h = canvas.height;
            var clickX = w / 2
            var clickY = h / 2;
            var xPrime = 2 * (clickX / w) - 1;
            var yPrime = 1 - 2 * (clickY / h);
            var pFront = vec4(xPrime, yPrime, -1, 1);
            var pCamUnscaled = mult(inverse(Camera.current.projectionMatrix), pFront);
            var pCam = mult(1 / pCamUnscaled[3], pCamUnscaled);
            var pWorldUnscaled = mult(inverse(Camera.current.cameraMatrix), pCam);
            var pWorld = mult(1 / pWorldUnscaled[3], pWorldUnscaled);
            var Q = Camera.current.vrp;
            var v = subtract(vec3(pWorld[0], pWorld[1], pWorld[2]), Q);
            console.log("v = " + v);
            var smallestAlpha = Infinity;
            var closestBody = null;
            bodies.forEach((body) => {
                body.meshes.forEach((mesh) => {
                    for (var i = 0; i < mesh.indices.length; i += 3) {
                        var mm = body.modelMatrix;
                        var EModel = mesh.vertices[mesh.indices[i]];
                        var FModel = mesh.vertices[mesh.indices[i + 1]];
                        var GModel = mesh.vertices[mesh.indices[i + 2]];
                        var E4 = mult(mm, vec4(EModel[0], EModel[1], EModel[2], 0));
                        var F4 = mult(mm, vec4(FModel[0], FModel[1], FModel[2], 0));
                        var G4 = mult(mm, vec4(GModel[0], GModel[1], GModel[2], 0));
                        var E = vec3(E4[0], E4[1], E4[2]);
                        var F = vec3(F4[0], F4[1], F4[2]);
                        var G = vec3(G4[0], G4[1], G4[2]);
                        var N = cross(subtract(F, E), subtract(G, E));
                        var d = dot(mult(-1, E), N);
                        var alpha = -((dot(Q, N) + d) / dot(v, N));
                        var P = add(Q, mult(alpha, v));
                        // console.log("Intersection point on " + body.name + ": " + P);
                        console.log("Alpha on " + body.name + ": " + alpha);
                        if (dot(v, N) == 0 || alpha <= 0 || alpha >= smallestAlpha) {
                            return;
                        } else if (alpha > 0) {
                            var triNorm = mesh.normals[i / 3];
                            triNorm = cross(subtract(F, E), subtract(G, E));

                            var EF = subtract(F, E);
                            var EP = subtract(P, E);
                            var crossProduct1 = cross(EF, EP);
                            var dotProduct1 = dot(triNorm, crossProduct1);
                            console.log("dotProduct1 = " + dotProduct1);

                            if (dotProduct1 < 0) {
                                return;
                            }

                            var FG = subtract(G, F);
                            var FP = subtract(P, F);
                            var crossProduct2 = cross(FG, FP);
                            var dotProduct2 = dot(triNorm, crossProduct2);
                            console.log("dotProduct2 = " + dotProduct2);

                            if (dotProduct2 < 0) {
                                return;
                            }

                            var GE = subtract(E, G);
                            var GP = subtract(P, G);
                            var crossProduct3 = cross(GE, GP);
                            var dotProduct3 = dot(triNorm, crossProduct3);
                            console.log("dotProduct3 = " + dotProduct3);

                            if (dotProduct3 < 0) {
                                return;
                            }

                            if (alpha < smallestAlpha) {
                                smallestAlpha = alpha;
                                closestBody = body;
                            }
                        }
                    }
                });
            });

            if (closestBody != null) {
                console.log("Clicked on: " + closestBody.name);
            }
        });
    }

    // Update the input managed every frame
    update(deltaTime) {
        this.mouseVector = vec2(0, 0);

        if (this.inputActions.left.wasPressed) {
            this.inputActions.left.wasPressed = false;
        }
        if (this.inputActions.right.wasPressed) {
            this.inputActions.right.wasPressed = false;
        }
        if (this.inputActions.up.wasPressed) {
            this.inputActions.up.wasPressed = false;
        }
        if (this.inputActions.down.wasPressed) {
            this.inputActions.down.wasPressed = false;
        }
        if (this.inputActions.ascend.wasPressed) {
            this.inputActions.ascend.wasPressed = false;
        }
        if (this.inputActions.descend.wasPressed) {
            this.inputActions.descend.wasPressed = false;
        }
        
        if (this.inputActions.left.wasReleased) {
            this.inputActions.left.wasReleased = false;
        }
        if (this.inputActions.right.wasReleased) {
            this.inputActions.right.wasReleased = false;
        }
        if (this.inputActions.up.wasReleased) {
            this.inputActions.up.wasReleased = false;
        }
        if (this.inputActions.down.wasReleased) {
            this.inputActions.down.wasReleased = false;
        }
        if (this.inputActions.ascend.wasReleased) {
            this.inputActions.ascend.wasReleased = false;
        }
        if (this.inputActions.descend.wasReleased) {
            this.inputActions.descend.wasReleased = false;
        }
    }
}