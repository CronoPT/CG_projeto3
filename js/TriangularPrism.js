class TriangularPrism extends THREE.Geometry{
    constuctor(height, baseHeight, baseWidth, linearPointDensity){
        super();
        this.height = height;
        this.baseHeight = baseHeight;
        this.baseWidth = baseWidth;
        this.linearPointDensity = linearPointDensity;
    }

    addTriangularFace(offSet){

        geom.faces.push();
    }

    addRectangularFace(vTopLeft, vBottomRight){
        points = [];
        distanceX = vBottomRight.x;
        distanceZ = vBottomRight.z;
        distanceY = vTopLeft.y;

        angleYZ = arctan(distanceY/distanceZ); 
        densityX = distanceX/this.linearPointDensity;
        densityYZ = angleYZ/this.linearPointDensity;
        
        for( yz = 0; yz < angleYZ; yz += yzDensity){
            y = distanceY*set(yz);
            z = distanceZ*cos(yz);
            for( x = 0; x < distanceX; x += densityX){
                points += [new THREE.Vector3(x, y, z)];
            }

        }
        geom.faces.push()
    }

    
}