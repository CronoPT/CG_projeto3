


/*--------------------------------------------------------------------
| Cena Interativa
---------------------------------------------------------------------*/

var camera, scene, renderer, clock;

var upCamera;
var prespCamera;

const SPOTLIGHTS = 4;
var spotLights = [];

var sun;
var plane;
var airplane;

var threshold = 200; // Lamp Square Side Size && Camera


var planeRotateY = 0;
var rotateY = 0; 
var angularVelY = 0;
var rotateYleft = 0;
var rotateYRight = 0;
var rotateUp = 0;
var rotateDown = 0;
var angularVelVert = 0;

const angularVIncrement = Math.PI/2; 
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

	createPrespCamera(threshold);
	// createUpCamera(200);

	camera = prespCamera;
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
}

/*--------------------------------------------------------------------
| Function: animate - onde toda a magia acontece - todas as 
| atualizações de posições acontecem nesta funcao
---------------------------------------------------------------------*/
function animate(){
	'use strict';
	var delta = clock.getDelta();
	rotatePlane(delta);
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
	
   /* ======================= */
	createSpotlights(scene, threshold);
	createPlane(scene, 130);
	createSun(scene);
}

/*--------------------------------------------------------------------
| Function: createPlane
---------------------------------------------------------------------*/
function createPlane(scene, lengthThreshold){
	airplane = new Airplane(lengthThreshold*0.5,lengthThreshold, 
								lengthThreshold*0.4, 0.1);

	plane = new THREE.Object3D();
	plane.add(airplane);
	
	airplane.position.x -= airplane.bodyWidth/2;
	airplane.position.y -= airplane.bodyHeight/(5/2);
	airplane.position.z -= airplane.length/2;
	
	scene.add(plane);
	
	plane.position.x += lengthThreshold*0.8;
	plane.position.y += airplane.bodyHeight/(5/2);
	plane.position.z += lengthThreshold*0.8;
}


/*--------------------------------------------------------------------
| Function: createSpotlights
---------------------------------------------------------------------*/
function createSpotlights(scene, threshold){
	var spotLight;
	spotLight = new StadiumSpotlight(0  , 0, 0  ,  Math.PI);
	spotLights.push(spotLight);
	spotLight = new StadiumSpotlight(threshold, 0, 0  ,  Math.PI/2);
	spotLights.push(spotLight);
	spotLight = new StadiumSpotlight(0  , 0, threshold, -Math.PI/2);
	spotLights.push(spotLight);
	spotLight = new StadiumSpotlight(threshold, 0, threshold,  0);
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
	sun.position.set(1, 1, 1);

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
function createPrespCamera(threshold){
	'use strict';
	prespCamera = new THREE.PerspectiveCamera(80,
											  window.innerWidth / window.innerHeight,
											  1,1000);

	prespCamera.position.set(1.8*threshold, threshold,
								threshold/2);
	prespCamera.lookAt(threshold/2, 0, threshold/2);
}

function createUpCamera(threshold){
	'use strict';

	var viewHeight  = 300;
	var aspectratio = window.innerWidth / window.innerHeight;

	upCamera = new THREE.OrthographicCamera(aspectratio*viewHeight/2,
										   -aspectratio*viewHeight/2,
										   -viewHeight/2,
	   									    viewHeight/2,
	   									   -1000, 1000);
	
	upCamera.position.set(threshold/2, (3/2)*threshold, 
							threshold*(3/2));
	upCamera.lookAt(threshold/2, threshold/2, threshold/2);
}

/*--------------------------------------------------------------------
| PRESS KEYS
---------------------------------------------------------------------*/
function onKeyDown(e){
	'use strict';
	var angleInc = Math.PI/8;
//	console.log(e.keyCode);
	switch(e.keyCode){
		case 37:
			
		//	planeRotateY = planeRotateY - angleInc;
		//	plane.rotateOnWorldAxis(new THREE.Vector3(0,1,0),-angleInc);
			if(rotateYleft != 1){
				angularVelY = angularVelY - angularVIncrement;
				rotateYleft = 1;

			}

			break;
		case 39:
			if(rotateYRight != 1){
				angularVelY = angularVelY + angularVIncrement;
				rotateYRight = 1;

			}
			break;

		case 38:
			if(rotateUp != 1){
				angularVelVert = angularVelVert + angularVIncrement;
				rotateUp = 1;

			}
			break;

		case 40:
			if(rotateDown != 1){
				angularVelVert = angularVelVert - angularVIncrement;
				rotateDown = 1;

			}	
			break;


		case 85:
			console.log(planeRotateY*180/Math.PI);

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
		
		case 71:  // G
		case 103: // g
			airplane.changeMaterials();
			break;
		case 76:  // L
		case 108: // l
			airplane.changeIlluminationCalculation();
			break;
	}


}


function onKeyUp(e){
	'use strict';
	switch(e.keyCode){
		case 37:
		    angularVelY = angularVelY + angularVIncrement;
			rotateYleft= 0;
			
			break;
		case 39:
			rotateYRight = 0;
			angularVelY = angularVelY - angularVIncrement;
			break;

		case 38:
			rotateUp = 0;
			angularVelVert = angularVelVert - angularVIncrement;
			break;

		case 40:
			rotateDown = 0;
			angularVelVert = angularVelVert + angularVIncrement;		
			break;
	}


}


function rotatePlane(delta){
		planeRotateY = planeRotateY + delta*angularVelY;
		plane.rotateOnWorldAxis(new THREE.Vector3(0,1,0),delta*angularVelY);
		plane.rotateOnWorldAxis(new THREE.Vector3(Math.sin(planeRotateY+Math.PI/2),0,Math.cos(planeRotateY+Math.PI/2)),delta*angularVelVert);
}
