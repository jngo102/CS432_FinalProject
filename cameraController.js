/// Controller for the main camera given provided inputs
class CameraController {
    constructor(inputManager) {
        this.camera = Camera.current;
        this.inputManager = inputManager;

        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.moveVector = vec2(0, 0);
        this.moveSpeed = 5;
    }

    // Update the camera every frame
    update(deltaTime) {
        this.yaw += (this.inputManager.mouseVector[0] * deltaTime) % 360;
        this.pitch += this.inputManager.mouseVector[1] * deltaTime;
        this.pitch = this.pitch.clamp(-80, 80);

        this.moveVector = vec2(0, 0);
        if (this.inputManager.inputActions.left.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw + 180));
            this.moveVector[1] += Math.sin(radians(this.yaw + 180));
        }
        if (this.inputManager.inputActions.right.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw));
            this.moveVector[1] += Math.sin(radians(this.yaw));
        }
        if (this.inputManager.inputActions.up.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw - 90));
            this.moveVector[1] += Math.sin(radians(this.yaw - 90));
        }
        if (this.inputManager.inputActions.down.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw + 90));
            this.moveVector[1] += Math.sin(radians(this.yaw + 90));
        }

        // If the magnitude of moveVector is 0, a divide by 0 error will occur.
        if (this.moveVector[0] !== 0 || this.moveVector[1] !== 0) {
            this.moveVector = mult(deltaTime, mult(this.moveSpeed, normalize(this.moveVector)));
        }
        this.camera.translate(this.moveVector[0], 0, this.moveVector[1])
        
        var yawFactor = rotateY(this.yaw);
        var pitchFactor = rotateX(this.pitch);
        this.camera.cameraMatrix = mult(yawFactor, this.camera.cameraMatrix);
        this.camera.cameraMatrix = mult(pitchFactor, this.camera.cameraMatrix);

        var flashlight = LightManager.getLights()[1];
        flashlight.position = this.camera.position;
        if (this.inputManager.inputActions.flashlight.wasPressed) {
            flashlight.toggle();
        }
    }
}