class ObjModel extends Drawable {
    faces = [];
    name = "";
    materialsMap = [];
    constructor(name, objPath, mtlPath, position, scale, rotation) {
        super(position[0], position[1], position[2], scale, rotation[0], rotation[1], rotation[2]);
        this.name = name;
        this.parseObj(objPath);
        this.parseMtl(mtlPath);
    }

    parseMtl(mtlPath) {
        var mtlFile = loadFileAJAX(mtlPath);
        var mats = mtlFile.split('\r\n\r\nnewmtl ');
        console.log(mats)
        mats.forEach((mat, matIndex) => {
            console.log(mtlPath)
            console.log(matIndex)
            if (matIndex <= 0) {
                return;
            }
            var lines = mat.split('\n');
            var matName = "None";
            var texturePath = "";
            
            var ambient = vec4(0.4, 0.4, 0.4, 1.0);
            var diffuse = vec4(1, 1, 1, 1); 
            var specular = vec4(1, 1, 1, 1);
            var alpha = 100;
            lines.forEach((line, index) => {
                var tokens = line.trimRight().split(' ');
                if (tokens[0].includes("#")) {
                    return;
                }
                if (index <= 0) {
                    matName = tokens[0];
                }
                var command = tokens[0];
                switch (command) {
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

            Material.createMaterial(matName, texturePath, ambient, diffuse, specular, alpha)
                .then((material) => {
                    for (var i = 0; i < this.materialsMap.length; i++) {
                        if (this.materialsMap[i].matName == material.name) {
                            var vertices = this.materialsMap[i]["vertices"];
                            var colors = this.materialsMap[i]["colors"];
                            var indices = this.materialsMap[i]["indices"];
                            var normals = this.materialsMap[i]["normals"];
                            var texCoords = this.materialsMap[i]["texCoords"];
                            var newMesh = Mesh.createMesh(vertices, colors, indices, normals, texCoords, material);
                            newMesh.computeNormals();
                            this.meshes.push(newMesh);

                            if (this.meshes.length == this.materialsMap.length) {
                                this.setupGL();
                            }
                        }
                    }
                });
        });
    }

    parseObj(objPath) {
        var objFile = loadFileAJAX(objPath);
        var submeshes = objFile.split("o ");
        submeshes.forEach((submesh, meshIndex) => {
            if (meshIndex <= 0) {
                return;
            }
            var vertices = [];
            var colors = [];
            var indices = [];
            var normals = [];
            var texCoords = [];
            var matName = "";
            var lines = submesh.split('\n');
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
                        matName = tokens[1];
                        break;
                    case "v":
                        var p1 = parseFloat(tokens[1]);
                        var p2 = parseFloat(tokens[2]);
                        var p3 = parseFloat(tokens[3]);
                        vertices.push(vec3(p1, p2, p3));
                        break;
                    case "vt":
                        var c1 = parseFloat(tokens[1]);
                        var c2 = parseFloat(tokens[2]);
                        texCoords.push(vec2(c1, c2));
                        break;
                    case "vn":
                        var n1 = parseFloat(tokens[1]);
                        var n2 = parseFloat(tokens[2]);
                        var n3 = parseFloat(tokens[3]);
                        normals.push(vec3(n1, n2, n3));
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

            var tempNorms = [];
            this.faces.forEach((group) => {
                group.forEach((info) => {
                    var infoArray = info.split('/');
                    var posIndex = parseInt(infoArray[0]) - 1;
                    var texIndex = parseInt(infoArray[1]) - 1;
                    var normIndex = parseInt(infoArray[2]) - 1;
                    indices.push(posIndex);
                    tempNorms.push(normals[normIndex]);
                    colors.push(vec4(1, 1, 1, 1));
                });
            });

            normals = tempNorms;

            this.materialsMap.push({
                "matName": matName, 
                "vertices": vertices, 
                "colors": colors, 
                "indices": indices, 
                "normals": normals, 
                "texCoords": texCoords
            });
        });
    }
}