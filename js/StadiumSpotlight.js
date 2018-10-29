/*--------------------------------------------------------------------
| Class: StadiumSpotlight
---------------------------------------------------------------------*/

const POLEHEIGHT = 100;

class StadiumSpotlight extends THREE.Object3D{
    
    constructor(x, y, z, lookAt){
        'use strict';

        super();
        this.addPole();
        this.addTower();
        this.addSplint(lookAt);
        this.addSpotlight(lookAt);

        this.position.set(x, y, z);

    }

    addPole(){
        'use strict';

        var geometry = new THREE.CylinderGeometry(5, 5, POLEHEIGHT, 40, 40);
        var material = new THREE.MeshPhongMaterial({color: 0x777777});
        material.specular    = 0x111111;
        material.shinineess  = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        var mesh     = new THREE.Mesh({geometry, material});

        this.add(mesh);

        mesh.position.set(0, POLEHEIGHT/2, 0);
    }

    addTower(){
        'use strict';

        var geometry = new THREE.SphereGeometry(7, 40, 40);
        var material = new THREE.MeshPhongMaterial({color: 0x777777});
        material.specular    = 0x111111;
        material.shinineess  = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        var mesh     = new THREE.Mesh({geometry, material});

        this.add(mesh);

        mesh.position.set(0, POLEHEIGHT, 0);
    }

    addSplint(lookAt){
        'use strict';

        var geometry = new THREE.ConeGeometry(9, 5, 40, 40);
        var material = new THREE.MeshPhongMaterial({color: 0x777777});
        material.specular    = 0x111111;
        material.shinineess  = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        var mesh     = new THREE.Mesh({geometry, material});

        this.add(mesh);

        mesh.position.set(0, POLEHEIGHT, 0);
        mesh.lookAt(lookAt);
    }

    addSpotlight(lookAt){
        'use strict';

        return lookAt;
    }
}
