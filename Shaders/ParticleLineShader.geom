#version 330

layout (points) in;
layout(line_strip) out;
layout (max_vertices = 2) out;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;

uniform int scalesWithLife = 0;
uniform float particleHeight = 0.01;

out float fragLife;

void main()
{
	vec4 p = gl_in[0].gl_Position;
	
	float percentLife = p.w * scalesWithLife;
	
	mat4 localTrans = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		p.x, p.y, p.z, 1.0);
	
	
	float scale = (particleHeight * (1.0 - percentLife));
	fragLife = scalesWithLife == 1.0 ? percentLife : 1.0;
	
	vec4 v0 = vec4(0.0, -scale, 0.0, 1.0);
	vec4 v1 = vec4(0.0, +scale, 0.0, 1.0);
	
	mat4 trans = projectionMatrix * viewMatrix * worldMatrix * localTrans;
		
	gl_Position = trans * v0;
	EmitVertex();
	
	gl_Position = trans * v1;
	EmitVertex();
	
	EndPrimitive();
}