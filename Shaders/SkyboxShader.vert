#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;
uniform	mat4 viewMatrix;

out vec3 direction;

void main()
{
	mat4 viewNoTrans = viewMatrix;
	viewNoTrans[3] = vec4(0.0, 0.0, 0.0, 1.0);

	gl_Position = projectionMatrix * viewNoTrans * worldMatrix * vec4(position, 1.0);
	gl_Position = gl_Position.xyww;
	
//	gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
	
	direction = position;
}