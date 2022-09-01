#version 300 es
in vec3 position;
in vec4 color;
in vec3 normal;
in vec2 texCoord;

uniform mat4 modelMatrix, cameraMatrix, projectionMatrix;

uniform vec4 matAmbient, matDiffuse, matSpecular;
uniform float matAlpha;

uniform int lightStatus1, lightType1;
uniform float lightSpotAngle1, lightCutoff1;
uniform vec3 lightDirection1, lightLocation1;
uniform vec4 lightAmbient1, lightDiffuse1, lightSpecular1;

// uniform int lightStatus2, lightType2;
// uniform float lightSpotAngle2, lightCutoff2;
// uniform vec3 lightDirection2, lightLocation2;
// uniform vec4 lightAmbient2, lightDiffuse2, lightSpecular2;

out vec4 vColor;
out vec2 vTexCoord;

void main()
{
    gl_Position = projectionMatrix * cameraMatrix * modelMatrix * vec4(position, 1.0);
    vec3 pos = (cameraMatrix * modelMatrix * vec4(position, 1.0)).xyz;
    
    // the ray from the vertex towards the light
    // for a directional light, this is just -lightDirection
    vec3 L1 = normalize((-cameraMatrix * vec4(lightDirection1, 0.0)).xyz);
    // vec3 L2 = normalize((-cameraMatrix * vec4(lightDirection2, 0.0)).xyz);
    
    vec3 E = normalize(vec3(0, 0, 0) - pos);
    
    vec3 N = normalize(cameraMatrix * modelMatrix * vec4(normal, 0.0)).xyz;
    
    //half-way vector	
    vec3 H1 = normalize(L1 + E);
    // vec3 H2 = normalize(L2 + E);
    
    vec4 ambient1 = lightAmbient1 * matAmbient;
    // vec4 ambient2 = lightAmbient2 * matAmbient;
    
    float Kd1 = max(dot(L1, N), 0.0);
    // float Kd2 = max(dot(L2, N), 0.0);
    vec4 diffuse1 = Kd1 * lightDiffuse1 * matDiffuse;
    // vec4 diffuse2 = Kd2 * lightDiffuse2 * matDiffuse;

    float Ks1 = pow(max(dot(N, H1), 0.0), matAlpha);
    // float Ks2 = pow(max(dot(N, H2), 0.0), matAlpha);
    vec4 specular1 = Ks1 * lightSpecular1 * matSpecular;
    // vec4 specular2 = Ks2 * lightSpecular2 * matSpecular;
    
    vec4 lightColor1 = diffuse1 + specular1;
    // vec4 lightColor2 = diffuse2 + specular2;
    lightColor1.a = 1.0;
    // lightColor2.a = 1.0;

    vec4 finalColor = vec4(0, 0, 0, 0);

    if (lightStatus1 == 1)
    {
        vec3 pointToLight = normalize(position - lightLocation1);
        float dist = sqrt(dot(pointToLight, pointToLight));
        vec4 iPrime = lightColor1 / pow(dist, 2.0);
        if (lightType1 == 0)
        {
            finalColor += iPrime;
        }
        else if (lightType1 == 1)
        {
            finalColor += lightColor1;
        }
        else if (lightType1 == 2)
        {
            float LLs = dot(-pointToLight, normalize(lightDirection1));
            if (abs(acos(LLs)) > lightSpotAngle1)
            {
                finalColor += vec4(0, 0, 0, 0);
            }
            else
            {
                finalColor += pow(max(LLs, 0.0), lightCutoff1) * iPrime;
            }
        }
    }

    // if (lightStatus2 == 1)
    // {
    //     vec3 pointToLight = lightLocation2 - position;
    //     float dist = length(pointToLight);
    //     vec4 iPrime = lightColor2 / pow(dist, 2.0);
    //     if (lightType2 == 0)
    //     {
    //         finalColor += iPrime;
    //     }
    //     else if (lightType2 == 1)
    //     {
    //         finalColor += lightColor2;
    //     }
    //     else if (lightType2 == 2)
    //     {
    //         float LLs = dot(normalize(-pointToLight), normalize(lightDirection2));
    //         if (abs(acos(LLs)) > lightSpotAngle2)
    //         {
    //             finalColor += vec4(0, 0, 0, 0);
    //         }
    //         else
    //         {
    //             finalColor += pow(max(LLs, 0.0), lightCutoff2) * iPrime;
    //         }
    //     }
    // }

    finalColor += ambient1;
    // finalColor += ambient2;

    vColor = 0.1 * color * 0.25 + 0.65 * finalColor;
    vTexCoord = texCoord;
}