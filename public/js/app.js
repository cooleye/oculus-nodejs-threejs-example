var camera, scene, renderer;
var realcamera;
var guiVisible = true;

var mesh, effect, controls, controls2;

var meshes = [];
var meshparent = [];
var meshparent2 = [];

var cols = 50;
var rows = 30;
var tot = cols * rows;
var clock = new THREE.Clock();
var perlin;
init();
animate();


function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    perlin = new ImprovedNoise();

    //

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.useQuaternion = true;
    camera.position.x = 200;
    camera.position.y = 250;
    camera.position.z = -200;

    scene = new THREE.Scene();

    effect = new THREE.OculusRiftEffect( renderer, {worldScale: 1} );
    effect.setSize( window.innerWidth, window.innerHeight );

    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 4000;
    controls.lookSpeed = 3.0;
    controls.lookVertical = true;

    controls2 = new THREE.OculusControls( camera );

    document.body.appendChild( renderer.domElement );

    var	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    var geometry = new THREE.CubeGeometry( 100, 100, 200 );

    var texture = THREE.ImageUtils.loadTexture( 'js/textures/crate.gif' );
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, shading: THREE.FlatShading, map: texture } );

    for (var i=0; i<tot; i++) {

        meshparent2[i] = new THREE.Object3D();
        // meshparent2[i].position.y = 50;
        scene.add( meshparent2[i] );

        meshparent[i] = new THREE.Object3D();
        meshparent[i].position.y = 50;
        meshparent[i].position.x = -50;
        meshparent2[i].add( meshparent[i] );

        mesh = new THREE.Mesh( geometry, material );
        meshparent[i].add( mesh );
        meshes.push(mesh);

    }
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('keydown', keyPressed, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    realcamera.aspect = window.innerWidth / window.innerHeight;
    realcamera.updateProjectionMatrix();
    effect.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
}

function keyPressed(event) {
    if (event.keyCode === 72) { // H
        guiVisible = !guiVisible;
        document.getElementById('container').style.display = guiVisible ? "block" : "none";
    }
}

function animate() {
    requestAnimationFrame( animate );

    var t = clock.getElapsedTime();

    for (var i=0; i<meshes.length; i++) {
        var c = Math.floor(i % cols);
        var r = Math.floor(i / cols);
        meshparent2[i].rotation.y = (c * 3.142 * 2 / cols);
        meshparent[i].rotation.x = ((r+10) * 3.142 * 2 / (rows+20));
        meshes[i].position.z = 1400 - 1350 * perlin.noise(c*8/cols,r*8/rows,t/2);
    }

    controls.update( clock.getDelta() );
    controls2.update( clock.getDelta() );

    effect.render( scene, camera );
}
