#version 330

uniform sampler2D mFlare;
uniform sampler2D mSunVisibility;
uniform vec4 flareColor;

uniform float maxVisibility;
uniform vec4 gamma;
uniform float intensity;

in vec2 fragTexCoord;

out vec4 fragColor;

const vec2 offsets[4] = vec2[4]
(
	vec2(0.00, 0.00),
	vec2(0.50, 0.00),
	vec2(0.50, 0.50),
	vec2(0.00, 0.50)
);

void main()
{
	fragColor = pow(texture(mFlare, fragTexCoord), gamma);
	fragColor *= flareColor;
	fragColor.rgb *= intensity;
	
	float intensity = 0.0;
	
	for(int i = 0; i < 4; i++)
	{
		vec4 vis = texture(mSunVisibility, offsets[i]);
		float avg = dot(vis, vec4(1)) * 0.25;
		intensity += avg;
	}
	
	intensity /= maxVisibility;
	intensity = min(intensity, 1.0);
	fragColor *= intensity;
	
	//if(intensity > 0.9)
	//{
	//	fragColor = vec4(0, 1, 0, 1);
	//}
	//else
	//{
	//	fragColor = vec4(0, 0, 1, 1);
	//}
	//
	//fragColor = vec4(intensity);
	
}