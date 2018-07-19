#version 330

layout(location = 0) in vec3 position;


uniform mat4 worldMatrix;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform vec4 corners[8];

out vec3 col;

void main()
{
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4(corners[gl_VertexID].xyz, 1.0);
	col = corners[gl_VertexID].xyz;
}