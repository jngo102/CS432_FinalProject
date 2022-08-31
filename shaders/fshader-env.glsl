#version 300 es
precision mediump float;

// in vec2 vTextureCoord;
in vec3 vTextureCoord;
// uniform sampler2D uTextureUnit; //for skybox samplerCube
uniform samplerCube uTextureUnit; //for skybox samplerCube

out vec4 fColor;

void main()
{
    fColor = texture(uTextureUnit, vTextureCoord);
}
