#version 300 es
in vec3 aPosition;

in vec3 aTextureCoord;


out vec3 vTextureCoord;


uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;


void main()
{
    gl_Position = projectionMatrix*cameraMatrix*modelMatrix*vec4(aPosition,1.0);
    vTextureCoord = normalize(aTextureCoord.xyz);
}