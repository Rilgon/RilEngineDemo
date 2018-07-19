#version 330

#define MAX_KERNAL 9
#define BLUR_VERT 0

in vec2 fragTexCoord;

uniform sampler2D mColor;

uniform vec2 texOffset;

uniform float kernal[MAX_KERNAL];
uniform int kernalSize;
uniform int blurDirection;

out vec4 fragColor;


void main()
{
	fragColor = texture(mColor, fragTexCoord) * kernal[0];

	
	if(blurDirection == BLUR_VERT)
	{
		
		for(int i = 1; i < kernalSize; i++)
		{
			fragColor += texture(mColor, fragTexCoord + vec2(0.0, texOffset.y * float(i))) * kernal[i];
			fragColor += texture(mColor, fragTexCoord - vec2(0.0, texOffset.y * float(i))) * kernal[i];
		}
	}
	else
	{
		for(int i = 1; i < kernalSize; i++)
		{
			fragColor += texture(mColor, fragTexCoord + vec2(texOffset.x * float(i), 0.0)) * kernal[i];
			fragColor += texture(mColor, fragTexCoord - vec2(texOffset.x * float(i), 0.0)) * kernal[i];
		}
	}
}