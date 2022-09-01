#version 300 es
in vec3 position;
in vec4 color;
in vec2 texCoord;

uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;

flat out vec4 vColor;
out vec2 vTexCoord;

void main()
{
    gl_Position = projectionMatrix * cameraMatrix * modelMatrix * vec4(position, 1.0);
    vec3 pos = (cameraMatrix * modelMatrix * vec4(position, 1.0)).xyz;

    vColor = color;
    vTexCoord = texCoord;
}