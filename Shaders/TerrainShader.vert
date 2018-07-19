#version 330

layout(location = 0) in vec4 normal_height;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;

uniform mat4 worldMatrix;
uniform vec4 clipPlane;
uniform int applyClipPlane;

uniform vec2 terrainSize;

out struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

//out float clipDist;

void main()
{
	vec3 position;
	position.y = normal_height.w;

	float vert = float(gl_VertexID);
	float row = floor(vert / terrainSize.x);
	float col = vert - row * terrainSize.x;
	
	position.x = col - terrainSize.x / 2.0;
	position.z = row - terrainSize.y / 2.0;

	vec4 worldPos = worldMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * viewMatrix * worldPos;
	
	fsIn.worldPos = worldPos.xyz;
	fsIn.worldNormal = vec3(worldMatrix * vec4(normal_height.xyz, 0.0));
	fsIn.viewVector = vec3(camPosition - worldPos);
	fsIn.texCoord = vec2(col, row) / vec2(terrainSize.x - 1.0, terrainSize.y - 1.0);
	
	
	
	
	//if(applyClipPlane == 1)
	//{
	//	clipDist = dot(worldPos, clipPlane);
	//}
	//else
	//{
	//	clipDist = 0.0;
	//}
}