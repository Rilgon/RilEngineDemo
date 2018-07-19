#version 430

in vec2 fragTexCoord;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

layout(binding = 0) uniform sampler2D mTexture;

out vec4 fragColor;

void main()
{
	float luma = 0.0;
	
	for(int i = -1; i <= 1; i++)
	{
		for(int j = -1; j <= 1; j++)
		{
			luma += log(dot(LUMA, textureOffset(mTexture, fragTexCoord, ivec2(j, i)).rgb));
		}
	}

	luma /= 9.0;

	//luma = log(dot(LUMA, texture(mColorTex, fragTexCoord).rgb));
	fragColor = vec4(luma);
}