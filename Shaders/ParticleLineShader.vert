#version 330

layout(location = 0) in vec4 pos_life;

void main()
{
	gl_Position = pos_life;
}