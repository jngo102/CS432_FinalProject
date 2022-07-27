#version 300 es
in vec3 position;
in vec2 textureCoord;
uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;
out vec4 vTextureCoord;

void main()
{
    gl_Position = projectionMatrix * cameraMatrix * modelMatrix * vec4(position, 1.0);
    vTextureCoord = textureCoord;
}