#version 330

out vec4 fragColor;

uniform vec4 color;

in vec3 col;

void main()
{
	//fragColor = vec4(normalize(col) * 0.5 + 0.5, 1.0);
	fragColor = color;
}
