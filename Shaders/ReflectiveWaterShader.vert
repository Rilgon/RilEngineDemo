#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;

uniform mat4 worldMatrix;

out vec2 fragTexCoord;
out vec4 clipSpacePos;
out vec3 worldPos;
out vec3 viewVector;
out vec3 worldNormal;;

void main()
{
	worldPos = vec3(worldMatrix * vec4(position, 1.0));
	gl_Position =  projectionMatrix * viewMatrix * vec4(worldPos, 1.0);

	
	fragTexCoord = texCoord;
	viewVector = camPosition.xyz - worldPos;
	worldNormal = vec3(worldMatrix * vec4(normal, 0.0));
	
	clipSpacePos = gl_Position;
}