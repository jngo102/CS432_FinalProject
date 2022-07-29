class ObjModel extends Drawable {
    texture = null;
    
    constructor(modelPath, texturePath, position, scale, rotation) {
        super(position[0], position[1], position[2], scale, rotation[0], rotation[1], rotation[2], vec4(1, 1, 1, 1));
        this.modelPath = modelPath;
        this.texturePath = texturePath;
        this.model = null;
        this.texture = null;
        this.textureLoaded = false;
        this.modelLoaded = false;
        this.loadModel();
        this.loadTexture();
    }

    loadModel() {
        this.model = new OBJFile.loadModel()
        this.modelLoaded = true;
    }

    loadTexture() {
        this.texture = new Texture(this.gl, this.texturePath);
        this.textureLoaded = true;
    }

    draw(camera) {
        if (this.modelLoaded && this.textureLoaded) {
            this.model.draw(camera, this.texture);
        }
    }
}