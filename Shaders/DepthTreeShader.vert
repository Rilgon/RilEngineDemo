#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;
layout(location = 3) in vec3 tangent;

layout(location = 5) in vec4 direction_speed;
layout(location = 6) in vec4 texOffset_isLeaf;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 worldMatrix;
uniform float totalTime;

out vec2 fragTexCoord;
flat out int textureIndex;

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
	gl_Position = projectionMatrix * viewMatrix * worldPos;
	
	fragTexCoord = texCoord;
	textureIndex = int(texOffset_isLeaf.y);
}