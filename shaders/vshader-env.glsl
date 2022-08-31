#version 300 es
in vec3 aPosition;
// in vec2 aTextureCoord;
// in vec3 aTextureCoord; //this will be calculated here, see slides in L08_P02

// out vec2 vTextureCoord;
out vec3 vTextureCoord;


uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;


void main()
{
    gl_Position = projectionMatrix*cameraMatrix*modelMatrix*vec4(aPosition,1.0);

    //see slide 18 in L08_P02
    vec3 V = normalize(inverse(cameraMatrix)*vec4(0,0,0,1)-modelMatrix*vec4(aPosition,1.0)).xyz;
    vec3 N=normalize(modelMatrix*vec4(aNormal,0.0)).xyz;

    vec3 I = inverse(V)

    R = reflect(vec3 I, vec3 N)

    vTextureCoord = R;
}