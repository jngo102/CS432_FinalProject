#version 300 es
precision mediump float;

in vec4 vColor;
in vec2 vTextureCoord;
uniform sampler2D textureUnit;

out vec4 fColor;

void main()
{
    fColor = texture(textureUnit, vTextureCoord) * vColor;
}
