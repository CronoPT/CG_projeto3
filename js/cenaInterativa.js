/*--------------------------------------------------------------------
| Cena Interativa
---------------------------------------------------------------------*/

var camera, scene, renderer, clock;

var upCamera;
var prespCamera;

const SPOTLIGHTS = 4;
var spotLights = [];

var sun;

/*--------------------------------------------------------------------
| Function: init
---------------------------------------------------------------------*/
function init(){
	'use strict';

	clock = new THREE.Clock(true);

	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();

	createPrespCamera();
	createUpCamera();

	camera = prespCamera;

	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
}

/*--------------------------------------------------------------------
| Function: animate - onde toda a magia acontece - todas as 
| atualizações de posições acontecem nesta funcao
---------------------------------------------------------------------*/
function animate(){
	'use strict';

	render();
	requestAnimationFrame(animate);
}

/*--------------------------------------------------------------------
| Function: render
---------------------------------------------------------------------*/
function render(){
	'use strict';
	renderer.render(scene,camera);
}

/*--------------------------------------------------------------------
| Function: createScene
---------------------------------------------------------------------*/
function createScene(){
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxesHelper(210));

	/* Remover no final */
	var g = new THREE.PlaneGeometry(150, 150);
	var m = new THREE.MeshBasicMaterial({color: 0x00aa99, side: THREE.DoubleSide});
	var p = new THREE.Mesh(g, m);
	p.position.set(50, 0, 50);
	scene.add(p);
	p.rotation.x += Math.PI/2;
	/* ====================== */

	createSpotlights(scene);
	createSun(scene);
}

/*--------------------------------------------------------------------
| Function: createSpotlights
---------------------------------------------------------------------*/
function createSpotlights(scene){
	var spotLight;
	spotLight = new StadiumSpotlight(0  , 0, 0  ,  Math.PI);
	spotLights.push(spotLight);
	spotLight = new StadiumSpotlight(100, 0, 0  ,  Math.PI/2);
	spotLights.push(spotLight);
	spotLight = new StadiumSpotlight(0  , 0, 100, -Math.PI/2);
	spotLights.push(spotLight);
	spotLight = new StadiumSpotlight(100, 0, 100,  0);
	spotLights.push(spotLight);

	for(var i = 0; i < SPOTLIGHTS; i++){
		scene.add(spotLights[i]);
	}
}

/*--------------------------------------------------------------------
| Function: createSun
---------------------------------------------------------------------*/
function createSun(scene){
	sun = new THREE.DirectionalLight(0xffffff, 0.5);
	sun.position.set(1, 1, 0);

	scene.add(sun);
}

/*--------------------------------------------------------------------
| Function: onResize - called when the window is resized, makes
| sure the scene has the same aspect ratio as the window
---------------------------------------------------------------------*/
function onResize(){
	'use strict';

	renderer.setSize(window.innerWidth, window.innerHeight);

	updatePerspectiveCamera(prespCamera);
	updateOrthographicCamera(upCamera);
}

/*--------------------------------------------------------------------
| Function: updatePerspectiveCamera
---------------------------------------------------------------------*/
function updatePerspectiveCamera(camera){
	'use strict';

	if(window.innerHeight>0 && window.innerWidth>0){
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}
}	

/*--------------------------------------------------------------------
| Function: updateOrthographicCamera
---------------------------------------------------------------------*/
function updateOrthographicCamera(camera){
	'use strict';

	var viewHeight = 300;
	var aspect = window.innerWidth / window.innerHeight;

	if(window.innerHeight>0 && window.innerWidth>0){
		camera.left   =  aspect*viewHeight/2;
		camera.right  = -aspect*viewHeight/2;
		camera.top    = -viewHeight/2;
		camera.bottom =  viewHeight/2;

		camera.updateProjectionMatrix();
	}
}	

/*--------------------------------------------------------------------
| CAMERAS
---------------------------------------------------------------------*/
function createPrespCamera(){
	'use strict';
	prespCamera = new THREE.PerspectiveCamera(80,
											  window.innerWidth / window.innerHeight,
											  1,1000);

	prespCamera.position.set(200, 200, 200);
	prespCamera.lookAt(50, 50, 50);
}

function createUpCamera(){
	'use strict';

	var viewHeight  = 300;
	var aspectratio = window.innerWidth / window.innerHeight;

	upCamera = new THREE.OrthographicCamera(aspectratio*viewHeight/2,
										   -aspectratio*viewHeight/2,
										   -viewHeight/2,
	   									    viewHeight/2,
	   									   -1000, 1000);
	
	upCamera.position.set(50, 200, 50);
	upCamera.lookAt(50, 50, 50);
}

/*--------------------------------------------------------------------
| PRESS KEYS
---------------------------------------------------------------------*/
function onKeyDown(e){
	'use strict';

	switch(e.keyCode){
		case 49: //1
			spotLights[0].light.visible = !spotLights[0].light.visible;
			break;

		case 50: //2
			spotLights[1].light.visible = !spotLights[1].light.visible;
			break;

		case 51: //3
			spotLights[2].light.visible = !spotLights[2].light.visible;
			break;

		case 52: //4
			spotLights[3].light.visible = !spotLights[3].light.visible;
			break;

		case 78: //n
			sun.visible = !sun.visible;
			break;
	
		case 65://A
		case 97://a
			scene.traverse(function(node){
				if(node instanceof THREE.Mesh){
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
	}
}
