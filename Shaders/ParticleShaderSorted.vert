#version 430

struct Particle
{
	vec4 position_startLife;
	vec4 direction_currLife;
};

struct SortData
{
	uint index;
	float distance;
};

struct DrawArraysIndirectCommand 
{
	uint  count;
	uint  instanceCount;
	uint  first;
	uint  baseInstance;
};

layout(std430, binding = 0) buffer ParticleInput
{
	DrawArraysIndirectCommand activeCommand;
	Particle pinput[];
};

layout(std430, binding = 1) buffer SortBuffer
{
	SortData sortData[];
};

layout(location = 0) in vec4 pos_life;

out float distance;

void main()
{
	SortData sort = sortData[gl_VertexID];
	
	Particle p = pinput[gl_VertexID];

	gl_Position.xyz = p.position_startLife.xyz;
	gl_Position.w = p.direction_currLife.w / p.position_startLife.w;
	
	distance = sqrt(sort.distance);

}