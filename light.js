class Light {
    constructor(loc, dir, amb, sp, dif, alpha, cutoff, type) {
        this.location = loc;
        this.direction = dir;
        this.ambient = amb;
        this.specular = sp;
        this.diffuse = dif;
        this.alpha = alpha;
        this.cutoff = cutoff;
        // 0 = point, 1 = directional, 2 = spot
        this.type = type;
        // 1 = On, 0 = Off
        this.status = 1;
    }
    
    toggle() {
        this.status = this.status == 1 ? 0 : 1;
    }
}