#version 330

in float life[];

layout(points) in;
layout(max_vertices = 4, triangle_strip) out;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;

uniform mat4 worldMatrix;

uniform float particleBaseSize;

out vec2 texCoord;
out float fragLife;
out vec3 viewVector;

void main()
{
	//v0, v1, v2, then v2, v1, v3
	
	vec4 basePos = gl_in[0].gl_Position;
	basePos.w = 0.0; //basePos is summed into another position vec4, don't want its w to change
	float fireLife = gl_in[0].gl_Position.w;
	float fireScale = (1.0 - fireLife) * particleBaseSize;
	vec4 pos;
	
	//Compute the vpMatrix here to prevent unneccessary computations
	mat4 vpMatrix = projectionMatrix * viewMatrix;
	
	//The particle quad must always be facing the camera, so extract the rotation of the camera from the view matrix(assuming these is no scaling)
	//by removing the translation and using the inverse rule for a rotation matrix that states its inverse is its transpose.
	mat4 camRot = viewMatrix;
	camRot[3] = vec4(0.0, 0.0, 0.0, 1.0);
	camRot = transpose(camRot);
	
	pos = vec4(+fireScale, -fireScale, 0.0, 1.0);
	pos = camRot * pos;
	pos += basePos;
	pos = worldMatrix * pos;	
	gl_Position = vpMatrix * pos;
	texCoord = vec2(1.0, 1.0);
	fragLife = fireLife;
	viewVector = vec3(camPosition - pos);
	EmitVertex();
	
	pos = vec4(+fireScale, +fireScale, 0.0, 1.0);
	pos = camRot * pos;
	pos += basePos;
	pos = worldMatrix * pos;	
	gl_Position = vpMatrix * pos;
	texCoord = vec2(1.0, 0.0);
	fragLife = fireLife;
	viewVector = vec3(camPosition - pos);
	EmitVertex();
	
	pos = vec4(-fireScale, -fireScale, 0.0, 1.0);
	pos = camRot * pos;
	pos += basePos;
	pos = worldMatrix * pos;	
	gl_Position = vpMatrix * pos;
	texCoord = vec2(0.0, 1.0);
	fragLife = fireLife;
	viewVector = vec3(camPosition - pos);
	EmitVertex();
	
	pos = vec4(-fireScale, +fireScale, 0.0, 1.0);
	pos = camRot * pos;
	pos += basePos;
	pos = worldMatrix * pos;	
	gl_Position = vpMatrix * pos;
	texCoord = vec2(0.0, 0.0);
	fragLife = fireLife;
	viewVector = vec3(camPosition - pos);
	EmitVertex();
	
	EndPrimitive();
}