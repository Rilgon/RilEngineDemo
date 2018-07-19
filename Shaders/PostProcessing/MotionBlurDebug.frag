#version 330

in vec2 fragTexCoord;

uniform sampler2D mDepth;

uniform mat4 currentInvViewProj;
uniform mat4 prevViewProj;

uniform float speed;

out vec4 fragColor;

void main()
{
	//https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch27.html
	
	float depth = texture(mDepth, fragTexCoord).r;	
	
	vec4 ndc = vec4(fragTexCoord.x, fragTexCoord.y, depth, 1.0);
	ndc.xyz *= 2.0;
	ndc.xyz -= 1.0;
	
	vec4 worldPos = currentInvViewProj * ndc;
	worldPos /= worldPos.w;
		
	vec4 prevScreenPos = prevViewProj * worldPos;
	prevScreenPos /= prevScreenPos.w;
	prevScreenPos *= 0.5;
	prevScreenPos += 0.5;
	
	vec2 velocity  = fragTexCoord  - prevScreenPos.xy;
	velocity *= speed;
	
	fragColor = vec4(abs(velocity.x), abs(velocity.y), 0.0, 1.0);
}