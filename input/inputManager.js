/// Handles inputs from keyboard and mouse
class InputManager {
    constructor(window, inputActions, mouseSensitivity) {
        this.window = window;
        this.inputActions = inputActions;
        this.mouseVector = vec2(0, 0);
        this.mouseSensitivity = mouseSensitivity

        this.setupInput();
    }

    setupInput() {
        // Key press
        this.window.addEventListener("keydown", (event) => {
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
                case this.inputActions.interact.key:
                    this.inputActions.interact.isPressed = true;
                    this.inputActions.interact.wasPressed = true;
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
        this.window.addEventListener("keyup", (event) => {
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
                case this.inputActions.interact.key:
                    this.inputActions.interact.isPressed = false;
                    this.inputActions.interact.wasReleased = true;
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
        this.window.addEventListener("mousemove", (event) => {
            this.mouseVector = vec2(event.movementX * this.mouseSensitivity, event.movementY * this.mouseSensitivity);
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
        if (this.inputActions.interact.wasPressed) {
            this.inputActions.interact.wasPressed = false;
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
        if (this.inputActions.interact.wasReleased) {
            this.inputActions.interact.wasReleased = false;
        }
        if (this.inputActions.ascend.wasReleased) {
            this.inputActions.ascend.wasReleased = false;
        }
        if (this.inputActions.descend.wasReleased) {
            this.inputActions.descend.wasReleased = false;
        }
    }
}