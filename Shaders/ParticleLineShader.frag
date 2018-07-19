#version 330

in float fragLife;

out vec4 fragColor;

void main()
{	
	fragColor = vec4(66, 105, 140, 1.0);
	fragColor.rgb /= 255.0;
}