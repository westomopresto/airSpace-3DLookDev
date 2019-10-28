// Require ThreeJS and any necessary extensions

global.THREE = require('three');
require('three/examples/js/curves/NURBSUtils');
require('three/examples/js/curves/NURBSCurve');
require('three/examples/js/loaders/GLTFLoader');
require('three/examples/js/controls/OrbitControls');


var airSpaceTEX = new THREE.TextureLoader().load( "textures/bt_color__airSpace_m_Base.png" );
var bldTEX = new THREE.TextureLoader().load( "lib/textures/bt_color__bld_m_Base.png" );
var lotTEX = new THREE.TextureLoader().load( "lib/textures/bt_color__lot_m_Base.png" );
var mountainTEX = new THREE.TextureLoader().load( "lib/textures/bt_color__mountain_ocean_m_Base.png" );
var restTEX = new THREE.TextureLoader().load( "lib/textures/bt_color__rest_m_Base.png" );

const canvas = document.querySelector('#canvas');

// the 1st color in our palette is our background
const background = new THREE.Color(0xf5f5f5)//palette.shift();
canvas.style.background = background;

// create an anti-aliased ThreeJS WebGL renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas
});
renderer.setPixelRatio(2);

// Enable Alpha to Coverage for alpha cutouts + depth test
const gl = renderer.getContext();
gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);

// Configure renderer
renderer.setClearColor(background, 1);
renderer.setPixelRatio(window.devicePixelRatio);

// Listen for window resizes
window.addEventListener('resize', () => resize());

// Create a scene and camera for 3D world
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);

// Create our custom wireframe shader material
const airSpaceMat = new THREE.MeshMaterial( { 
  map: airSpaceTEX,
  color: 0xffffff
} )
const bldMat = new THREE.MeshMaterial( { 
  map: bldTEX,
  color: 0xffffff
} )
const lotMat = new THREE.MeshMaterial( { 
  map: lotTEX,
  color: 0xffffff
} )
const mountainMat = new THREE.MeshMaterial( { 
  map: mountainTEX,
  color: 0xffffff
} )
const restMat = new THREE.MeshMaterial( { 
  map: restTEX,
  color: 0xffffff
} )

const clock = new THREE.Clock();


function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.Math.degToRad(camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;
  camera.updateProjectionMatrix();
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

const gltfLoaderC = new THREE.GLTFLoader();
        gltfLoaderC.load('https://raw.githubusercontent.com/westomopresto/threejs-practice/master/scene.glb', (gltf) => {
            const root = gltf.scene;
            const box = new THREE.Box3().setFromObject(root);
            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());  
            // set the camera to frame the box
            frameArea(boxSize * 1, boxSize, boxCenter, camera);

            // update the Trackball controls to handle the new size
            controls.maxDistance = boxSize * 10;
            controls.target.copy(boxCenter);
            controls.update();
        });


const gltfLoader = new THREE.GLTFLoader();
        //gltfLoader.load('https://raw.githubusercontent.com/westomopresto/airSpace-3DLookDev/master/lib/models/airSpace_09.glb', (gltf) => {
        gltfLoader.load('https://raw.githubusercontent.com/westomopresto/airSpace-3DLookDev/master/lib/models/airSpace_19.glb', (gltf) => {
        const city = gltf.scene;
            city.traverse( ( child ) => {
                if ( child instanceof THREE.Mesh ) {

                     if(child.name == "airSpace")
                    {
                      
                    }
                    else 
                    { 
                      child.material = new THREE.MeshMaterial( {
                        color: 0x000000}
                        );
                    }
                }
            });
            
        scene.add(city);
        
        }, console.log("loading city"), console.log("error loading city"));

// set up scene and start drawing

resize();
renderer.animate(update);
canvas.style.visibility = '';
update();
draw();


  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

function update () {
  const time = clock.getElapsedTime();
  //mesh.material.uniforms.time.value = time;
  draw();
}

function draw () {
  // render a single frame
  renderer.render(scene, camera);
}

function resize (width = window.innerWidth, height = window.innerHeight, pixelRatio = window.devicePixelRatio) {
  // handle window resize
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  draw();
}


function saveScreenshot () {
  // force a specific output size
  const width = 1920;
  const height = 1080;
  resize(width, height, 1);

  const dataURI = canvas.toDataURL('image/png');

  // revert to old size
  resize();

  // force download
  const link = document.createElement('a');
  link.download = 'Screenshot.png';
  link.href = dataURI;
  link.click();
}

