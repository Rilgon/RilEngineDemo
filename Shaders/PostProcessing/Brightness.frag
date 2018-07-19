#version 430

uniform sampler2D mColor;

in vec2 fragTexCoord;

out vec4 fragColor;

#define LUMA vec3(0.2126, 0.7152, 0.072)


uniform float threshold;
uniform float middleGray;
uniform float white;
uniform float offset;
uniform float averageLuma;
uniform vec3 lumaVec;

void main()
{
	vec3 color = texture(mColor, fragTexCoord).rgb;
	float luma = dot(color, LUMA);
	
	float lumaScaled = luma * middleGray / averageLuma;
	lumaScaled = max(lumaScaled - threshold, 0.0);
	//float lumaBright = (lumaScaled * (1.0 + lumaScaled / (white*white))) / (offset + lumaScaled);
	float lumaBright = lumaScaled / (offset + lumaScaled);
	
	fragColor = vec4(color * lumaBright, 1.0);
}