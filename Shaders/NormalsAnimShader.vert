#version 330

#define MAX_BONES 128
#define NUM_SHADOW_MAPS 4

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;

layout(location = 5) in vec4 bones0;
layout(location = 6) in vec4 bones1;
layout(location = 7) in vec4 bones2;
layout(location = 8) in vec4 bones3;

layout(location = 9)  in vec4 weights0;
layout(location = 10) in vec4 weights1;
layout(location = 11) in vec4 weights2;
layout(location = 12) in vec4 weights3;

uniform mat4 worldMatrix;
uniform mat4 boneMatrices[MAX_BONES];

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

out vec4 fragNormal;

void main()
{
	mat4 bones = mat4(bones0, bones1, bones2, bones3);
	mat4 weights = mat4(weights0, weights1, weights2, weights3);
	
	mat4 boneMat = mat4(
		0.0, 0.0, 0.0, 0.0, 
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0);
	
	
	
	for(int i = 0; i < 4; i++)
	{
		for(int j = 0; j < 4; j++)
		{
			int boneID = int(bones[i][j]);
			if(boneID > -1) 
			{
				boneMat += boneMatrices[boneID] * weights[i][j];
			}
			else
			{
				break;
			}
		}
	}
	
	
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * boneMat * vec4(position, 1.0);
	fragNormal = worldMatrix * boneMat * vec4(normal, 0.0);
	
}