//-------------------------------------------------------------
//------------------------INITIALISATION-----------------------
//-------------------------------------------------------------
var KeysPressed = [];

var width = window.innerWidth - 10;
var height = window.innerHeight - 10;
var renderer = new THREE.WebGLRenderer({antialias: true});

//Scene
renderer.setSize(width, height);
renderer.setClearColor(0x778899, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = false;
renderer.shadowMapTye = THREE.PCFSoftShadowMap;


document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(45, width/ height, 0.1, 1000);
camera.position.z = 30;
camera.position.x = 0;
camera.position.y = 3;

//Light
/*var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,10,10);
scene.add(pointLight);*/

//spotlight
/*var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set (10, 100, 10);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
*/

//scene.add(spotLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 100, 10);
//scene.add( dirLight  );

var bluePoint = new THREE.PointLight(0x0033ff, 3, 150);
bluePoint.position.set( 70, 5, 70 );
//scene.add(bluePoint);
scene.add(new THREE.PointLightHelper(bluePoint, 3));
  
var greenPoint = new THREE.PointLight(0x33ff00, 1, 150);
greenPoint.position.set( -70, 5, 70 );
//scene.add(greenPoint);
scene.add(new THREE.PointLightHelper(greenPoint, 3));




var spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set( 0, 10, 0 );
spotLight.castShadow = true;

spotLight.penumbra = 0.4;
var spotlightHelper = new THREE.SpotLightHelper(spotLight);
  
/*var spotTarget = new THREE.Object3D();
spotTarget.position.set(11, 110, 11);
spotLight.target = spotTarget;*/
  
scene.add(spotLight);
//scene.add(new THREE.PointLightHelper(spotLight, 1));
scene.add(spotlightHelper);


//-------------------------------------------------------------
//-------------------------OBJECTS-----------------------------
//-------------------------------------------------------------

//plane
var pGeo = new THREE.PlaneGeometry(50, 50, 5, 8);
var pMat = new THREE.MeshPhongMaterial({color:0x005567, side: THREE.DoubleSide});
var plane = new THREE.Mesh( pGeo, pMat);
plane.rotation.x = Math.PI / 2;
plane.position.y -= 1;
plane.receiveShadow = true;
scene.add(plane);


//Sphere
var sphereGeo = new THREE.SphereGeometry(0.6, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
var sphereMaterial = new THREE.MeshNormalMaterial({color: 0xff6633});
var sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
sphere.position.x += 1.14;

//cylinder
var cGeo = new THREE.CylinderGeometry( 0.4, 0.4, 0.4, 32 );
var cMat = new THREE.MeshPhongMaterial( {color: 0xffff00} );
var c1 = new THREE.Mesh( cGeo, cMat );
var cedges = new THREE.EdgesHelper(c1, 0x000);
c1.rotation.x = Math.PI / 2;
c1.rotation.z = Math.PI / 2;
c1.position.x -= 1.3;
c1.position.z -= 1.2;
c1.add( cedges );

var c2 = c1.clone();
c2.position.z += 2.4;
var c3 = c1.clone();
c3.position.x += 2.6;
var c4 = c1.clone();
c4.position.x += 2.6;
c4.position.z += 2.4;
c1.castShadow = true;
c2.castShadow = true;
c3.castShadow = true;
c4.castShadow = true;


//Cube Object define
var cubeGeometry = new THREE.CubeGeometry(2, 0.75, 3);
var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff6633});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
var edges = new THREE.EdgesHelper(cube, 0x000);
edges.material.linewidth = 5;
cube.castShadow = true;
cube.add(edges);
cube.add(c1, c2, c3, c4); //Wheels
scene.add(cube);



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


//Render Loop
function render() {
    renderer.render(scene, camera);
    
    //cube.rotation.x += Math.PI * 0.0 / 180;
    //cube.rotation.y += Math.PI * 0.2 / 180;

    c1.rotation.x -= Math.PI * 1 / 180;
    c2.rotation.x -= Math.PI * 1 / 180;
    c3.rotation.x -= Math.PI * 1 / 180;
    c4.rotation.x -= Math.PI * 1 / 180;
    
    
    if (KeysPressed[39]){ camera.rotation.y -= Math.PI * 0.5 /180; } 
    if (KeysPressed[37]){ camera.rotation.y += Math.PI * 0.5 /180; } 
    if (KeysPressed[38]){ camera.rotation.x += Math.PI * 0.5 / 180; } 
    if (KeysPressed[40]){ camera.rotation.x -= Math.PI * 0.5 / 180; } 
    if (KeysPressed[87]){ camera.position.z -= 0.1; }
    if (KeysPressed[83]){ camera.position.z += 0.1; } 
    if (KeysPressed[68]){ camera.position.x += 0.1; }
    if (KeysPressed[65]){ camera.position.x -= 0.1; }
    
    
    requestAnimationFrame(render);
}
render();