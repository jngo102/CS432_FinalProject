class InputManager {
    static instance;

    constructor(window, inputActions) {
        instance = this;
        this.window = window;
        this.inputActions = inputActions;
        this.setupInput();
    }

    setupInput() {
        this.window.on("keydown", (event) => {
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
            }
        });

        this.window.on("keyup", (event) => {
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
            }
        });
    }

    update(deltaTime) {
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
    }
}