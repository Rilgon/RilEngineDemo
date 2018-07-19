#version 330

layout(location = 0) in vec4 positionAndMoveSpeed;

out float moveSpeed;

void main()
{
	gl_Position = vec4(positionAndMoveSpeed.xyz, 1.0);
	moveSpeed = positionAndMoveSpeed.w;
}