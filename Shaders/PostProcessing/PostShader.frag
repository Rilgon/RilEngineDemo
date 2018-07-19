#version 330

#define FZERO 0.000001

uniform sampler2D mColor;
in vec2 fragTexCoord;

out vec4 fragColor;

uniform float exposure;
uniform float gamma;

void main()
{
	vec3 hdrColor = texture(mColor, fragTexCoord).rgb;
	
	vec3 result = (exposure > FZERO ? (vec3(1.0) - exp(-hdrColor * exposure)) : hdrColor);
	//result = hdrColor / (hdrColor + vec3(1.0));
	result = pow(result, vec3(1.0 / gamma));
	
	fragColor = vec4(result, 1.0);
}