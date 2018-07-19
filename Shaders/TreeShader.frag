#version 330

in struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

flat in int textureIndex;

uniform sampler2D mSamplers[2];

uniform Material material;
uniform vec4 gamma;

out vec4 fragColor;

void main()
{	
	fragColor = pow(texture(mSamplers[textureIndex], fsIn.texCoord), gamma);
	if(fragColor.a < 0.6)
	{
		discard;
	}
	
	vec3 normal = normalize(fsIn.worldNormal);
}