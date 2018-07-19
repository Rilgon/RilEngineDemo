#version 330

layout(location = 0) in vec3 position;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(position, 1.0);
}