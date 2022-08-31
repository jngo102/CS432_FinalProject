/// Controller for the main camera given provided inputs
class CameraController {
    constructor() {
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.moveVector = vec2(0, 0);
        this.moveSpeed = 5;
        this.flySpeed = 5;
    }

    // Update the camera every frame
    update(deltaTime) {
        this.yaw += (inputManager.mouseVector[0] * deltaTime) % 360;
        this.pitch += inputManager.mouseVector[1] * deltaTime;
        this.pitch = this.pitch.clamp(-80, 80);

        this.moveVector = vec3(0, 0, 0);
        if (inputManager.inputActions.left.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw + 180));
            this.moveVector[2] += Math.sin(radians(this.yaw + 180));
        }
        if (inputManager.inputActions.right.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw));
            this.moveVector[2] += Math.sin(radians(this.yaw));
        }
        if (inputManager.inputActions.up.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw - 90));
            this.moveVector[2] += Math.sin(radians(this.yaw - 90));
        }
        if (inputManager.inputActions.down.isPressed) {
            this.moveVector[0] += Math.cos(radians(this.yaw + 90));
            this.moveVector[2] += Math.sin(radians(this.yaw + 90));
        }

        // If the magnitude of moveVector is 0, a divide by 0 error will occur.
        if (this.moveVector[0] !== 0 || this.moveVector[2] !== 0) {
            this.moveVector = mult(deltaTime, mult(this.moveSpeed, normalize(this.moveVector)));
        }

        var flyVelocity = 0;
        if (inputManager.inputActions.ascend.isPressed) {
            flyVelocity += this.flySpeed * deltaTime;
        }
        if (inputManager.inputActions.descend.isPressed) {
            flyVelocity -= this.flySpeed * deltaTime;
        }
        this.moveVector[1] += flyVelocity;

        Camera.current.translate(this.moveVector[0], this.moveVector[1], this.moveVector[2]);
        
        var yawFactor = rotateY(this.yaw);
        var pitchFactor = rotateX(this.pitch);
        Camera.current.cameraMatrix = mult(yawFactor, Camera.current.cameraMatrix);
        Camera.current.cameraMatrix = mult(pitchFactor, Camera.current.cameraMatrix);
    }
}