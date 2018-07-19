#version 330

in vec2 fragTexCoord;

uniform sampler2D mRenderTexture;

out vec4 fragColor;

uniform int blue;

void main()
{
	
	fragColor = texture(mRenderTexture, fragTexCoord);
}	