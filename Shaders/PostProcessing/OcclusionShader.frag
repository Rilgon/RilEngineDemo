#version 330

#define DEPTH_THRESHOLD 0.0001

uniform sampler2D mDepth;

in vec2 fragTexCoord;

uniform struct Proj
{
	float m33;
	float m43;
	float farPlane;
} proj;

out vec4 fragColor;

float getLinearDepth(vec2 texCoord)
{
	float depth = texture(mDepth, texCoord).r;
	return (proj.m43 / (depth + proj.m33));
}

void main()
{
	float depth =  getLinearDepth(fragTexCoord);
	fragColor = vec4(0.0, 0.0, 0.0, (depth < proj.farPlane - DEPTH_THRESHOLD) ? 0.0 : 1.0);
}