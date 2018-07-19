#version 330

layout (location = 0) in vec3 position;

uniform mat4 world;

void main()
{
	gl_Position = world * vec4(position.x, position.y, 0.0, 1.0);
}