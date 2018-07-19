#version 330

in vec2 fragTexCoord;
flat in int textureIndex;

uniform sampler2D mSamplers[2];

void main()
{
	vec4 fragColor = texture(mSamplers[textureIndex], fragTexCoord);
	if(fragColor.a < 0.6)
	{
		discard;
	}
}