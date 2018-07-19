#version 330

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;
uniform float totalTime;

layout(points) in;
layout (triangle_strip) out;
layout(max_vertices = 16) out;

in float moveSpeed[];

out struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

uniform float drawCutoffDistance;

void main()
{
	mat4 vpMatrix = projectionMatrix * viewMatrix;
	vec4 worldPos = gl_in[0].gl_Position;
	worldPos.w = 0.0;
	
	fsIn.viewVector = vec3(camPosition - worldPos);

	
	vec3 scale = vec3(worldMatrix[0][0], worldMatrix[1][1], worldMatrix[2][2]);
	vec3 halfScale = scale * 0.5;

	float offset = cos(totalTime * moveSpeed[0]) * (scale.x * 0.25); 

	vec4 point0 = worldPos + vec4(-halfScale.x + offset, +scale.y, 0.0, 1.0); //xy plane: top left
	vec4 point1 = worldPos + vec4(-halfScale.x, +0.0, 0.0, 1.0); //xy plane: bottom plane
	vec4 point2 = worldPos + vec4(+halfScale.x + offset, +scale.y, 0.0, 1.0);	 //xy plane: top right
	vec4 point3 = worldPos + vec4(+halfScale.x, +0.0, 0.0, 1.0); //xy plane: bottom right
	vec4 point4 = worldPos + vec4(offset, scale.y, +halfScale.z, 1.0); //yz plane: top front
	vec4 point5 = worldPos + vec4(0.0, 0.0, +halfScale.z, 1.0); //yz plane: bottom front
	vec4 point6 = worldPos + vec4(offset, scale.y, -halfScale.z, 1.0); //yz plane: top back
	vec4 point7 = worldPos + vec4(0.0, 0.0, -halfScale.z, 1.0); //yz plane: bottom back
	
	fsIn.worldNormal = vec3(0.0, 1.0, 0.0);
	
	vec2 uvBottomLeft = vec2(0.0, 0.0);
	vec2 uvTopLeft = vec2(0.0, 1.0);
	vec2 uvBottomRight = vec2(1.0, 0.0);
	vec2 uvTopRight = vec2(1.0, 1.0);
	
	//front side
	gl_Position = vpMatrix * point0;
	fsIn.worldPos = point0.xyz;
	fsIn.texCoord = uvBottomLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point1;
	fsIn.worldPos = point1.xyz;
	fsIn.texCoord = uvTopLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point2;
	fsIn.worldPos = point2.xyz;
	fsIn.texCoord = uvBottomRight;
	EmitVertex();
	
	gl_Position = vpMatrix * point3;
	fsIn.worldPos = point3.xyz;
	fsIn.texCoord = uvTopRight;
	EmitVertex();
	
	EndPrimitive();
	
	//back side
	gl_Position = vpMatrix * point2;
	fsIn.worldPos = point2.xyz;
	fsIn.texCoord = uvBottomLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point3;
	fsIn.worldPos = point3.xyz;
	fsIn.texCoord = uvTopLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point0;
	fsIn.worldPos = point0.xyz;
	fsIn.texCoord = uvBottomRight;
	EmitVertex();
	
	gl_Position = vpMatrix * point1;
	fsIn.worldPos = point1.xyz;
	fsIn.texCoord = uvTopRight;
	EmitVertex();
	
	EndPrimitive();		
	
	//left side
	gl_Position = vpMatrix * point4;
	fsIn.worldPos = point4.xyz;
	fsIn.texCoord = uvBottomLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point5;
	fsIn.worldPos = point5.xyz;
	fsIn.texCoord = uvTopLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point6;
	fsIn.worldPos = point6.xyz;
	fsIn.texCoord = uvBottomRight;
	EmitVertex();

	gl_Position = vpMatrix * point7;
	fsIn.worldPos = point7.xyz;
	fsIn.texCoord = uvTopRight;		
	EmitVertex();
	
	EndPrimitive();
	
	//right side
	gl_Position = vpMatrix * point6;
	fsIn.worldPos = point6.xyz;
	fsIn.texCoord = uvBottomLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point7;
	fsIn.worldPos = point7.xyz;
	fsIn.texCoord = uvTopLeft;
	EmitVertex();
	
	gl_Position = vpMatrix * point4;
	fsIn.worldPos = point4.xyz;
	fsIn.texCoord = uvBottomRight;
	EmitVertex();

	gl_Position = vpMatrix * point5;
	fsIn.worldPos = point5.xyz;
	fsIn.texCoord = uvTopRight;		
	EmitVertex();
	
	EndPrimitive();		
}