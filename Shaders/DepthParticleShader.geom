#version 330

layout (points) in;
layout (triangle_strip) out;
layout (max_vertices = 4) out;

in float distance[];

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;

uniform struct RenderInfo
{
	float scale;
	int scaleWithLife;
	float inverseScaleFactor;
	
	int fadeWithLife;
	float inverseFadeFactor;
	
	float startOpacity;
	float endOpacity;
} renderInfo;


void main()
{
	mat4 camRot = viewMatrix;
	camRot[3] = vec4(0.0, 0.0, 0.0, 1.0);
	camRot = transpose(camRot);
	
	vec4 p = gl_in[0].gl_Position;
	
	float percentLife = p.w;
	
	mat4 localTrans = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		p.x, p.y, p.z, 1.0);

		
	float scale =  renderInfo.scale;
	if(renderInfo.scaleWithLife == 1)
	{
		scale *= mix(1.0 - percentLife, percentLife, renderInfo.inverseScaleFactor);	
	}

	//TODO?
	if(renderInfo.fadeWithLife == 1)
	{
		float opacityFactor = mix(percentLife, 1.0 - percentLife, renderInfo.inverseFadeFactor);
		scale *= mix(renderInfo.endOpacity, renderInfo.startOpacity, opacityFactor);
	}
	
	vec4 v0 = vec4(+scale, -scale, 0.0, 1.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	vec4 v1 = vec4(+scale, +scale, 0.0, 1.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	vec4 v2 = vec4(-scale, -scale, 0.0, 1.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	vec4 v3 = vec4(-scale, +scale, 0.0, 1.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	
	mat4 trans = projectionMatrix * viewMatrix * worldMatrix * localTrans * camRot;
		
	//0-1-2 then 2-1-3
		
	gl_Position = trans * v0;
	EmitVertex();
	
	gl_Position = trans * v1;
	EmitVertex();
	
	gl_Position = trans * v2;
	EmitVertex();
    
	gl_Position = trans * v3;
	EmitVertex();
	
	EndPrimitive();
}