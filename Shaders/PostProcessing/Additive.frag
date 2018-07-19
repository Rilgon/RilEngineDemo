#version 330

uniform sampler2D mTexture0;
uniform sampler2D mTexture1;

in vec2 fragTexCoord;

out vec4 fragColor;

void main()
{
	fragColor = texture(mTexture0, fragTexCoord) + texture(mTexture1, fragTexCoord);
}