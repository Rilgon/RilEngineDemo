#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normals;
layout(location = 2) in vec3 tangents;
layout(location = 3) in vec3 animParams;
layout(location = 4) in vec3 speedParams;
layout(location = 5) in vec3 otherParams;
layout(location = 6) in vec2 texCoord; 

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform float totalTime;

out vec2 fragTexCoord;
out float texYOffset;
out vec3 fragNormal;

void main()
{

	fragTexCoord = texCoord;
	float branchWeight = otherParams.x;
	if(branchWeight > 0.1)
	{
		float cosX = cos(totalTime * animParams.x) * speedParams.x;
		float cosY = cos(totalTime * animParams.y) * speedParams.y;
		float cosZ = cos(totalTime * animParams.z) * speedParams.z;
		float textureOffset = otherParams.y;
		
		mat4 deltaMatrix = mat4(
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			cosX * branchWeight * textureOffset * 0.0, cosY * branchWeight * textureOffset, cosZ * branchWeight * textureOffset,  1.0);
			
		gl_Position = projectionMatrix * viewMatrix * worldMatrix * deltaMatrix * vec4(position, 1.0);
		texYOffset = 1.0;
	}
	else
	{
		gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(position, 1.0);
		texYOffset = 0.0;		
	}
}