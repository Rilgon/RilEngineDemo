#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;


#define NUM_SHADOW_MAPS 4

uniform mat4 viewProjectionMatrix;
uniform mat4 worldMatrix;
uniform int applyShadows;
uniform mat4 lightViewOrthoMatrices[NUM_SHADOW_MAPS];

out vec3 worldPosition;
out vec3 worldNormal;
out vec4 shadowTexCoords[NUM_SHADOW_MAPS];
out float clipPositionZ;
out vec4 wvpPosition;

void main()
{
	vec4 worldPos = worldMatrix * vec4(position, 1.0);
	gl_Position = viewProjectionMatrix * worldPos;
	clipPositionZ = gl_Position.z;
	wvpPosition = gl_Position;
	
	worldPosition = worldPos.xyz;
	worldNormal = vec3(worldMatrix * vec4(normal, 0.0));
	//if(applyShadows == 1)
	{
		int i;
		for(i = 0; i < NUM_SHADOW_MAPS; i++)
		{
			vec4 shadowSpace = lightViewOrthoMatrices[i] * worldPos;
			shadowSpace.xyz += 1.0;
			shadowSpace.xyz *= 0.5;
			shadowTexCoords[i] = shadowSpace;
		}
	}
}