class skyBox extends Drawable{
    static vertexPositions = [
    	vec3(-20,-20,20),
    	vec3(-20,20,20),
    	vec3(20,20,20),
    	vec3(20,-20,20),

    	vec3(-20,-20,-20),
    	vec3(-20,20,-20),
    	vec3(20,20,-20),
    	vec3(20,-20,-20),
    ];
  
    static vertexTextureCoords = [ //TODO: make these vec3
        // vec2(0,0),
       	// vec2(1,0),
       	// vec2(1,1),
    	// vec2(0,1),

        // vec2(0,0),
        // vec2(1,0),
        // vec2(1,1),
        // vec2(0,1),

        // vec3(-1, -1, 1),
        // vec3(1, -1, 1),
        // vec3( )

        vec3(-1,-1,1),
    	vec3(-1,1,1),
    	vec3(1,1,1),
    	vec3(1,-1,1),

    	vec3(-1,-1,-1),
    	vec3(-1,1,-1),
    	vec3(1,1,-1),
    	vec3(1,-1,-1),

    ];
    
    static indices = [
        0,3,2,
        0,2,1,
        2,3,7,
        2,7,6, 
        0,4,7,
        0,7,3,
        1,2,6,
        1,6,5,
        4,5,6,
        4,6,7,
        0,1,5,
        0,5,4
        ];

    static positionBuffer = -1;
    static textureCoordBuffer = -1;
    static indexBuffer = -1;

    static shaderProgram = -1;
    static aPositionShader = -1;
    static aTextureCoordShader = -1;
    
    static uModelMatrixShader = -1;
    static uCameraMatrixShader = -1;
    static uProjectionMatrixShader = -1;
    
    static texture = -1;
    static uTextureUnitShader = -1;
    
    static counter = 0;

    static cubemap_image = 0;
    
    static initialize() {
    	skyBox.shaderProgram = initShaders( gl, "../shaders/vshader-skybox.glsl", "../shaders/fshader-skybox.glsl");
		
	// Load the data into the GPU
	skyBox.positionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, skyBox.positionBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(skyBox.vertexPositions), gl.STATIC_DRAW );
	
	skyBox.textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, skyBox.textureCoordBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(skyBox.vertexTextureCoords), gl.STATIC_DRAW );
	skyBox.uTextureUnitShader = gl.getUniformLocation(skyBox.shaderProgram, "uTextureUnit");
	
	skyBox.indexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, skyBox.indexBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(skyBox.indices), gl.STATIC_DRAW );
		
	// Associate our shader variables with our data buffer
	skyBox.aPositionShader = gl.getAttribLocation( skyBox.shaderProgram, "aPosition" );
	skyBox.aTextureCoordShader = gl.getAttribLocation( skyBox.shaderProgram, "aTextureCoord" );
	
	skyBox.uModelMatrixShader = gl.getUniformLocation( skyBox.shaderProgram, "modelMatrix" );
	skyBox.uCameraMatrixShader = gl.getUniformLocation( skyBox.shaderProgram, "cameraMatrix" );
	skyBox.uProjectionMatrixShader = gl.getUniformLocation( skyBox.shaderProgram, "projectionMatrix" );

    }
    
    static initializeTexture(){
        
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyBox.texture)


    //     // for (var i = 0; i < 6; i++){ 
    //     //     let image = new Image();
    //     //     image.src = images[i];
    //     //     image.i = i;
    //     //     image.onload = function(){
                
    //             gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyBox.texture)
                
    //     //         // From https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
    //     //         // TEXTURE_CUBE_MAP_POSITIVE_X	0x8515	
    //     //         // TEXTURE_CUBE_MAP_NEGATIVE_X	0x8516	
    //     //         // TEXTURE_CUBE_MAP_POSITIVE_Y	0x8517	
    //     //         // TEXTURE_CUBE_MAP_NEGATIVE_Y	0x8518	
    //     //         // TEXTURE_CUBE_MAP_POSITIVE_Z	0x8519	
    //     //         // TEXTURE_CUBE_MAP_NEGATIVE_Z	0x851A

                // for (var i = 0; i < 6; i++){ //Citing this code repository for the for-loop here: https://github.com/xdsopl/webgl/blob/master/cubemap.html
    //     //         //     image.src(images[i])
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + skyBox.counter, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, skyBox.cubemap_image[skyBox.counter])

                // }
                console.log(skyBox.counter)
                console.log(gl.TEXTURE_CUBE_MAP_POSITIVE_X + skyBox.counter)

    //                 for (var i = 0; i < 6; i++)
    //                     gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + skyBox.counter, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, cubemap_image[i])
    //     //         console.log(this.i)
    //     //         gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + this.i, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image)

                //gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                skyBox.counter++;
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)  
    //     //         skyBox.count++;          
    //     //     }
    //     // }

    //     //are these meant to be here?
    //     // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    //     // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    //     // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    //     // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    //     // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)      

    //     // image.src = "./textures/sky-left.jpg";//TODO: make sure that gl.texImage2D gets a list elemen at index i with the correct sky-DIRECTION.jpg
    //     // image.src = imageSources
    }

    static loadCubemap(imagesSources){
        // skyBox.counter = 0;
        skyBox.cubemap_image = [];
        skyBox.texture = gl.createTexture();
        for (var i = 0; i < 6; i++) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyBox.texture) //citing the creator of WebGLfundamentals for the below use of waiting for an image to load: https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, 
                new Uint8Array([0, 0, 255]));
            // skyBox.cubemap_image[i] = new Image();
            // skyBox.cubemap_image[i].onload = skyBox.initializeTexture; //perhaps this.initializeTexture
            // skyBox.cubemap_image[i].src = imagesSources[i];

            skyBox.cubemap_image[i] = new Image();
            skyBox.cubemap_image[i].addEventListener('load',skyBox.initializeTexture)
            skyBox.cubemap_image[i].src = imagesSources[i];
        }
    }

    // static loadCubemap(imagesSources){
    //     // skyBox.counter = 0;
    //     skyBox.cubemap_image = [];
    //     skyBox.texture = gl.createTexture();
    //     gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyBox.texture)
    //     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    //     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    //     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    //     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    //     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)  
    //     for (var i = 0; i < 6; i++) {
    //         skyBox.cubemap_image[i] = new Image();
    //         skyBox.cubemap_image[i].onload = skyBox.initializeTexture; //perhaps this.initializeTexture
    //         skyBox.cubemap_image[i].src = imagesSources[i];
    //     }
    // }
    
    constructor(transform, scale, rotation ){ //TODO: addtexture path to constructor as argument
        // super(transform[0], transform[1], transform[2], scale, rotation[1], rotation[2], rotation[3]);
        super(0, 0, 0, scale, 0, 0, 0);
        console.log(transform[0])
        console.log(transform)
        if(skyBox.shaderProgram == -1){
            skyBox.initialize()
            var imagesSources = [
                // "../textures/skybox-cloudy-day/sky-right.jpg",
                // "../textures/skybox-cloudy-day/sky-left.jpg",
                // "../textures/skybox-cloudy-day/sky-top.jpg",
                // "../textures/skybox-cloudy-day/sky-bottom.jpg",
                // "../textures/skybox-cloudy-day/sky-front.jpg",  
                // "../textures/skybox-cloudy-day/sky-back.jpg",

                // "../textures/skybox-nebula/skybox_left.png",
                // "../textures/skybox-nebula/skybox_right.png",
                // "../textures/skybox-nebula/skybox_up.png",
                // "../textures/skybox-nebula/skybox_down.png",
                // "../textures/skybox-nebula/skybox_front.png",  
                // "../textures/skybox-nebula/skybox_back.png",

                
                "../textures/skybox-ulukai/corona_rt.png",//1
                "../textures/skybox-ulukai/corona_lf.png",//2
                
                "../textures/skybox-ulukai/corona_up.png",         
                "../textures/skybox-ulukai/corona_dn.png",                
                        


                "../textures/skybox-ulukai/corona_bk.png",
                "../textures/skybox-ulukai/corona_ft.png",//6

            ];

            // for( var i = 0; i < 6; i++ ){
            //     skyBox.initializeTexture(images[i]);
            // }
            
            skyBox.loadCubemap(imagesSources);

            
        }
        
    }
    
    draw() {
        if(skyBox.counter < 6)  //only draw when texture is loaded.
        	return;

        var oldCameraVRP = camera.getCameraVRP()//save old camera vrp in variable to restore to after drawing
        console.log(oldCameraVRP)
        camera.setCameraVRP(vec3(0,1,0))
        console.log(camera.getCameraVRP())


        gl.disable(gl.DEPTH_TEST) //Slide 11 in L07/P3: To ensure that the skybox doesn’t occlude anything else, we’ll just disable depth testing before rendering it, and re-enable them after
        
        gl.useProgram(skyBox.shaderProgram);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, skyBox.positionBuffer);
       	gl.vertexAttribPointer(skyBox.aPositionShader, 3, gl.FLOAT, false, 0, 0 );
       	
       	gl.bindBuffer( gl.ARRAY_BUFFER, skyBox.textureCoordBuffer);
       	// gl.vertexAttribPointer(skyBox.aTextureCoordShader, 2, gl.FLOAT, false, 0, 0 ); //TODO: tell it to pull out 3 floats
        gl.vertexAttribPointer(skyBox.aTextureCoordShader, 3, gl.FLOAT, false, 0, 0 ); //TODO: tell it to pull out 3 floats
       	
       	gl.activeTexture(gl.TEXTURE0);
       	gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyBox.texture);
       	gl.uniform1i(skyBox.uTextureUnitShader,0);

        //TODO: add view reference pointer repostitioning to 0 in order to make the cube render at the center and to never be able to go outside of it (this leverages the disabled depth drawing)
       	gl.uniformMatrix4fv(skyBox.uModelMatrixShader, false, flatten(this.modelMatrix));
        gl.uniformMatrix4fv(skyBox.uCameraMatrixShader, false, flatten(camera.cameraMatrix));
        gl.uniformMatrix4fv(skyBox.uProjectionMatrixShader, false, flatten(camera.projectionMatrix));
                    
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, skyBox.indexBuffer);
        
        gl.enableVertexAttribArray(skyBox.aPositionShader);    
        gl.enableVertexAttribArray(skyBox.aTextureCoordShader);
        

        gl.drawElements(gl.TRIANGLES, skyBox.indices.length, gl.UNSIGNED_BYTE, 0);
        
        
    	gl.disableVertexAttribArray(skyBox.aPositionShader);    
    	gl.disableVertexAttribArray(skyBox.aTextureCoordShader);    
        gl.enable(gl.DEPTH_TEST) //Slide 11 in L07/P3: To ensure that the skybox doesn’t occlude anything else, we’ll just disable depth testing before rendering it, and re-enable them after
        camera.setCameraVRP(oldCameraVRP)
    }
}

