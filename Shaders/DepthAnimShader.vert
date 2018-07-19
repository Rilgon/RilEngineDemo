#version 430

#define MAX_BONES 128
#define NUM_SHADOW_MAPS 4

layout(location = 0) in vec3 position;

layout(location = 5) in vec4 bones;
layout(location = 6) in vec4 weights;

layout(std430, binding = 0) readonly buffer BoneBuffer
{
	mat4 boneMatrices[];
};

uniform mat4 worldMatrix;
//uniform mat4 boneMatrices[MAX_BONES];

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main()
{
	mat4 boneMat = boneMatrices[int(bones.x)] * weights.x;
	boneMat += boneMatrices[int(bones.y)] * weights.y;
	boneMat += boneMatrices[int(bones.z)] * weights.z;
	boneMat += boneMatrices[int(bones.w)] * weights.w;
	
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * boneMat * vec4(position, 1.0);
}