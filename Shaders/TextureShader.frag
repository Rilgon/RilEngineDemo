#version 330

out vec4 fragColor;

uniform sampler2D mSampler;

in vec2 fragTexCoord;

uniform vec4 gamma;

void main()
{
	//
	fragColor = vec4(1.0);
	fragColor = pow(texture(mSampler, fragTexCoord), gamma);
}
