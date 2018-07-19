#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;

out vec4 fragNormal;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(position, 1.0);
	
	fragNormal = worldMatrix * vec4(normal, 0.0);
}