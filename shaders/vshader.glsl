#version 300 es

in vec3 position, normal;
in vec4 color;
in vec2 textureCoord;

uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;

uniform vec4 matAmbient, matDiffuse, matSpecular;
uniform float matAlpha;

uniform vec3 lightDirection;
uniform vec4 lightAmbient, lightDiffuse, lightSpecular;

out vec4 vColor;
out vec2 vTextureCoord;

void main()
{
    gl_Position = projectionMatrix * cameraMatrix * modelMatrix * vec4(position, 1.0);
    //the ray from the vertex towards the light
    //for a directional light, this is just -lightDirection
    vec3 L = normalize((-cameraMatrix * vec4(lightDirection, 0.0)).xyz);
    
    //the ray from the vertex towards the camera
    vec3 E = normalize(vec3(0, 0, 0) - position);
    
    //normal in camera coordinates
    vec3 N = normalize(cameraMatrix * modelMatrix * vec4(normal, 0.0)).xyz;
    
    //half-way vector	
    vec3 H = normalize(L + E);
    
    vec4 ambient = lightAmbient * matAmbient;
    
    float Kd = max(dot(L, N), 0.0);
    vec4 diffuse = Kd * lightDiffuse * matDiffuse;
    
    float Ks = pow(max(dot(N, H), 0.0), matAlpha);
    vec4 specular = Ks * lightSpecular * matSpecular;
    
    vec4 lightColor = ambient + diffuse + specular;
    lightColor.a = 1.0;
    
    vColor = 0.1 * color + 0.9 * lightColor;
    vTextureCoord = textureCoord;
}