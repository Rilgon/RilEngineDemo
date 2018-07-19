#version 330

layout(location = 0) in vec2 position;

uniform mat4 worldMatrix;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;

uniform sampler2D mDisplacementMap;


uniform sampler2D mTerrainHeightmap;

uniform struct TerrainInfo
{
	mat4 world;
	mat4 invWorld;
	vec2 size;
} terrain;

uniform struct Material
{
    vec3 sunDirection;
    vec3 specColor;
    float specPower;

    vec3 waterColor;
	float offsetUvScale;

    float shoreScale;
	
    float fresnelPower;
	
	float displacementRepeat;
	float foamHeight;
	float baseUvScale;
} material;

out struct FS_In
{
	vec4 projTexCoord;
	vec3 worldPos;
	vec3 viewVector;
	vec2 texCoord;
	vec2 displacementCoord;
	float height;	
	float distToBottom;
} fsIn;

void main()
{
	vec4 worldPos = worldMatrix * vec4(position.x, 0.0, position.y, 1.0);
	vec2 displacementCoord = worldPos.xz * material.displacementRepeat;
	vec4 displacement = vec4(texture(mDisplacementMap, displacementCoord).xyz, 0.0);
	
	vec4 terrainPos = terrain.invWorld * worldPos;
	terrainPos.x += terrain.size.x * 0.5;
	terrainPos.z += terrain.size.y * 0.5;
	vec2 terrainCoord = terrainPos.xz / (terrain.size - 1.0);
	
	vec4 heightSample = texture(mTerrainHeightmap, terrainCoord);
	float sign = heightSample.z * 2.0 - 1.0;
	float terrainHeight = (heightSample.x * 255.0 + heightSample.y) * sign;	
	terrainHeight = (terrain.world * vec4(0, terrainHeight, 0, 1) ).y;
	
	float distToBottom = (worldPos.y - terrainHeight);
	//distToBottom /=  material.shoreScale;
	distToBottom = 1.0 - exp(-distToBottom * material.shoreScale);
	distToBottom = max(min(distToBottom, 1.0), 0.0);
	
	displacement.y *= distToBottom; //points closer to shore should not have large waves
		
	worldPos = worldPos + displacement;
	gl_Position = projectionMatrix * viewMatrix * worldPos;
	
	fsIn.projTexCoord = gl_Position;
	fsIn.worldPos = worldPos.xyz;
	fsIn.viewVector = (camPosition - worldPos).xyz;
	fsIn.texCoord = position.xy / material.baseUvScale;
	fsIn.displacementCoord = displacementCoord;
	fsIn.height = max(displacement.y, 0.0);
	fsIn.distToBottom = distToBottom;
	//fsIn.distToCamera = length(camPosition - vec4(worldPos.x, terrainHeight, worldPos.z, 1.0));
}