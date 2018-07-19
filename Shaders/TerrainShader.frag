#version 330

#define NUM_SPLAT_MAPS 3
#define NUM_TERRAIN_TEXTURES 10

in struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

uniform sampler2D mSplatMaps[NUM_SPLAT_MAPS];
uniform sampler2D mTerrainTextures[NUM_TERRAIN_TEXTURES];
uniform float textureRepeats[NUM_TERRAIN_TEXTURES];

uniform Material material;
uniform vec4 camPosition;

uniform vec4 gamma;

out vec4 fragColor;

void main()
{
	vec3 normal = normalize(fsIn.worldNormal);
	
	
	vec4 texColor = vec4(0.0);
	vec2 texCoord = fsIn.texCoord;
	
	vec4 baseTexture = pow(texture(mTerrainTextures[0], texCoord * textureRepeats[0]), gamma);
	float splatSum = 0.0;
	
	for(int i = 0; i < NUM_SPLAT_MAPS; i++)
	{
		vec4 splat = texture(mSplatMaps[i], texCoord);
				
		float r = splat.r * splat.a;
		float g = splat.g * splat.a;
		float b = splat.b * splat.a;
		
		splatSum += r;
		splatSum += g;
		splatSum += b;
		
		texColor = mix(texColor, pow(texture(mTerrainTextures[(3 * i) + 1 + 0], texCoord * textureRepeats[(3 * i) + 1 + 0]), gamma), r);
		texColor = mix(texColor, pow(texture(mTerrainTextures[(3 * i) + 1 + 1], texCoord * textureRepeats[(3 * i) + 1 + 1]), gamma), g);
		texColor = mix(texColor, pow(texture(mTerrainTextures[(3 * i) + 1 + 2], texCoord * textureRepeats[(3 * i) + 1 + 2]), gamma), b);
	}
	
    
	texColor = mix(baseTexture, texColor, splatSum);
	fragColor = texColor;
}