/// Contains material data
class Material {
    constructor(name, texture, ambient, diffuse, specular, alpha) {
        this.name = name;
        this.texture = texture;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.alpha = alpha;
    }

    static async createMaterial(matName, texturePath, ambient, diffuse, specular, alpha) {
        var material = null;
        var image = new Image();

        console.log("Created image");
        image.onload = () => {
            console.log("img load complete");
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            material = new Material(matName, texture, ambient, diffuse, specular, alpha);
        }

        console.log("Set img src to " + texturePath);
        image.src = texturePath;

        while (material == null) {
            console.log("Material: " + material);
            await new Promise(r => setTimeout(r, 10));
        }

        console.log("Material: " + material);
        return material;
    }
}