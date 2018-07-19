#version 330

#define NUM_SHADOW_MAPS 4

in vec3 worldPosition;
in vec3 worldNormal;
in vec4 shadowTexCoords[NUM_SHADOW_MAPS];
in float clipPositionZ;
in vec4 wvpPosition;

uniform int applyShadows;
uniform sampler2D mShadowMaps[NUM_SHADOW_MAPS];
uniform float shadowClipRanges[NUM_SHADOW_MAPS];
uniform float shadowBias;

out vec4 fragColor;


vec2 poissonDisk[4] = vec2[](
  vec2( -0.94201624, -0.39906216 ),
  vec2( 0.94558609, -0.76890725 ),
  vec2( -0.094184101, -0.92938870 ),
  vec2( 0.34495938, 0.29387760 )
);

vec3 cascadeColors[NUM_SHADOW_MAPS] = vec3[] 
(
	vec3(1.0, 0.0, 0.0),
	vec3(0.0, 1.0, 0.0),
	vec3(0.0, 0.0, 1.0),
	vec3(1.0, 1.0, 0.0)
);

void main()
{
	vec3 normal = normalize(worldNormal);
	
	vec3 diffuse = vec3(max(dot(normal, normalize(vec3(1.0, 1.0, 0.0))), 0.0));
	
	
	vec3 wvpCoord = wvpPosition.xyz / wvpPosition.w;
	wvpCoord += 1.0;
	wvpCoord *= 0.5;	
	
	vec3 color = diffuse;
	int index = 0;
	for(int i = 0; i < NUM_SHADOW_MAPS; i++)
	{
		if(clipPositionZ < shadowClipRanges[i])
		{
			index = i;
			break;
		}
	}
	
	vec3 shadowCoords = shadowTexCoords[index].xyz;
	if(
		shadowCoords.x >= 0.0 && shadowCoords.x <= 1.0 && 
		shadowCoords.y >= 0.0 && shadowCoords.y <= 1.0 && 
		shadowCoords.z >= 0.0 && shadowCoords.z <= 1.0)
	{
		float depth = texture(mShadowMaps[index], shadowCoords.xy).r;
		
		if(depth < shadowCoords.z - shadowBias)
		{
			diffuse *= 0.5;
		}
	}
	
	
	//vec3 shadowCoords = shadowTexCoords[index].xyz / shadowTexCoords[index].w;
	//shadowCoords += 1.0;
	//shadowCoords *= 0.5;
	//shadowCoords.z -= shadowBias;
	//shadowValue = texture(mShadowMaps[index], shadowCoords);
	//shadowValue += 0.4;
	//shadowValue = max(shadowValue, 0.0);

	
	color = mix(diffuse, cascadeColors[index], 0.4);	
	//color *= shadowValue;
	
	fragColor = vec4(color, 1.0);
}
