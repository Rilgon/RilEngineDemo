#version 330

in vec2 fragTexCoord;
in vec3 worldPosition;
in vec3 worldNormal;
in vec4 projTexCoord;

uniform sampler2D mWaterMap;
uniform sampler2D mRefractiveTexture;

uniform float totalTime;
uniform float rippleSpeed;
uniform float textureRepeat;
uniform float waveExponent;
uniform vec3 waterColor;
uniform vec3 highlightColor;
uniform float specularExponent;
uniform float minOpacity;
uniform float distortSpeed;

//GOOD DEFAULTS(using default textures):
//rippleSpeed = 0.03;
//offsetScale = 0.01;
//scrollSpeed = 0.05
//waterColor = vec3(0.2856, 0.7568, 0.84)
//specularExponent = 16.0
//lightDirection = vec3(-1.0, 1.0, 1.0)
//highlightColor = vec3(0.8, 0.8, 0.8)
//highlightScale = 0.2
//minOpacity = 0.5


uniform vec4 camPosition;

uniform struct DirectionalLight
{
	vec3 diffuse;
	vec3 specular;
	vec3 direction;	
} dirLight;
	


uniform struct Fog
{
	vec3 color;
	vec2 params;
} fog;



out vec4 fragColor;

void main()
{
	//repeat the input uv 
	vec2 fragRepeat = fragTexCoord * textureRepeat;

	//two random uv to be sampled
	vec2 d0 = vec2(fragRepeat.x + totalTime * rippleSpeed, fragRepeat.y);
	vec2 d1 = vec2(fragRepeat.x, 1.0 - (fragRepeat.y + totalTime * rippleSpeed));
	
	//two random normals sampled
	vec3 n0 = texture(mWaterMap, d0).rgb;
	vec3 n1 = texture(mWaterMap, d1).rgb;
	
	//move normals from 0-1 to -1-1
	n0 *= 2.0;
	n0 -= 1.0;
	
	n1 *= 2.0;
	n1 -= 1.0;
	

	vec2 offset = n0.xy + n1.yz;
	offset *= distortSpeed;
	
	vec2 offsetUV = fragTexCoord + offset;
	
	vec3 n2 = texture(mWaterMap, offsetUV).rgb * 2.0 - 1.0;
	float d = n2.x + n2.y + n2.z;
	d *= 0.3333;
	d = max(d, 0.0);
	d = pow(d, waveExponent);
	vec3 mixedCol = mix(waterColor, highlightColor, d).rgb;
	
	
	vec2 proj = projTexCoord.xy / projTexCoord.w;
	proj += 1.0;
	proj *= 0.5;
	proj.x = clamp(proj.x, 0.0, 1.0);
	proj.y = clamp(proj.y, 0.0, 1.0);
	vec3 refraction = texture(mRefractiveTexture, proj + offset).rgb;

	vec3 V = (camPosition.xyz - worldPosition);
	float D = length(V);
	V /= D;
	vec3 L = normalize(dirLight.direction);
	vec3 N = normalize(worldNormal);
	
	vec3 H = normalize(V + L + vec3(n2.x, n2.y, 0.0));
	float spec = pow(max(dot(H, N), 0.0), specularExponent);
	vec3 specColor = vec3(spec);
	
	float fresnel = max(dot(V, N), 0.0);
	float opacity = 1.0 - fresnel;
	opacity = max(opacity, minOpacity);
	
	fragColor = vec4(mix(mixedCol + specColor, refraction, 1.0 - opacity), 1.0);
	
	//fragColor.rgb = refraction;
	//fragColor = vec4(mixedCol, 1.0);
}