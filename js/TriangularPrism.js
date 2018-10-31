class TriangularPrism extends THREE.Geometry{
    constructor(height, baseHeight, baseWidth, linearPointDensity){
        super();
        this.height = height;
        this.baseHeight = baseHeight;
        this.baseWidth = baseWidth;
        this.linearPointDensity = linearPointDensity;
        this.addRectangularFace();
        this.addRectangularFace();
        this.addRectangularFace();
        // this.addTriangularFace();
        // this.addTriangularFace();

    }

    addRectangularFace(vTopLeft, vBottomRight, pointsInitIndex){

        var distanceX = vBottomRight.x;
        var distanceZ = vBottomRight.z;
        var distanceY = vTopLeft.y;

        var angleYZ; // angle aroun x axis, 
                     // starting at y=-1 and z=0
                     // and moving to z = 1

        if(distanceY != 0)
            angleYZ = arctan(distanceZ/distanceY);
        else
            angleYZ = Math.PI/2

        var densityX = distanceX/this.linearPointDensity;
        var densityYZ = angleYZ/this.linearPointDensity;
        
        // CREATE array of points per line
        // 1. Left -> Right
        // 2. Top -> Down
        // if in the 1st quadrant
        for( yz = 0; yz < angleYZ-1; yz += densityYZ){
            var y = distanceY*cos(yz);
            var z = distanceZ*sen(yz);
            for( x = 0; x < distanceX -1; x += densityX){
                this.vertices.push(new THREE.Vector3(x, y, z));
            }
            // make sure we have vertex on the border of the face
            this.vertices.push(new THREE.Vector3(distanceX, y,z));
        }

        // make sure we have vertex on the border of the face
        for( x = 0; x < distanceX -1; x += densityX){
            this.vertices.push(new THREE.Vector3(x, distanceY, distanceZ));
        }
        this.vertices.push(new THREE.Vector3(distanceX, distanceY, distanceZ));
        

        // Create faces (triangles)
        for( l = 0; l < this.linearPointDensity -1; l++){
            top_line = l*this.linearPointDensity;
            bot_line = (l+1)*this.linearPointDensity;
            
            for( c = 0; c < this.linearPointDensity -1; c++){
                // add 'pointsInitIndex' because points[] has points of all "geometries"
                var vtop_left  = points[pointsInitIndex + top_line + c   ];
                var vtop_right = points[pointsInitIndex + top_line + c +1];
                var vbot_left  = points[pointsInitIndex + bot_line + c   ];
                var vbot_right = points[pointsInitIndex +bot_line + c +1];
                
                faces.push(new Face3(vtop_left, vtop_right, vbot_left));
                faces.push(new Face3(vbot_left, vbot_right, vtop_right));
            }
        }
    return Math.power(linearDensity, 2);
        
    }

    
}