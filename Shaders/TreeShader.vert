#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;
layout(location = 3) in vec3 tangent;

layout(location = 5) in vec4 direction_speed;
layout(location = 6) in vec4 texOffset_isLeaf;


uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec4 camPosition;

uniform mat4 worldMatrix;
uniform float totalTime;

uniform int applyClipPlane;
uniform vec4 clipPlane;

out struct FS_In
{
	vec3 worldPos;
	vec3 worldNormal;
	vec3 viewVector;
	vec2 texCoord;
} fsIn;

flat out int textureIndex;

out float gl_ClipDistance[1];

void main()
{	
	vec3 offsetPos;
	offsetPos.x = cos(totalTime * direction_speed.x) * direction_speed.w;
	offsetPos.y = cos(totalTime * direction_speed.y) * direction_speed.w;
	offsetPos.z = cos(totalTime * direction_speed.z) * direction_speed.w;
	offsetPos *= texOffset_isLeaf.x;
	offsetPos *= texOffset_isLeaf.y;
	
	mat4 world = worldMatrix * mat4(vec4(1, 0, 0, 0), vec4(0, 1, 0, 0), vec4(0, 0, 1, 0), vec4(offsetPos, 1.0));
	vec4 worldPos = world * vec4(position, 1.0);
	
	if(applyClipPlane == 1)
	{
		gl_ClipDistance[0] = dot(worldPos, clipPlane);
	}
	else
	{
		gl_ClipDistance[0] = 0;
	}
	
	gl_Position = projectionMatrix * viewMatrix * worldPos;
	
	fsIn.worldPos = worldPos.xyz;
	fsIn.worldNormal = vec3(world * vec4(normal, 0.0));
	fsIn.viewVector = (camPosition - worldPos).xyz;
	fsIn.texCoord = texCoord;
	
	textureIndex = int(texOffset_isLeaf.y);
}