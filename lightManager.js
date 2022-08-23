class LightManager {
    static lights;

    constructor(lights) {
        LightManager.lights = lights;
    }

    static getLights() {
        return LightManager.lights;
    }
}