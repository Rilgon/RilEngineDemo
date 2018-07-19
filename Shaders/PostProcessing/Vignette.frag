#version 330

uniform float strength; //10.0
uniform float power; //21.0

in vec2 fragTexCoord;

out vec4 fragColor;

void main()
{
	vec2 texCoord = fragTexCoord;
	texCoord *= 2.0;
	texCoord -= 1.0;
	float vignette = length(texCoord);
	vignette = strength * pow(vignette, power);
	vignette = clamp(vignette, 0.0, 1.0);
	fragColor = vec4(1.0 - vignette);
}