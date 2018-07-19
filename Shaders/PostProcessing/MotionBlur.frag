#version 330

in vec2 fragTexCoord;

uniform sampler2D mDepth;
uniform sampler2D mColor;

uniform mat4 currentInvViewProj;
uniform mat4 prevViewProj;

uniform float speed;

out vec4 fragColor;

#define NUM_SAMPLES 9

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

	vec2 texCoord = fragTexCoord;
	
	fragColor = texture(mColor, texCoord);
	for(int i = 1; i < NUM_SAMPLES; i++)
	{
		//the texCoord will offset between fragTexCoord to fragTexCoord + velocity / 2, this will limit artifacts around the borders of the image due to
		//clamp mode, unless the velocity speed is very high, in which case they might appear.
		float percent = float(i) / float(NUM_SAMPLES - 1.0);
		percent -= 0.5;	
		
		texCoord = fragTexCoord + velocity * percent;	
		fragColor += texture(mColor, texCoord);
	}	
	
	fragColor /= NUM_SAMPLES;
}