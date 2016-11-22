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
var ambLight = new THREE.AmbientLight(0xffffff, 0.4);
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
studyLight.position.set(55,24,40);
studyLight.castShadow = true;
studyLight.target.position.set(55,0,40);
studyLight.target.updateMatrixWorld();
studyLight.penumbra = 0.5;
studyLight.distance = 100;
studyLight.angle = 1.4;
var helper01 = new THREE.SpotLightHelper(studyLight);
scene.add(studyLight, helper01);

var hallwayLight = new THREE.SpotLight(0xffffff, 2);
hallwayLight.position.set(-10,24,10);
hallwayLight.target.position.set(-10,0,10);
hallwayLight.castShadow = true;
hallwayLight.shadowMapWidth = 2048;
hallwayLight.shadowMapHeight = 2048;
hallwayLight.target.updateMatrixWorld();
hallwayLight.penumbra = 0.5;
hallwayLight.distance = 100;
hallwayLight.angle = 1.4;
var helper02 = new THREE.SpotLightHelper(hallwayLight);
scene.add(hallwayLight, helper02);


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

//Front Door [0]
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
bottom.castShadow = true;
topPanel.castShadow = true;
frontRight.castShadow = true;
frontRight.castShadow = true;
doors.push(frontLeft);

//Study Door [1]
var studyDoor = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(6,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
studyDoor.rotation.y = Math.PI * 270/180;
studyDoor.position.set(32.5, 10, 60);
doors.push(studyDoor);

// Living room to front corridor [2]
var livingRoomDoor1 = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
livingRoomDoor1.position.set(16, 10, 49.5);
doors.push(livingRoomDoor1);

//Dining room door [3]
var diningRoomDoor = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
diningRoomDoor.rotation.y += Math.PI * 90/180;
diningRoomDoor.position.set(-20, 10, 48.5);
doors.push(diningRoomDoor);

//Downstairs toilet door [4]
//var toiletDoor = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
var toiletDoor = livingRoomDoor1.clone();
toiletDoor.rotation.y += Math.PI * 270/180;
toiletDoor.position.set(-20, 10, 10);
doors.push(toiletDoor);

//Hallway to Kitchen Door [5]
var kitchen01 = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
kitchen01.position.set(-16.5, 10, -10);
doors.push(kitchen01);

//Kitchen to Utility door [6]
var kitchen02 = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
kitchen02.rotation.y += Math.PI;
kitchen02.position.set(-41.5, 10, -10);
doors.push(kitchen02);

//Kitchen to Utility door [7]
var utilityDoor = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), new THREE.MeshPhongMaterial({color:0xff6633}));
utilityDoor.rotation.y += Math.PI * 90/180;
utilityDoor.position.set(-80, 10, 6);
doors.push(utilityDoor);



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
                new THREE.MeshPhongMaterial({color:0xffffff}) //Back
              ]);
var frontWallLeft = new THREE.Mesh(wallGeo, wallMat);
frontWallLeft.position.set(-43,12,80);
var frontWallRight = frontWallLeft.clone();
frontWallRight.position.x += 86;

var leftWall01 = new THREE.Mesh(new THREE.CubeGeometry(75, 24, 2), wallMat);
leftWall01.rotation.y = Math.PI * 270/180;
leftWall01.position.set(-80, 12, 40 );

//Right Outdoor Wall
var rightSideWall = new THREE.Mesh(new THREE.CubeGeometry(161, 24, 2), wallMat);
rightSideWall.position.set(80, 12, 0.5);
rightSideWall.rotation.y = Math.PI * 90/180;

//Dining room to Utility wall
var wall01 = new THREE.Mesh(new THREE.CubeGeometry(60, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall01.position.set(-50, 12, 29.5);

//Study to Living room wall
var wall02 = wall01.clone();
wall02.scale.x = 0.8;
wall02.position.set(56,12,10);

//Study to hallway wall
var wall03 = new THREE.Mesh(new THREE.CubeGeometry(50, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff})); 
wall03.rotation.y = Math.PI * 90/180;
wall03.position.set(32.5,12,35);
var wall03Pt2 = new THREE.Mesh(new THREE.CubeGeometry(7, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff})); 
wall03Pt2.position.set(-40.5, 0, 0);
var wall03pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall03pt3.position.set(-31, 10, 0);
wall03.add(wall03Pt2, wall03pt3);

//Living room to kitchen/ hallway wall
var wall04 = new THREE.Mesh(new THREE.CubeGeometry(130, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall04.rotation.y = Math.PI * 90/180;
wall04.position.set(15, 12, -15);
var wall04Pt2 = new THREE.Mesh(new THREE.CubeGeometry(5, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff})); 
wall04Pt2.position.set(30,12,49.5);
var wall04Pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall04Pt3.position.set(21.5, 22, 49.5);

//dining room to hallway
var wall05 = new THREE.Mesh(new THREE.CubeGeometry(30, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall05.rotation.y = Math.PI * 90/180;
wall05.position.set(-20,12,64);
var wall05pt2 = new THREE.Mesh(new THREE.CubeGeometry(8, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall05pt2.position.set(31, 0, 0);
var wall05pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall05pt3.position.set(21, 10, 0);
wall05.add(wall05pt2, wall05pt3);

//kitchen to utility/ toilet
var wall06 = new THREE.Mesh(new THREE.CubeGeometry(24, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall06.position.set(-29, 12, -10);
var wall06pt2 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall06pt2.position.set(-18,10,0);
var wall06pt3 = new THREE.Mesh(new THREE.CubeGeometry(27, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall06pt3.position.set(-37.5,0,0);
wall06.add(wall06pt2, wall06pt3);

//toilet to hallway
var wall07 = new THREE.Mesh(new THREE.CubeGeometry(20, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall07.rotation.y += Math.PI * 90/180;
wall07.position.set(-20, 12, -0.5);
var wall07pt2 = new THREE.Mesh(new THREE.CubeGeometry(8, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall07pt2.position.set(-26, 0, 0);
var wall07pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall07pt3.position.set(-16, 10, 0);
wall07.add(wall07pt2, wall07pt3);

//Toilet to utility
var wall08 = new THREE.Mesh(new THREE.CubeGeometry(40, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall08.rotation.y += Math.PI * 90/180;
wall08.position.set(-40, 12, 10);

//Hallway to kitchen
var wall09 =  new THREE.Mesh(new THREE.CubeGeometry(20, 24, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall09.position.set(5, 12, -10);
var wall09pt2 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), new THREE.MeshPhongMaterial({color:0xffffff}));
wall09pt2.position.set(-16, 10, 0);
wall09.add(wall09pt2);


//==================MISC====================

//Stairs
var stairs = new THREE.Mesh(new THREE.CubeGeometry(15,2,4),  new THREE.MeshPhongMaterial({color:0x0099CC}));
stairs.castShadow = true;
stairs.receiveShadow = true;
stairs.position.set(7,1,48);

var st1 = stairs.clone(); st1.position.set(0,2,-4);
var st2 = stairs.clone(); st2.position.set(0,4,-8);
var st3 = stairs.clone(); st3.position.set(0,6,-12);
var st4 = stairs.clone(); st4.position.set(0,8,-16);
var st5 = stairs.clone(); st5.position.set(0,10,-20);
var st6 = stairs.clone(); st6.position.set(0,12,-24);
var st7 = stairs.clone(); st7.position.set(0,14,-28);
var st8 = stairs.clone(); st8.position.set(0,16,-32);
var st9 = stairs.clone(); st9.position.set(0,18,-36);
var st10 = stairs.clone(); st10.position.set(0,20,-40);
var st11 = stairs.clone(); st11.position.set(0,22,-44);
var st12 = stairs.clone(); st12.position.set(0,22,-48);
stairs.add(st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11, st12);
scene.add(stairs);

var axis = new THREE.AxisHelper(100);
scene.add(axis);



var allWalls = [frontWallLeft, frontWallRight, rightSideWall, leftWall01, wall01, wall02, wall03, wall04, wall04Pt2, wall04Pt3, wall05, wall06, wall07, wall08, wall09];

//Saves repetition when applying to many objects
function addObjectsToScene(){
    for (i = 0; i< allWalls.length; i++){
        allWalls[i].castShadow = true;
        allWalls[i].receiveShadow = true;
        scene.add(allWalls[i]);
    }
    
    for (i = 0; i <doors.length; i++){
        doors[i].castShadow = true;
        doors[i].receiveShadow = true;
        scene.add(doors[i]);        
    }
}
addObjectsToScene();


//-------------------------------------------------------------
//-------------------------ANIMATION---------------------------
//-------------------------------------------------------------
var doorStatus = "closed";

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
    if (KeysPressed[69]){ if (doorStatus != "moving"){ doorInteract(7); }}
    
    requestAnimationFrame(RenderLoop);
}
RenderLoop();

