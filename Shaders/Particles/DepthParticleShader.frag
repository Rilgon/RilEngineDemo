#version 330

in struct FS_Input
{
	vec2 texCoord;
	float particleLife;
	float opacity;
} fsInput;

uniform sampler2D mSampler;
uniform vec4 gamma;

uniform struct Material
{
	vec3 startColor;
	vec3 endColor;
	float discardOpacity;
	int fadeWithLife;
	float fadeFactor;
	float startOpacity;
	float endOpacity;
	float size;
} material;

out vec4 fragColor;

void main()
{
	fragColor = pow(texture(mSampler, fsInput.texCoord), vec4(1.0));
	if(fragColor.a < material.discardOpacity)
	{
		discard;
	}
}