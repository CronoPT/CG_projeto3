var COLOR = 0xC0C0C0 // RGB silver
var NUM_OF_MESHES = 8

class Airplane extends THREE.Object3D{
    
    constructor(height, length, width, linearPointDensity){
        'use strict'
        super();

        this.height = height;
        this.length = length;
        this.width = width;
        this.linearPointDensity = linearPointDensity;

        //
        // BODY
        //
        this.bodyHeight = 0.7 * height;
        this.bodyLength = length;
        this.bodyWidth  = 0.3 * width;

        //
        // Arrays
        //
        // Indexes:
        //
        // 0: bodyMesh
        // 1: leftWingMesh        
        // 2: rightWingMesh 
        // 3: frontCockpitMesh  
        // 4: backCockpitMesh    
        // 5: leftStabilizerMesh  
        // 6: rightStabilizerMesh 
        // 7: verticalStabilizerMesh
        //
        //
        // NOTE: they all have the same color (silver) but 3 and 4 => cockpit
        //
        this.meshes = [];
        this.phongMaterials = [];
        this.gouraudMaterials = []; // a.k.a. Lambert materials
        this.basicMaterials = [];   // a.k.a. STOP illumination calculation
        this.hasPhong = true;
        this.hasIllumination = true;

        this.createPhongMaterials();
        this.createGouraudMaterials();
        this.createBasicMaterials();

        this.addBody();
        this.addWings();
        this.addCockpit();
        this.addLateralStabilizers();
        this.addVerticalStabilizer();
    }


    // --------------------------------------------------
    //                  MATERIALS
    //
    // - Creation
    // - Change Shadowing Gouraud vs Phong
    // - Change (on vs off) Illumination calculation
    //
    // --------------------------------------------------
    createPhongMaterials(){
                
        for( var i=0; i < 3; i++){
            this.phongMaterials.push( new THREE.MeshPhongMaterial({color: COLOR}));
            this.phongMaterials[i].specular    = new THREE.Color(COLOR);
            this.phongMaterials[i].shininess   = 30;
            this.phongMaterials[i].flatShading = THREE.SmoothShading;
            this.phongMaterials[i].needsUpdate = true;
        }   

        for( var i=3; i < 5; i++){
            this.phongMaterials.push( new THREE.MeshPhongMaterial({color: 0x005555}));
            this.phongMaterials[i].specular    = new THREE.Color(0x005555);
            this.phongMaterials[i].shininess   = 100;
            this.phongMaterials[i].flatShading = THREE.SmoothShading;
            this.phongMaterials[i].needsUpdate = true;
        }

        for( var i=5; i < 8; i++){
            this.phongMaterials.push( new THREE.MeshPhongMaterial({color: COLOR}));
            this.phongMaterials[i].specular    = new THREE.Color(COLOR);
            this.phongMaterials[i].shininess   = 30;
            this.phongMaterials[i].flatShading = THREE.SmoothShading;
            this.phongMaterials[i].needsUpdate = true;
        }   
    }


    createGouraudMaterials(){

        for( var i=0; i < 3; i++){
            this.gouraudMaterials.push( new THREE.MeshLambertMaterial({color: COLOR}));
            this.gouraudMaterials[i].specular    = new THREE.Color(COLOR);
            this.gouraudMaterials[i].shininess   = 30;
            this.gouraudMaterials[i].flatShading = THREE.SmoothShading;
            this.gouraudMaterials[i].needsUpdate = true;
        }   

        for( var i=3; i < 5; i++){
            this.gouraudMaterials.push( new THREE.MeshLambertMaterial({color: 0x005555}));
            this.gouraudMaterials[i].specular    = new THREE.Color(0x005555);
            this.gouraudMaterials[i].shininess   = 100;
            this.gouraudMaterials[i].flatShading = THREE.SmoothShading;
            this.gouraudMaterials[i].needsUpdate = true;
        }

        for( var i=5; i < 8; i++){
            this.gouraudMaterials.push( new THREE.MeshLambertMaterial({color: COLOR}));
            this.gouraudMaterials[i].specular    = new THREE.Color(COLOR);
            this.gouraudMaterials[i].shininess   = 30;
            this.gouraudMaterials[i].flatShading = THREE.SmoothShading;
            this.gouraudMaterials[i].needsUpdate = true;
        }   
    }

    createBasicMaterials(){

        for( var i=0; i < 3; i++){
            this.basicMaterials.push( new THREE.MeshBasicMaterial({color: COLOR}));
        }
        for( var i=3; i < 5; i++){
            this.basicMaterials.push( new THREE.MeshBasicMaterial({color: 0x005555}));
        }
        for( var i=5; i < 8; i++){
            this.basicMaterials.push( new THREE.MeshBasicMaterial({color: COLOR}));
        }
    }

    changeMaterials(){
        if( this.hasIllumination == true){
            if( this.hasPhong == true)
                this.setMaterialsToGouraud();
            else   
                this.setMaterialsToPhong();
        }
        this.hasPhong = !this.hasPhong;
    }

    changeIlluminationCalculation(){
        if( this.hasIllumination == false){
            if( this.hasPhong)
                this.setMaterialsToPhong();
            else
                this.setMaterialsToGouraud();    
        }
        else // stop illuminaion calculation
            this.setMaterialsToBasic();
        this.hasIllumination = !this.hasIllumination;

    }

    setMaterialsToPhong(){
        for( var i=0; i < 8; i++)
            this.meshes[i].material = this.phongMaterials[i];
    }

    setMaterialsToGouraud(){
        for( var i=0; i < 8; i++)
            this.meshes[i].material = this.gouraudMaterials[i];
    }

    setMaterialsToBasic(){
        for( var i=0; i < 8; i++)
            this.meshes[i].material = this.basicMaterials[i];
    }


    // --------------------------------------------------
    //                  MESHES
    //
    // - Creation (default material: PHONG)
    //
    // --------------------------------------------------

    // PRISM = (height, baseHeight, baseWidth, linearPointDensity)    
    
    addBody(){
        'use strict'
        var geometry = new TriangularPrismGeometry(this.bodyWidth, 
                                                    this.bodyHeight,
                                                    this.bodyLength, 
                                                    this.linearPointDensity);
        
        var material = new THREE.MeshPhongMaterial({color: COLOR, side: THREE.DoubleSide})
        material.specular    = new THREE.Color(COLOR);
        material.shininess   = 30;
        material.flatShading = THREE.SmoothShading;
        material.needsUpdate = true;
        geometry.normalsNeedUpdate = true;
        this.meshes.push( new THREE.Mesh(geometry, this.phongMaterials[0]));

        this.meshes[0].position.x = 0;
        this.meshes[0].position.y = 0;
        this.meshes[0].position.z = 0;
        
        this.add( this.meshes[0]);
    }

    addWings(){
        'use strict'
        var wingThickness = 0.05 * this.bodyHeight;
        var wingLength = this.width - (this.bodyWidth/2);
        var wingWidth  = 0.4  * this.bodyLength;    

        var leftWingGeometry = new TriangularPrismGeometry( wingThickness, 
                                                            wingLength, 
                                                            wingWidth, 
                                                            this.linearPointDensity);

        var rightWingGeometry = new TriangularPrismGeometry(wingThickness, 
                                                            wingLength, 
                                                            wingWidth,  
                                                            this.linearPointDensity);
        
        //
        // left wing
        //
        this.meshes.push( new THREE.Mesh(leftWingGeometry, this.phongMaterials[1]));
        this.meshes[1].rotation.z = -Math.PI/2;

        this.add(this.meshes[1]);

        this.meshes[1].position.x = this.bodyWidth;
        this.meshes[1].position.y = this.bodyHeight/3 + wingThickness/2;
        this.meshes[1].position.z = this.bodyLength * 0.2;

        //
        // right wing
        //    
        this.meshes.push( new THREE.Mesh(rightWingGeometry, this.phongMaterials[2]));
        this.meshes[2].rotation.z = Math.PI/2;

        this.add(this.meshes[2]);

        this.meshes[2].position.x = 0;
        this.meshes[2].position.y = this.bodyHeight/3 - wingThickness/2;
        this.meshes[2].position.z = this.bodyLength * 0.2;
    }

    addCockpit(){
        'use strict'

        var angleX = (Math.PI/2) - Math.atan(this.bodyLength / (this.bodyHeight));

        var stabilizerHeight = this.bodyHeight*0.3;
        var stabilizerLength = this.bodyLength * 0.2;
        var stabilizerThickness  = this.bodyWidth * 0.3;        

        var frontGeometry = new TriangularPrismGeometry( stabilizerThickness, 
                                                    stabilizerHeight,
                                                    stabilizerLength, 
                                                    this.linearPointDensity);

        var backGeometry = new TriangularPrismGeometry( stabilizerThickness, 
                                                    stabilizerHeight,
                                                    stabilizerLength, 
                                                    this.linearPointDensity);

        //
        // front cockpit
        //
        this.meshes.push( new THREE.Mesh(frontGeometry,this.phongMaterials[3]));
        this.meshes[3].rotation.x = angleX;

        this.add(this.meshes[3]);

        this.meshes[3].position.x = this.bodyWidth/2 - stabilizerThickness/2;
        this.meshes[3].position.z = this.bodyLength*0.7;
        this.meshes[3].position.y = (this.bodyLength - this.meshes[3].position.z) * 
                            Math.tan(angleX);

        
        //
        // back cockpit
        //
        this.meshes.push( new THREE.Mesh(backGeometry, this.phongMaterials[4]));
        this.meshes[4].rotation.x = angleX;
        this.meshes[4].rotation.y = Math.PI;

        this.add(this.meshes[4]);

        this.meshes[4].position.x = this.bodyWidth/2 + stabilizerThickness/2;
        this.meshes[4].position.z = this.bodyLength*0.7;
        this.meshes[4].position.y = (this.bodyLength - this.meshes[4].position.z) * 
                            Math.tan(angleX);
        
    }
    

    addLateralStabilizers(){
        'use strict'

        var angleX = (Math.PI/2) - Math.atan(this.bodyLength / (this.bodyHeight));

        var stabilizerHeight = (this.height - this.bodyHeight) / Math.cos(angleX);
        var stabilizerLength = this.bodyLength * 0.1;
        var stabilizerThickness  = this.bodyWidth * 0.05;  

        var leftStabilizerGeometry = new TriangularPrismGeometry( 
                                                    stabilizerThickness, 
                                                    stabilizerHeight,
                                                    stabilizerLength, 
                                                    this.linearPointDensity);

        var rightStabilizerGeometry = new TriangularPrismGeometry( 
                                                    stabilizerThickness, 
                                                    stabilizerHeight,
                                                    stabilizerLength, 
                                                    this.linearPointDensity);

        //
        // left stabilizer
        //
        this.meshes.push( new THREE.Mesh(leftStabilizerGeometry, this.phongMaterials[5]));
        this.meshes[5].rotation.z = -Math.PI/2;
        this.meshes[5].rotation.x = angleX;

        this.add(this.meshes[5]);   

        this.meshes[5].position.x = this.bodyWidth;
        this.meshes[5].position.y = this.bodyHeight;
        this.meshes[5].position.z = 0;

        //
        // right stabilizer
        //        
        this.meshes.push( new THREE.Mesh(rightStabilizerGeometry, this.phongMaterials[6]));
        this.meshes[6].rotation.z = Math.PI/2;
        this.meshes[6].rotation.x = angleX;

        this.add(this.meshes[6]);

        this.meshes[6].position.x = 0;
        this.meshes[6].position.y = this.bodyHeight - stabilizerThickness;
        this.meshes[6].position.z = 0;
    }

    addVerticalStabilizer(){
        'use strict'
        var angleX = (Math.PI/2) - Math.atan(this.bodyLength / (this.bodyHeight));

        var stabilizerHeight = (this.height - this.bodyHeight) / Math.cos(angleX);
        var stabilizerLength = this.bodyLength * 0.1;
        var stabilizerThickness  = this.bodyWidth * 0.05;        

        var geometry = new TriangularPrismGeometry( stabilizerThickness, 
                                                    stabilizerHeight,
                                                    stabilizerLength, 
                                                    this.linearPointDensity);


        this.meshes.push( new THREE.Mesh(geometry, this.phongMaterials[7]));
        this.meshes[7].rotation.x = angleX;

        this.add(this.meshes[7]);

        this.meshes[7].position.x = this.bodyWidth/2 - stabilizerThickness/2;
        this.meshes[7].position.y = this.bodyHeight;
        this.meshes[7].position.z = 0;
    }
}