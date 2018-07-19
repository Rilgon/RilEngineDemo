#version 430


layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;
layout(location = 4) in float meshID;

layout(location = 5) in vec4 bones;
layout(location = 6) in vec4 weights;

uniform mat4 worldMatrix;
//uniform mat4 boneMatrices[MAX_BONES];

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;

layout(std430, binding = 0) buffer BoneBuffer
{
	mat4 boneMatrices[];
};

out struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

flat out int meshId;

//out float gl_ClipDistance[1];

void main()
{
	mat4 boneMat = boneMatrices[int(bones.x)] * weights.x;
	boneMat += boneMatrices[int(bones.y)] * weights.y;
	boneMat += boneMatrices[int(bones.z)] * weights.z;
	boneMat += boneMatrices[int(bones.w)] * weights.w;
	
	mat4 world = worldMatrix *  boneMat;
	vec4 worldPos = world *  vec4(position, 1.0);
	
	gl_Position = projectionMatrix * viewMatrix * worldPos;
	fsIn.worldPos = vec3(worldPos);
	fsIn.worldNormal = vec3(world * vec4(normal, 0.0));
	fsIn.viewVector = vec3(camPosition - worldPos);
	fsIn.texCoord = vec2(texCoord.x, 1.0 - texCoord.y);
	meshId = int(meshID);
}