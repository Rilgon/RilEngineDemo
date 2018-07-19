#version 330

#define PI 3.14159

layout (points) in;
layout (triangle_strip) out;
layout (max_vertices = 4) out;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform mat4 scaleMatrix;
uniform float falloffSize;

out struct FS_Input
{
	vec2 texCoord;
	float particleLife;
	float opacity;
} fsInput;


uniform struct Material
{
	vec3 startColor;
	vec3 endColor;
	float discardOpacity;
	int fadeWithLife;
	float fadeFactor;
	float startOpacity;
	float endOpacity;
	float size;
} material;

void main()
{
	mat4 camRot = viewMatrix;
	camRot[3] = vec4(0.0, 0.0, 0.0, 1.0);
	camRot = transpose(camRot);
	
	vec4 p = gl_in[0].gl_Position;
	
	float percentLife = p.w;
	
	
	vec4 pRot = 
	//otationMatrix *
		vec4(p.xyz, 1.0);
	
	mat4 localTrans = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		pRot.x, pRot.y, pRot.z, 1.0);
		
	vec4 base = worldMatrix * vec4(p.xyz, 1.0);

	fsInput.particleLife = percentLife;
	fsInput.opacity = 1.0;
		
	float scale = 1.0;
	if(material.fadeWithLife == 1)
	{
		scale *= mix(1.0 - percentLife, percentLife, material.fadeFactor);	
		scale = sin(scale * PI);
		scale *= falloffSize;
		
		float opacityFactor = mix(percentLife, 1.0 - percentLife, 1.0 - material.fadeFactor);
		fsInput.opacity = mix(material.endOpacity, material.startOpacity, opacityFactor);
	}
	
	vec4 v0 = camRot * scaleMatrix * vec4(+scale, -scale, 0.0, 1.0)  + vec4(base.xyz, 0.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	vec4 v1 = camRot * scaleMatrix * vec4(+scale, +scale, 0.0, 1.0)  + vec4(base.xyz, 0.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	vec4 v2 = camRot * scaleMatrix * vec4(-scale, -scale, 0.0, 1.0)  + vec4(base.xyz, 0.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	vec4 v3 = camRot * scaleMatrix * vec4(-scale, +scale, 0.0, 1.0)  + vec4(base.xyz, 0.0);// - vec4(0.0, -0.5, 0.0, 0.0);
	
	vec2 texCoord0 = vec2(1.0, 1.0);
	vec2 texCoord1 = vec2(1.0, 0.0);
	vec2 texCoord2 = vec2(0.0, 1.0);
	vec2 texCoord3 = vec2(0.0, 0.0);
	
	mat4 trans = projectionMatrix * viewMatrix;
		
	//0-1-2 then 2-1-3
		
	gl_Position = trans * v0;
	fsInput.texCoord = texCoord0;
	EmitVertex();
	
	gl_Position = trans * v1;
	fsInput.texCoord = texCoord1;
	EmitVertex();
	
	gl_Position = trans * v2;
	fsInput.texCoord = texCoord2;
	EmitVertex();
    
	gl_Position = trans * v3;
	fsInput.texCoord = texCoord3;
	EmitVertex();
	
	EndPrimitive();
}