/*--------------------------------------------------------------------
| Class: StadiumSpotlight
---------------------------------------------------------------------*/

const POLEHEIGHT = 100;

class StadiumSpotlight extends THREE.Object3D{
    
    constructor(x, y, z, rotation){
        'use strict';

        super();

        this.light = null;

        this.addPole();
        this.addTower();
        this.addSplint();
        this.addSpotlight();

        this.rotation.y = rotation;
        this.position.set(x, y, z);
    }

    addPole(){
        'use strict';

        var geometry = new THREE.CylinderGeometry(2, 2, POLEHEIGHT, 40, 40);
        var material = new THREE.MeshPhongMaterial({color: 0x777777});
        material.specular    = new THREE.Color(0x111111);
        material.shininess   = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        var mesh     = new THREE.Mesh(geometry, material);
        mesh.position.set(0, POLEHEIGHT/2, 0);
        this.add(mesh);
    }

    addTower(){
        'use strict';

        var geometry = new THREE.SphereGeometry(6, 40, 40);
        var material = new THREE.MeshPhongMaterial({color: 0x777777});
        material.specular    = new THREE.Color(0x111111);
        material.shininess   = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        var mesh     = new THREE.Mesh(geometry, material);
        mesh.position.set(0, POLEHEIGHT, 0);
        this.add(mesh);
    }

    addSplint(){
        'use strict';

        var geometry = new THREE.ConeGeometry(8, 15, 20, 20);
        var material = new THREE.MeshPhongMaterial({color: 0x777777});
        material.specular    = new THREE.Color(0x111111);
        material.shininess   = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        var mesh     = new THREE.Mesh(geometry, material);
        mesh.position.set(-2, POLEHEIGHT, -2);
        mesh.lookAt(50, -30, 50);
        this.add(mesh);
    }

    addSpotlight(){
        'use strict';

        this.light = new THREE.SpotLight(0xffffff, 0.7); 
        this.light.position.set(-3, POLEHEIGHT, -3);
        this.light.castShadow = true;
        this.add(this.light);
    }
}
