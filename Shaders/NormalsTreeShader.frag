#version 330

in vec2 fragTexCoord;
in float texYOffset;

uniform sampler2D mSampler;

void main()
{
	vec2 uv;
	uv.x = fragTexCoord.x;
	uv.y = (fract(fragTexCoord.y) + texYOffset) * 0.5;

	if(texture(mSampler, uv).a < 0.4)
	{
		discard;
	}	
}