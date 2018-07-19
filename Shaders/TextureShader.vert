#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;

uniform mat4 worldMatrix;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

out vec2 fragTexCoord;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(position, 1.0);
	
	fragTexCoord = texCoord;
}