#version 330

in struct FS_In
{
	vec4 projTexCoord;
	vec3 worldPos;
	vec3 viewVector;
	vec2 texCoord;
	vec2 displacementCoord;
	float height;
	float distToBottom;
} fsIn;

uniform mat4 projectionMatrix;

uniform sampler2D mNormalMap;
uniform sampler2D mFoam;
uniform samplerCube mSky;
uniform sampler2D mRefractiveTexture;
uniform sampler2D mDepthTexture;

uniform struct Material
{
    vec3 sunDirection;
    vec3 specColor;
    float specPower;

    vec3 waterColor;
	float offsetUvScale;

    float shoreScale;
	
    float fresnelPower;
	
	float displacementRepeat;
	float foamHeight;
	float baseUvScale;
} material;


uniform vec4 camPosition;

uniform struct DirectionalLight
{
	vec3 diffuse;
	vec3 specular;
	vec3 direction;	
} dirLight;

uniform vec4 gamma;

out vec4 fragColor;

void main()
{
	vec3 view = normalize(fsIn.viewVector);
	vec3 normal = normalize(texture(mNormalMap, fsIn.displacementCoord).rgb * 2.0 - 1.0);
	
	vec3 sunNorm = normalize(material.sunDirection);
	float spec = max(dot(view, reflect(-sunNorm, normal)), 0.0);
	spec = pow(spec, material.specPower);
	vec3 specColor = spec * material.specColor;
	
		
	vec2 projUv = (fsIn.projTexCoord.xy / fsIn.projTexCoord.w) * 0.5 + 0.5;
	float distToBottom = fsIn.distToBottom;
	
	vec3 diffuseColor = vec3(max(dot(normal, dirLight.direction), 0.1));
	diffuseColor *= material.waterColor;
	
	vec3 offsetNormal = normal;
	offsetNormal.x *= material.offsetUvScale;
	offsetNormal.z *= material.offsetUvScale;
	offsetNormal = normalize(offsetNormal);	
	
	vec3 reflectiveColor = pow(texture(mSky, reflect(-view, offsetNormal)), gamma).rgb;	
	vec3 refractiveColor = texture(mRefractiveTexture, projUv + offsetNormal.xz).rgb;
	
	float dotV_N = max(dot(view, normal), 0.0);
	float fresnel =  pow(dotV_N, material.fresnelPower);

	vec3 waterColor = mix(refractiveColor, reflectiveColor * diffuseColor, distToBottom);
	
	vec3 foamColor = texture(mFoam, fsIn.texCoord).rgb;
	float foamValue = fsIn.height / material.foamHeight;
	waterColor += foamColor * foamValue;
	
	fragColor.rgb = mix(waterColor, refractiveColor, fresnel) + specColor;
	fragColor.a = 1.0;

	//fragColor.rgb = foamColor;
	//fragColor.rgb = specColor;
	//fragColor.rgb = skyColor;	
	//fragColor.rgb = refractiveColor;
}