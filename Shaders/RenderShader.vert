#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;

out vec2 fragTexCoord;

void main()
{
	gl_Position = vec4(position.x, position.y, 0.0, 1.0);
	fragTexCoord = texCoord;
}