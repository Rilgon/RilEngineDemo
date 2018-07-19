#version 330

uniform sampler2D mSunOcclusion;

in vec2 fragTexCoord;

out vec4 fragColor;

uniform vec2 sunPosition;

#define NUM_SAMPLES 80

uniform float density;
uniform float weight;
uniform float decay;
uniform float exposure;

void main()
{
	vec2 texCoord = fragTexCoord;
	
	// Calculate vector from pixel to light source in screen space.
	vec2 deltaTexCoord = (texCoord - sunPosition);
	
	// Divide by number of samples and scale by control factor.
	deltaTexCoord *= 1.0f / NUM_SAMPLES * density;
	
	vec3 color = texture(mSunOcclusion, texCoord).rgb;
	
	// Set up illumination decay factor.
	float illuminationDecay = 1.0f;
	
	for (int i = 0; i < NUM_SAMPLES; i++)
	{
		// Step sample location along ray.
		texCoord -= deltaTexCoord;
		

		vec3 sample = texture(mSunOcclusion, texCoord).rgb;
		// Apply sample attenuation scale/decay factors.
		sample *= illuminationDecay * weight;
		
		color += sample;
		
		// Update exponential decay factor.
		illuminationDecay *= decay;
	}
	
	fragColor = vec4( color * exposure, 1);
	
	//fragColor = texture(mColor, fragTexCoord);
}