#version 330

#define MAX_TEXTURES 6
#define MAX_MESHES 16

in struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

flat in int meshId;

uniform sampler2D mDiffuseTextures[MAX_TEXTURES];
//uniform sampler2D mNormalMapTextures[MAX_TEXTURES]; //TODO
uniform int textureMeshTable[MAX_MESHES];

uniform struct Material
{
	vec3 diffuse;
	vec3 specular;
	vec3 parameters;
} materials[MAX_TEXTURES];

uniform vec4 camPosition;

uniform vec4 gamma;

out vec4 fragColor;

void main()
{
	int texIndex = textureMeshTable[meshId];
	Material material = materials[texIndex];

	vec3 normal = normalize(fsIn.worldNormal);	
	
	vec3 texColor = vec3(1.0);
	if(material.parameters.y > 0.0001)
	{
		texColor = pow(texture(mDiffuseTextures[texIndex], fsIn.texCoord), gamma).rgb;
	}
	
	fragColor = vec4(texColor, 1.0);
}