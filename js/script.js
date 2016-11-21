//-------------------------------------------------------------
//------------------------INITIALISATION-----------------------
//-------------------------------------------------------------
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth-5, window.innerHeight-5);
renderer.setClearColor(0x778899, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = false;
renderer.shadowMapTye = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var doors = [];
var KeysPressed = [];

//PointerLockControls
var blocker = document.getElementById('blocker');
var instructions = document.getElementById( 'instructions' );
var controlsEnabled = false;
var raycaster;

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
    
    var element = document.body;
    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
        }
    };

    var pointerlockerror = function ( event ) {
        instructions.style.display = '';
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {
            var fullscreenchange = function ( event ) {
                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                    element.requestPointerLock();
                }
            };

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
    }, false );
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}



// Hook mouse move events
document.addEventListener("mousemove", this.moveCallback, false);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000);
var controls = new THREE.PointerLockControls( camera );
controls.getObject().position.set(0, 115, 130);
scene.add(controls.getObject());


//-------------------------------------------------------------
//--------------------------LIGHTS-----------------------------
//-------------------------------------------------------------
var ambLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

var porchLight = new THREE.SpotLight(0xffffff, 2);
porchLight.position.set(0, 25, 85);
porchLight.shadowMapWidth = 2048;
porchLight.shadowMapHeight = 2048;
porchLight.castShadow = true;
porchLight.penumbra = 0.25;
porchLight.distance = 100;
porchLight.target.position.set(0,0,85);
porchLight.target.updateMatrixWorld();
var slHelper = new THREE.SpotLightHelper(porchLight);
scene.add(porchLight, slHelper);


var studyLight = new THREE.SpotLight(0xffffff, 2);
studyLight.position.set(55,20,40);
studyLight.castShadow = true;
studyLight.target.position.set(55,0,40);
studyLight.target.updateMatrixWorld();
studyLight.penumbra = 0.5;
studyLight.distance = 100;
studyLight.angle = 1.2;
var helper01 = new THREE.SpotLightHelper(studyLight);
scene.add(studyLight, helper01);


//-------------------------------------------------------------
//-------------------------OBJECTS-----------------------------
//-------------------------------------------------------------

//==================FLOORS====================

//Bottom Floor
var pGeo = new THREE.PlaneGeometry(160, 160, 5, 8);
var pMat = new THREE.MeshPhongMaterial({color: 0x005567, side: THREE.DoubleSide});
var bottomFloor = new THREE.Mesh(pGeo, pMat);
bottomFloor.rotation.x = Math.PI * 90 / 180;
bottomFloor.receiveShadow = true;
scene.add(bottomFloor);

//Conservatory Floor
var csvtryFloor = new THREE.Mesh(new THREE.PlaneGeometry(65,65,5,8), new THREE.MeshPhongMaterial({color: 0xb69b4c, side: THREE.DoubleSide}));
csvtryFloor.rotation.x = Math.PI * 90/180;
csvtryFloor.position.set(47.5,0,-112);
scene.add(csvtryFloor);


//==================DOORS====================

//Front Door
var frontLeft = new THREE.Mesh(new THREE.CubeGeometry(3,20,1).translate(1,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
frontLeft.position.set(20,10,0);
var frontRight = frontLeft.clone();
frontRight.position.set(9,0,0);
frontLeft.add(frontRight);
var bottom = new THREE.Mesh(new THREE.CubeGeometry(6,4,1), new THREE.MeshPhongMaterial({color:0xff6633}));
bottom.position.set(5.5,-8,0);
frontLeft.add(bottom);
var glassPanel1 = new THREE.Mesh(new THREE.CubeGeometry(6,12,1), new THREE.MeshPhongMaterial({color: 0x8DEEEE, transparent: true, opacity: 0.8}));
glassPanel1.position.set(5.5, 0, 0);
frontLeft.add(glassPanel1);
var topPanel = new THREE.Mesh(new THREE.CubeGeometry(6,4,1), new THREE.MeshPhongMaterial({color: 0xff6633}));
topPanel.position.set(5.5, 8, 0);
frontLeft.add(topPanel);
frontLeft.position.set(-5.5, 10, 80);
frontLeft.castShadow = true;
frontRight.castShadow = true;
bottom.castShadow = true;
topPanel.castShadow = true;
doors.push(frontLeft);
scene.add(frontLeft);

//Study Door
var studyDoor = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(6,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
studyDoor.rotation.y = Math.PI * 270/180;
studyDoor.position.set(32.5, 10, 60);
studyDoor.castShadow = true;
studyDoor.receiveShadow = true;
doors.push(studyDoor);
scene.add(studyDoor);

// Living room to front corridor
var livingRoomDoor1 = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
livingRoomDoor1.position.set(16, 10, 49.5);
livingRoomDoor1.receiveShadow = true;
doors.push(livingRoomDoor1);
scene.add(livingRoomDoor1);



//==================WALLS====================

//Front Wall
var wallGeo = new THREE.CubeGeometry(74,24,2);
//var wallMat = new THREE.MeshPhongMaterial({color: 0xff6633});
var wallMat = new THREE.MeshFaceMaterial([
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}), //Front
                new THREE.MeshPhongMaterial({color:0xffffff}) //Bacl
              ]);
var frontWallLeft = new THREE.Mesh(wallGeo, wallMat);
frontWallLeft.castShadow = true;
frontWallLeft.position.set(-43,12,80);
var frontWallRight = frontWallLeft.clone();
frontWallRight.position.x += 86;
scene.add(frontWallLeft, frontWallRight);

//Right Outdoor Wall
var rightSideWall = new THREE.Mesh(new THREE.CubeGeometry(161, 24, 2), wallMat);
rightSideWall.position.set(80, 12, 0.5);
rightSideWall.rotation.y = Math.PI * 90/180;
scene.add(rightSideWall);


//Dining room to Utility wall
var wall01 = new THREE.Mesh(new THREE.CubeGeometry(60, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall01.position.set(-50, 12, 30);
wall01.castShadow = true;
scene.add(wall01);

//Study to Living room wall
var wall02 = wall01.clone();
wall02.scale.x = 0.8;
wall02.position.set(56,12,10);
scene.add(wall02);

//Study to hallway wall
var wall03 = new THREE.Mesh(new THREE.CubeGeometry(50, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff})); 
wall03.rotation.y = Math.PI * 90/180;
wall03.position.set(32.5,12,35);
wall03.castShadow = true;
var wall03Pt2 = new THREE.Mesh(new THREE.CubeGeometry(7, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff})); 
wall03Pt2.position.set(-40.5, 0, 0);
wall03Pt2.receiveShadow = true;
wall03.add(wall03Pt2);
scene.add(wall03);

//Living room to kitchen wall
var wall04 = new THREE.Mesh(new THREE.CubeGeometry(130, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall04.rotation.y = Math.PI * 90/180;
wall04.position.set(15, 12, -15);
wall04.castShadow = true;
var wall04Pt2 = new THREE.Mesh(new THREE.CubeGeometry(5, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff})); 
wall04Pt2.position.set(30,12,49.5);
wall04Pt2.castShadow = true;
wall04Pt2.receiveShadow = true;
scene.add(wall04, wall04Pt2);

wall05 = new THREE.Mesh(new THREE.CubeGeometry(30, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall05.rotation.y = Math.PI * 90/180;
wall05.position.set(-20,12,64);
wall05.castShadow = true;
wall05.receiveShadow = true;   
scene.add(wall05);

//==================MISC====================

var axis = new THREE.AxisHelper(100);
scene.add(axis);



//-------------------------------------------------------------
//-------------------------ANIMATION---------------------------
//-------------------------------------------------------------
var doorStatus = "closed"; //Change to array for all doors, give all doors numbers to save confusion

//Opening and Closing Doors in the house
function doorInteract(door){
    if (doorStatus == "closed"){
        doorStatus = "moving";
        var i = 0;
        var doorAnimation = setInterval(
            function(){
                if (i < 90){
                    doors[door].rotation.y += Math.PI * 1/180;
                    i++;
                } else {
                    clearInterval(doorAnimation);
                    doorStatus = "open";
                }
            }, 10);
    } else if(doorStatus = "open"){
        doorStatus = "moving";
        var i = 0;
        var doorAnimation = setInterval(
            function(){
                if (i < 90){
                    doors[door].rotation.y -= Math.PI * 1/180;
                    i++;
                } else {
                    clearInterval(doorAnimation);
                    doorStatus = "closed";
                }
            }, 10);
    }
}


//-------------------------------------------------------------
//------------------------RENDER-LOOP--------------------------
//-------------------------------------------------------------
window.onkeydown = function(e){
    console.log(e.keyCode);
    KeysPressed[e.keyCode] = true;
}
window.onkeyup = function(e) {
    KeysPressed[e.keyCode] = false;
}

function RenderLoop(){
    renderer.render(scene, camera);
    
    //Movement
    if (KeysPressed[87]){ controls.getObject().translateZ( -1 ); }
    if (KeysPressed[83]){ controls.getObject().translateZ( 1 ); } 
    if (KeysPressed[68]){ controls.getObject().translateX( 1 ); }
    if (KeysPressed[65]){ controls.getObject().translateX( -1 ); }
    if (KeysPressed[32]){ controls.getObject().translateY( 1 ); }
    if (KeysPressed[16]){ controls.getObject().translateY( -1 ); }
    if (KeysPressed[69]){ if (doorStatus != "moving"){ doorInteract(0); }}
    
    requestAnimationFrame(RenderLoop);
}
RenderLoop();

