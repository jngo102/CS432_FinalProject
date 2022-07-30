class ObjModel extends Drawable {
    vertices = [];
    normals = [];
    textureCoords = [];
    faces = [];
    
    constructor(objPath, mtlPath, position, scale, rotation) {
        super(position[0], position[1], position[2], scale, rotation[0], rotation[1], rotation[2]);
        this.parseObj(objPath);
        this.parseMtl(mtlPath);
        this.waitSetupGL();
    }

    parseObj(objPath) {
        var objFile = loadFileAJAX(objPath);
        var lines = objFile.split('\n');
        lines.forEach((line) => {
            var tokens = line.trimRight().split(' ');
            if (tokens[0].includes("#")) {
                return;
            }
            var command = tokens[0];
            switch (command) {
                case "o":
                    break;
                case "mtllib":
                    break;
                case "s":
                    break;
                case "usemtl":
                    break;
                case "v":
                    var p1 = parseFloat(tokens[1]);
                    var p2 = parseFloat(tokens[2]);
                    var p3 = parseFloat(tokens[3]);
                    this.vertexPositions.push(vec3(p1, p2, p3));
                    break;
                case "vt":
                    var c1 = parseFloat(tokens[1]);
                    var c2 = parseFloat(tokens[2]);
                    this.vertexTextureCoordinates.push(vec2(c1, c2));
                    break;
                case "vn":
                    var n1 = parseFloat(tokens[1]);
                    var n2 = parseFloat(tokens[2]);
                    var n3 = parseFloat(tokens[3]);
                    this.normals.push(vec3(n1, n2, n3));
                    break;
                case "f":
                    var f1 = tokens[1];
                    var f2 = tokens[2];
                    var f3 = tokens[3];
                    var group = [f1, f2, f3];
                    this.faces.push(group);
                    break;
            }
        });

        this.faces.forEach((group) => {
            group.forEach((info) => {
                var infoArray = info.split('/');
                var posIndex = parseInt(infoArray[0]) - 1;
                var normIndex = parseInt(infoArray[2]) - 1;
                this.indices.push(posIndex);
                var vertexNormal = this.normals[normIndex];
                this.vertexNormals.push(vertexNormal);
                this.vertexColors.push(vec4(1, 1, 1, 1));
            });
        });
    }

    parseMtl(mtlPath) {
        var mtlFile = loadFileAJAX(mtlPath);
        var lines = mtlFile.split('\n');
        var texturePath, ambient, diffuse, specular, alpha;
        lines.forEach((line) => {
            var tokens = line.trimRight().split(' ');
            if (tokens[0].includes("#")) {
                return;
            }
            var command = tokens[0];
            switch (command) {
                case "newmtl":
                    break;
                case "Ns":
                    alpha = parseFloat(tokens[1]);
                    break;
                case "Ka":
                    ambient = vec4(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), 1);
                    break;
                case "Kd":
                    diffuse = vec4(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), 1);
                    break;
                case "Ks":
                    specular = vec4(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]), 1);
                    break;
                case "d":
                    break;
                case "illum":
                    break;
                case "map_Kd":
                    texturePath = tokens[1];
                    break;
            }
        });

        this.setupMaterial(texturePath, ambient, diffuse, specular, alpha);
    }
}