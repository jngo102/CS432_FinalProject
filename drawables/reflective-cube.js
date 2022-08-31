class reflectiveCube extends Drawable{
    constructor(transform, scale, rotation){
        super(transform[0], transform[1], transform[2], scale, rotation[0], rotation[1], rotation[2]);
        if (this.shaderProgram == -1){
            this.initialize();
        }
    }

    static vertexPositions = [
    	vec3(-1,-1,1),
    	vec3(-1,1,1),
    	vec3(1,1,1),
    	vec3(1,-1,1),

    	vec3(-1,-1,-1),
    	vec3(-1,1,-1),
    	vec3(1,1,-1),
    	vec3(1,-1,-1),
    ];

    static vertexNormals = [
        vec3()
    ]

    static indices = [
        0,3,2,
        0,2,1,
        2,3,7,
        6,7,2, 
        0,4,7,
        0,7,3,
        1,2,6,
        6,5,1,
        4,6,5,
        4,6,7,
        0,1,5,
        0,5,4
        ];

        static positionBuffer = -1;

        static shaderProgram = -1;

        static uModelMatrixShader = -1;
        static uCameraMatrixShader = -1;
        static uProjectionMatrixShader = -1;

        static uTextureUnitShader = -1;
    
    initialize(){
        reflectiveCube.shaderProgram = initShaders( gl, "./shaders/vshader-env.glsl", "./shaders/fshader-env.glsl");

        reflectiveCube.positionBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, reflectiveCube.positionBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(reflectiveCube.vertexPositions), gl.STATIC_DRAW );

        reflectiveCube.uTextureUnitShader = gl.getUniformLocation(reflectiveCube.shaderProgram, "uTextureUnit");

        reflectiveCube.indexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, reflectiveCube.indexBuffer);
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(reflectiveCube.indices), gl.STATIC_DRAW );

        reflectiveCube.aPositionShader = gl.getAttribLocation( reflectiveCube.shaderProgram, "aPosition" );

        reflectiveCube.uModelMatrixShader = gl.getUniformLocation( reflectiveCube.shaderProgram, "modelMatrix" );
        reflectiveCube.uCameraMatrixShader = gl.getUniformLocation( reflectiveCube.shaderProgram, "cameraMatrix" );
        reflectiveCube.uProjectionMatrixShader = gl.getUniformLocation( reflectiveCube.shaderProgram, "projectionMatrix" );

        var texsize= 256;
        this.envTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envTexture);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, texsize, texsize, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, texsize, texsize, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, texsize, texsize, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, texsize, texsize, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, texsize, texsize, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, texsize, texsize, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

        this.envFrameBuffer= gl.createFramebuffer();
        this.envFrameBuffer.width= texsize;
        this.envFrameBuffer.height= texsize;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.envFrameBuffer);

        this.envRenderBuffer= gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.envRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texsize, texsize);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.envRenderBuffer);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);//restore to window frame/depth buffer
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
    
    createEnvironmentMap(){
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.envFrameBuffer)
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.envRenderBuffer)
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envTexture)

        var origu = vec3(camera1.u)
        var origv = vec3(camera1.v)
        var orign = vec3(camera1.n)
        var origvrp = vec3(camera1.vrp)
        var viewportParams = gl.getParameter(gl.VIEWPORT)

        gl.viewport(0, 0, texsize, texsize)

        camera1.projectionMatrix = perspective(90, 1.0, 0.1, 100)
        camera1.vrp = vec3(this.tx, this.ty, this.tx)

        for (var j = 0; j < 6; j++){
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envTexture)

            switch(j){
                case 0: //-z
                    camera1.u = vec3(-1, 0, 0);
                    camera1.v = vec3(0, -1, 0);
                    camera1.n = vec3(0, 0, 1);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, this.envTexture, 0);
                    break;
                case 1: //+z
                    camera1.u = vec3(-1, 0, 0);
                    camera1.v = vec3(0, -1, 0);
                    camera1.n = vec3(0, 0, -1);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, this.envTexture, 0);
                case 2: //-y
                    camera1.u = vec3(1, 0, 0)
                    camera1.v = vec3(0, 1, 0);
                    camera1.n = vec3(0, 0, -1);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, this.envTexture, 0);
                case 3: //+y
                    camera1.u = vec3(1, 0, 0)
                    camera1.v = vec3(0, -1, 0);
                    camera1.n = vec3(0, 0, -1);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, this.envTexture, 0);
                case 4: //-x
                    camera1.u = vec3(1, 0, 0)
                    camera1.v = vec3(0, -1, 0)
                    camera1.n = vec3(0, 0, 1)
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, this.envTexture, 0);
                case 5: //+x
                    camera1.u = vec3(-1, 0, 0)
                    camera1.v = vec3(0, -1, 0)
                    camera1.n = vec3(0, 0, 1)
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, this.envTexture, 0);
            }

            camera1.updateCameraMatrix()
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            for (var i = 0; i < celestialBodies.length; i++){
                if (celestialBodies[i] != this){
                    celestialBodies.draw()
                }
            }
        }

        //restore the regular rendering conditions
        camera1.u = origu;
        camera1.v = origv;
        camera1.n = orign;
        camera1.vrp = origvrp;

        camera1.projectionMatrix = perspective(fov, aspectRatio, near, far)
        gl.viewport(viewportParams[0], viewportParams[1], viewportParams[2], viewportParams[3])
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    }

    draw(){
        this.createEnvironmentMap();
        //TODO: add other cube drawing stuff here
        if(reflectiveCube.envTexture == -1)  //only draw when texture is loaded.
            return;

        gl.useProgram(reflectiveCube.shaderProgram);

        gl.bindBuffer( gl.ARRAY_BUFFER, reflectiveCube.positionBuffer);
        gl.vertexAttribPointer(reflectiveCube.aPositionShader, 3, gl.FLOAT, false, 0, 0 );

        // gl.bindBuffer( gl.ARRAY_BUFFER, Cube.textureCoordBuffer);
        // gl.vertexAttribPointer(Cube.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0 );

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, reflectiveCube.envTexture);
        gl.uniform1i(reflectiveCube.uTextureUnitShader,0);

        gl.uniformMatrix4fv(reflectiveCube.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(reflectiveCube.uCameraMatrixShader, false, flatten(camera1.cameraMatrix));
        gl.uniformMatrix4fv(reflectiveCube.uProjectionMatrixShader, false, flatten(camera1.projectionMatrix));

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, reflectiveCube.indexBuffer);

        gl.enableVertexAttribArray(reflectiveCube.aPositionShader);    
        // gl.enableVertexAttribArray(Cube.aTextureCoordShader);
        gl.drawElements(gl.TRIANGLES, reflectiveCube.indices.length, gl.UNSIGNED_BYTE, 0);
        gl.disableVertexAttribArray(reflectiveCube.aPositionShader);    
        // gl.disableVertexAttribArray(Cube.aTextureCoordShader);    
    }
}