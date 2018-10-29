/*--------------------------------------------------------------------
| Cena Interativa
---------------------------------------------------------------------*/

var camera, scene, renderer, clock;

var upCamera;
var prespCamera;

var spotLight1;
var spotLight2;
var spotLight3;
var spotLight4;

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

	renderer.render(scene, camera);
}

/*--------------------------------------------------------------------
| Function: createScene
---------------------------------------------------------------------*/
function createScene(){
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxesHelper(210));

	spotLight1 = new StadiumSpotlight(0  , 0, 0  , new THREE.Vector3(50, 0, 50) );
	spotLight2 = new StadiumSpotlight(100, 0, 0  , new THREE.Vector3(50, 0, 50) );
	spotLight3 = new StadiumSpotlight(0  , 0, 100, new THREE.Vector3(50, 0, 50) );
	spotLight4 = new StadiumSpotlight(100, 0, 100, new THREE.Vector3(50, 0, 50) );

	scene.add(spotLight1);
	scene.add(spotLight2);
	scene.add(spotLight3);
	scene.add(spotLight4);
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

	prespCamera.position.set(300, 300, 300);
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
			camera = upCamera;
			break;

		case 50: //2
			camera = prespCamera;
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
