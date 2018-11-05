class TriangularPrismGeometry extends THREE.Geometry{
    constructor(height, baseHeight, baseWidth, linearPointDensity){
        'use strict';

        super();
        this.height = height;
        this.baseHeight = baseHeight;
        this.baseWidth = baseWidth;
        this.linearPointDensity = linearPointDensity;

        var tot = 0;
        tot = this.addTriangularFace(0, tot);
        tot = this.addTriangularFace(height, tot);
        tot = this.addRectangularFace(new THREE.Vector3(0, baseHeight, 0), new THREE.Vector3(height, 0, baseWidth), tot);
        tot = this.addRectangularFace(new THREE.Vector3(0, 0, 0), new THREE.Vector3(height, 0, baseWidth), tot);
        tot = this.addRectangularFace(new THREE.Vector3(0, baseHeight, 0), new THREE.Vector3(height, 0, 0), tot);
        this.computeFaceNormals();
        this.computeVertexNormals();
    }

    addTriangularFace(x, totalPoints){
        'use strict';

        var lineBeforeIndexes = [];
        var lineBeforeLen = 0;
        var thisLineIndexes = [];
        var thisLineLen = 0;
        var m = -this.baseHeight/this.baseWidth;
        var b =  this.baseHeight;

        var y, z;
        var newPoint;
        for(y = this.baseHeight; /*on porpous*/ ; y -= 1/this.linearPointDensity){
            
            /*==============*/
            if(y < 0){ y = 0; }
            /*==============*/

            for(z = 0; z < this.lineEquation(m, y, b); z += 1/this.linearPointDensity){
                newPoint = new THREE.Vector3(x, y, z);
                
                thisLineIndexes.push(totalPoints);
                totalPoints++;
                thisLineLen++;

                this.vertices.push(newPoint);

            }
            
            z = this.lineEquation(m, y, b);
            newPoint = new THREE.Vector3(x, y, z);
                
            thisLineIndexes.push(totalPoints);
            totalPoints++;
            thisLineLen++;

            this.vertices.push(newPoint);            
            if( x == 0){ // CASE: left face
                var i;
                for(i = 0; i < lineBeforeLen && i+1 < thisLineLen; i++){
                    this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                    thisLineIndexes[i],
                                                    thisLineIndexes[i+1]));
                    if(i != lineBeforeLen-1)
                        this.faces.push(new THREE.Face3(lineBeforeIndexes[i+1],
                                                        lineBeforeIndexes[i],
                                                        thisLineIndexes[i+1]));
                }

                var j;
                for(j = thisLineLen-1; j>lineBeforeLen; j--){
                    this.faces.push(new THREE.Face3(lineBeforeIndexes[lineBeforeLen-1],
                                                    thisLineIndexes[j-1],
                                                    thisLineIndexes[j]));
                }
            }
            else{ // CASE: right face
                var i;
                for(i = 0; i < lineBeforeLen && i+1 < thisLineLen; i++){
                    this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                    thisLineIndexes[i+1],
                                                    thisLineIndexes[i]));
                    if(i != lineBeforeLen-1)
                        this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                        lineBeforeIndexes[i+1],
                                                        thisLineIndexes[i+1]));
                }

                var j;
                for(j = thisLineLen-1; j>lineBeforeLen; j--){
                    this.faces.push(new THREE.Face3(lineBeforeIndexes[lineBeforeLen-1],
                                                    thisLineIndexes[j],
                                                    thisLineIndexes[j-1]));
                }
            }

            lineBeforeIndexes = thisLineIndexes.slice();
            lineBeforeLen = thisLineLen;

            thisLineIndexes = [];
            thisLineLen = 0;
            /*==============*/
            if(y == 0){ break; }
            /*==============*/
        }
        return totalPoints;
    }

    addRectangularFace(vTopLeft, vBottomRight, totalPoints){
        'use strict';

        if(vTopLeft.y == vBottomRight.y){
            totalPoints = this.addFlatFace(vBottomRight.z, vBottomRight.x, totalPoints);
        }
        else if(vTopLeft.z == vBottomRight.z){
            totalPoints = this.addVerticalFace(vTopLeft.y, vBottomRight.x, totalPoints);
        }
        else{
            totalPoints = this.addInclinedFace(vTopLeft.y, vBottomRight.x, -vTopLeft.y/vBottomRight.z, totalPoints);
        }
        return totalPoints;
    }

    lineEquation(m, y, b){
        'use strict';

        return (y - b)/m;
    }

    addInclinedFace(maxY, maxX, m, totalPoints){
        'use strict';

        var lineBeforeIndexes = [];
        var lineBeforeLen = 0;
        var thisLineIndexes = [];
        var thisLineLen = 0;
        var b = maxY;

        var x, y, z;
        var newPoint;
        for(y = maxY; /*on porpous*/ ; y -= 1/this.linearPointDensity){
            
            /*==============*/
            if(y < 0){ y = 0; }
            /*==============*/

            z = this.lineEquation(m, y, b);

            for(x = 0; x < maxX; x += 1/this.linearPointDensity){
                newPoint = new THREE.Vector3(x, y, z);
                
                thisLineIndexes.push(totalPoints);
                totalPoints++;
                thisLineLen++;

                this.vertices.push(newPoint);

            }
            
            x = maxX;
            newPoint = new THREE.Vector3(x, y, z);
                
            thisLineIndexes.push(totalPoints);
            totalPoints++;
            thisLineLen++;

            this.vertices.push(newPoint);            

            var i;
            for(i = 0; i < lineBeforeLen-1; i++){
                this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                thisLineIndexes[i],
                                                thisLineIndexes[i+1]));
                this.faces.push(new THREE.Face3(lineBeforeIndexes[i+1],
                                                lineBeforeIndexes[i],
                                                thisLineIndexes[i+1]));
            }

            lineBeforeIndexes = thisLineIndexes.slice();
            lineBeforeLen = thisLineLen;

            thisLineIndexes = [];
            thisLineLen = 0;
            /*==============*/
            if(y == 0){ break; }
            /*==============*/
        }
        return totalPoints;
    }

    addFlatFace(maxZ, maxX, totalPoints){
        'use strict';

        var lineBeforeIndexes = [];
        var lineBeforeLen = 0;
        var thisLineIndexes = [];
        var thisLineLen = 0;

        var x, z;
        var newPoint;
        for(z = 0; /*on porpous*/ ; z += 1/this.linearPointDensity){
            
            /*==============*/
            if(z > maxZ){ z = maxZ; }
            /*==============*/

            for(x = 0; x < maxX; x += 1/this.linearPointDensity){
                newPoint = new THREE.Vector3(x, 0, z);
                
                thisLineIndexes.push(totalPoints);
                totalPoints++;
                thisLineLen++;

                this.vertices.push(newPoint);

            }
            
            x = maxX;
            newPoint = new THREE.Vector3(x, 0, z);
                
            thisLineIndexes.push(totalPoints);
            totalPoints++;
            thisLineLen++;

            this.vertices.push(newPoint);            

            var i;
            for(i = 0; i < lineBeforeLen-1; i++){
                this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                thisLineIndexes[i+1],
                                                thisLineIndexes[i]));
                this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                lineBeforeIndexes[i+1],
                                                thisLineIndexes[i+1]));
            }

            lineBeforeIndexes = thisLineIndexes.slice();
            lineBeforeLen = thisLineLen;

            thisLineIndexes = [];
            thisLineLen = 0;
            /*==============*/
            if(z == maxZ){ break; }
            /*==============*/
        }
        return totalPoints;
    }

    addVerticalFace(maxY, maxX, totalPoints){
        'use strict';

        var lineBeforeIndexes = [];
        var lineBeforeLen = 0;
        var thisLineIndexes = [];
        var thisLineLen = 0;

        var x, y;
        var newPoint;
        for(y = maxY; /*on porpous*/ ; y -= 1/this.linearPointDensity){
            
            /*==============*/
            if(y < 0){ y = 0; }
            /*==============*/

            for(x = 0; x < maxX; x += 1/this.linearPointDensity){
                newPoint = new THREE.Vector3(x, y, 0);
                
                thisLineIndexes.push(totalPoints);
                totalPoints++;
                thisLineLen++;

                this.vertices.push(newPoint);

            }
            
            x = maxX;
            newPoint = new THREE.Vector3(x, y, 0);
                
            thisLineIndexes.push(totalPoints);
            totalPoints++;
            thisLineLen++;

            this.vertices.push(newPoint);            

            var i;
            for(i = 0; i < lineBeforeLen-1; i++){
                this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                thisLineIndexes[i+1],
                                                thisLineIndexes[i]));
                this.faces.push(new THREE.Face3(lineBeforeIndexes[i],
                                                lineBeforeIndexes[i+1],
                                                thisLineIndexes[i+1]));
            }

            lineBeforeIndexes = thisLineIndexes.slice();
            lineBeforeLen = thisLineLen;

            thisLineIndexes = [];
            thisLineLen = 0;
            /*==============*/
            if(y == 0){ break; }
            /*==============*/
        }
        return totalPoints;
    }
}