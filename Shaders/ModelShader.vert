#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;
layout(location = 3) in vec3 tangent;
layout(location = 4) in float meshID;


#define NUM_SHADOW_MAPS 4


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;
		
uniform mat4 worldMatrix;
uniform int applyClipPlane;
uniform vec4 clipPlane;

out struct FS_In
{
	mat3 TBN;
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

flat out int meshId;

out float gl_ClipDistance[1];

void main()
{
	vec4 worldPos = worldMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * viewMatrix * worldPos;
	
	vec4 viewPos = viewMatrix * worldPos;
	
	fsIn.worldPos = worldPos.xyz;
	fsIn.worldNormal = vec3(worldMatrix * vec4(normal, 0.0));
	fsIn.viewVector = vec3(camPosition - worldPos);
	fsIn.texCoord = vec2(texCoord.x, 1.0 - texCoord.y);
	meshId = int(meshID);
	
	vec3 biTangent = cross(tangent, normal);	
		
	fsIn.TBN = mat3
	(	
		vec3(worldMatrix * vec4(tangent, 0.0)),
		vec3(worldMatrix * vec4(biTangent, 0.0)),
		vec3(worldMatrix * vec4(normal, 0.0))
	);
	
	if(applyClipPlane == 1)
	{
		gl_ClipDistance[0] = dot(worldPos, clipPlane);
	}
	else
	{
		gl_ClipDistance[0] = 0.0;
	}
}