#version 330

in vec4 fragNormal;

out vec4 fragColor;

void main()
{
	fragColor = normalize(fragNormal);
}