#version 330

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord;

uniform vec2 flarePosition;
uniform vec4 flareScaleRot;

out vec2 fragTexCoord;

void main()
{
	vec2 screenPos;
	screenPos.x = position.x * flareScaleRot.x + position.y * flareScaleRot.y;
	screenPos.y = position.x * flareScaleRot.z + position.y * flareScaleRot.w;
	
	screenPos += flarePosition;
	
	gl_Position = vec4(screenPos, 0.0, 1.0);
	fragTexCoord = texCoord;
}