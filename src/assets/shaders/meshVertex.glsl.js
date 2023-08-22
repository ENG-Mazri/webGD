export default /* glsl */`

#define PHONG
varying vec3 vViewPosition;
#include <common>

#if defined( USE_COLOR_ALPHA )
varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
varying vec3 vColor;
#endif



attribute float _varnum;

varying float varNum;

void main() {

	varNum = _varnum;

	#include <uv_vertex>
	#include <color_vertex>	
	#include <beginnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>	
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`