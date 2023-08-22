export default /* glsl */`
#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>

#if defined(USE_COLOR_ALPHA)
varying vec4 vColor;
#elif defined(USE_COLOR)
varying vec3 vColor;
#endif

#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
// #include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying float varNum;

uniform float fresnelBias;
uniform float fresnelScale;
uniform float fresnelPower;
uniform vec3 reflectionColor;

uniform float stateMode;
uniform float emptyPatternSize;

vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {

	vec4 diffuseColor = vec4(diffuse, opacity);

	// // if (state < 1.1 && state > 0.9) //1 - White state
	// diffuseColor = vec4(vec3(0.8), opacity);
	// else if (state > -3.1 && state < -2.9) //-3 - Inactive state
	// {
	// 	if (stateMode < 1.0)
	// 	diffuseColor = vec4(vec3(1.0), 0.1);
	// 	else discard;
	// }
	// // else if (state < 2.1 && state > 1.9) //2 - Transparent state
	// diffuseColor = vec4(diffuse, opacity / 3.0);
	// else if (isEmpty > 0.0 || state > -2.1 && state < -1.9) //-2 - Empty state
	// {
	// 	vec3 hsv = rgb2hsv(diffuse);
	// 	hsv.y = 0.0;
	// 	hsv.z = clamp(hsv.z * 2.0, 0.0, 1.0);
	// 	diffuseColor = vec4(hsv2rgb(hsv), opacity);
	// }

	ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
	vec3 totalEmissiveRadiance = emissive;

	#include <map_fragment>

	#if defined(USE_COLOR_ALPHA)
    diffuseColor *= vColor;
	#elif defined(USE_COLOR)
    diffuseColor.rgb *= vColor;
	#endif

    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    #include <emissivemap_fragment>

    #include <lights_fragment_maps>
	#include <lights_fragment_end>

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

	// //fresnel effect
	// float rim = 1.0 - dot(normalize(vViewPosition), normal);
	// float reflectionFactor = fresnelBias + fresnelScale * pow(rim, fresnelPower);
	// outgoingLight = mix(outgoingLight, reflectionColor, vec3(clamp(reflectionFactor, 0.0, 1.0)));
	// //outgoingLight = vec3(reflectionFactor);

	//#include <envmap_fragment>

	// if (isEmpty > 0.0 || state > -2.1 && state < -1.9) {
	// 	//		vec2 p = vec2(floor(gl_FragCoord.x), floor(gl_FragCoord.y));
	// 	//
	// 	//		if (mod(p.y + p.x, 6.0) == 0.0 || mod(p.y + p.x, 4.0) == 0.0 || mod(p.y + p.x, 8.0) == 0.0)
	// 	//		gl_FragColor = vec4(0, 0, 0, 1.0);
	// 	//		else
	// 	//		gl_FragColor = vec4(outgoingLight, 1.0);

	// 	vec2 uv = gl_FragCoord.xy * (1.0 / emptyPatternSize);

	// 	uv.y += -uv.x;

	// 	// Time varying pixel color
	// 	float colx = clamp(0.5 + 10.0 * cos(uv.y), 0.0, 1.0);

	// 	// Output to screen
	// 	gl_FragColor = vec4(mix(outgoingLight, outgoingLight * 0.8, colx), diffuseColor.a);
	// } else

	// gl_FragColor = vec4(outgoingLight, diffuseColor.a);

	gl_FragColor = diffuseColor;

	if( varNum == 1.0 ){
		gl_FragColor = vec4(0.7, 0.0, 0.0, 0.4);
	}


	#include <tonemapping_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
}
`