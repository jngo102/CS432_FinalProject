class Camera {
    static current = null;

    constructor(vrp, u, v, n, near, far) {
        this.vrp = vrp;
        this.u = normalize(u);
        this.v = normalize(v);
        this.n = normalize(n);
        this.near = near;
        this.far = far;

        this.projectionMatrix = perspective(45, 1, this.near, this.far);

        this.setCurrent();

        this.updateCameraMatrix();
    }

    lookAt(target) {
        this.cameraMatrix = lookAt(this.vrp, target, vec3(0, 1, 0));
    }

    setCurrent() {
        Camera.current = this;
    }

    translate(x, y, z) {
        this.vrp = add(this.vrp, mult(x, this.u));
        this.vrp = add(this.vrp, mult(y, this.v));
        this.vrp = add(this.vrp, mult(z, this.n));
        this.updateCameraMatrix();
    }

    updateCameraMatrix() {
        let t = translate(-this.vrp[0], -this.vrp[1], -this.vrp[2]);
        let r = mat4(
            this.u[0], this.u[1], this.u[2], 0,
            this.v[0], this.v[1], this.v[2], 0,
            this.n[0], this.n[1], this.n[2], 0,
            0, 0, 0, 1,
        );
        this.cameraMatrix = mult(r, t);
    }
}