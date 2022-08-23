#version 300 es
precision mediump float;

in vec4 vColor;
in vec2 vTexCoord;
uniform sampler2D texUnit;

out vec4 fColor;

void main()
{
    fColor = texture(texUnit, vTexCoord) * vColor;
}
