// Our Javascript will go here.
const start_time = Date.now()
var elapsed_time = 0
var score =0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var model_loader = new THREE.GLTFLoader();
model_loader.crossOrigin = true

const geometry = new THREE.BoxGeometry(0.5,0.5,0.1);
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const missile_geometry = new THREE.ConeGeometry(0.1,0.2,16);
const missile_material = new THREE.MeshLambertMaterial( { color: 0x770001 } );
var star_geometry = new THREE.SphereGeometry(0.1);
var star_material = new THREE.MeshPhongMaterial({color:0xffd700});
const enemy_jet_geometry = new THREE.BoxGeometry(0.2,0.2,0.1);
const enemy_jet_material = new THREE.MeshPhongMaterial({color:0xee0000});
// console.log(geometry)
// var cube = new THREE.Mesh( geometry, material );
var cube = new THREE.Group();
// console.log(cube.geometry.isBufferGeometry)
model_loader.load(
    "./models/space_player1_.glb",
    function ( gltf ) {
        cube = gltf.scene.getObjectByName("Cube")
        cube.scale.set(0.071,0.071,0.071)
        cube.position.set(0,0,0)
        cube.rotation.x+=1.5
        // cube.rotation.z+=2
        cube.rotation.y+=3.15
        // cube.rotation.z+=2
        scene.add(cube)
        // console.log("hi")
        // console.log(cube)
        // console.log("hi")
        // console.log("spaceship")
        // cube = new THREE.Mesh( star.geometry, cube_material );
        // scene.add( cube );
    }, undefined, function ( error ) {
        console.error( error );
    } 
);
// scene.add( cube );

var missiles = [];
function shootMissile(){
    // console.log("shoot");
    var missile = new THREE.Mesh( missile_geometry, missile_material);
    // console.log(cube);
    missile.position.set(cube.position.x, cube.position.y, cube.position.z);
    missile.rotation.x+=0.5
    missiles.push(missile);
    console.log(missiles.length)
    scene.add(missile)
}
var enemy_missiles = [];
function shootEnemyMissile(x,y){
    console.log("shoot");
    var missile = new THREE.Mesh( missile_geometry, missile_material);
    // console.log(cube);
    missile.position.set(x, y, cube.position.z);
    missile.rotation.x-=0.5
    missile.rotation.z+=3
    enemy_missiles.push(missile);
    // console.log(enemy_missiles.length)
    scene.add(missile)
}
var stars=[];
var star = new THREE.Mesh()
model_loader.load(
    "./models/star1.glb",
    function ( gltf ) {
        star = gltf.scene.getObjectByName("Circle")
        // star.scale.set(0.2,0.2,0.2)
        // star.rotation.y+=1
        THREE.BufferGeometry.prototype.copy.call(star_geometry, star.geometry);
        star_material = star.material
        // console.log("star")
        // console.log(gltf.scene)
    }, undefined, function ( error ) {
        console.error( error );
    } 
);
// scene.add(star)
function addStars(){
    var star = new THREE.Mesh(star_geometry, star_material);
    star.position.set(-4+Math.random()*8,-4+Math.random()*8, cube.position.z);
    star.scale.set(0.1,0.1,0.1)
    star.rotation.x+=1
    stars.push(star)
    scene.add(star);
}

var enemy_jets = []
var enemy_grp = new THREE.Group()
model_loader.load(
    "./models/space2.glb",
    function ( gltf ) {
        enemy_grp = gltf.scene.getObjectByName("Text")
        enemy_grp.scale.set(0.2,0.2,0.2)
        enemy_grp.rotation.x+=2
        // cube = new THREE.Mesh( star.geometry, cube_material );
        // scene.add( cube );
    }, undefined, function ( error ) {
        console.error( error );
    } 
);
function addEnemyJets(){
    console.log("adding enemies")
    // var enemy_jet = new THREE.Mesh()
    var enemy_jet = new THREE.Group()
    for(var i=0;i<3;i++){
        // enemy_jet = new THREE.Mesh(enemy_jet_geometry, enemy_jet_material)
        enemy_jet = enemy_grp.clone()
        enemy_jet.position.set((Math.random()-0.5)*(3), 4+i, cube.position.z)
        enemy_jets.push(enemy_jet)
        scene.add(enemy_jet)
    }
}
var loader = new THREE.TextureLoader();
loader.crossOrigin = true
//Space background is a large sphere
var specmap = loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/96252/water-map-512.jpg");
var spacetex = loader.load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/96252/space.jpg", function(texture) {
    // this code makes the texture repeat
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    
    })
// set the texture as the map for the material
var mat = new THREE.MeshPhongMaterial( {map: spacetex} );
var spacesphereGeo = new THREE.SphereGeometry(100,100,100);

var spacesphere = new THREE.Mesh(spacesphereGeo,mat);

//spacesphere needs to be double sided as the camera is within the spacesphere
spacesphere.material.side = THREE.DoubleSide;

scene.add(spacesphere);


/* we need to add a light so we can see our cube - its almost
as if we're turning on a lightbulb within the room */
var light = new THREE.AmbientLight(0xFFFF00);
/* position the light so it shines on the cube (x, y, z) */
light.position.set(10, 0, 25);
scene.add(light);

var spotLight_plane = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
spotLight_plane.position.set( 0, 0, 50 ); 
spotLight_plane.target = cube
scene.add( spotLight_plane );

//create two spotlights to illuminate the scene
var spotLight = new THREE.SpotLight( 0xffffff ); 
spotLight.position.set( -100, 200, -90 ); 
spotLight.intensity = 2;
scene.add( spotLight );

var spotLight2 = new THREE.SpotLight( 0x5192e9 ); 
spotLight2.position.set( 100, -200, 90 ); 
spotLight2.intensity = 1.5;
scene.add( spotLight2 );


camera.position.z = 5;

var xSpeed = 0.1;
var ySpeed = 0.1;

var enemy_jet_ySpeed = 0.01;

var missile_speed = 0.05
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    // console.log("hi");
    var keyCode = event.which;
    if (keyCode == 87) {
        if (cube.position.y<(3.8))
           cube.position.y += ySpeed;
    } else if (keyCode == 83) {
        if (cube.position.y>(-3.5))
            cube.position.y -= ySpeed;
    } else if (keyCode == 65) {
        if (cube.position.x>(-5))
            cube.position.x -= xSpeed;
    } else if (keyCode == 68) {
        if (cube.position.x<(5))
            cube.position.x += xSpeed;
    } else if (keyCode == 32) {
        shootMissile();
    }
    // spotLight_plane.target = cube
};

var missile_to_del=[]
var i__ = 0;
var star_to_del = []
function star_plane_collision(){
    star_to_del=[]
    for(var i=0;i<stars.length;i++){
        stars[i].rotation.z+=0.01
        if(stars[i].position.distanceTo(cube.position)<0.4){
            star_to_del.push(stars[i])
            stars.splice(i,1)
            score+=5;
            break;
        }
    }
    for (var i=0 ; i<star_to_del.length;i++){
        console.log("removing stars")
        scene.remove(star_to_del[i])
    }
}
function missile_enemy_collision(){
    enemy_to_del=[]
    for(var i=0;i<missiles.length;i++){
        for(var j=0;j<enemy_jets.length;j++){
            // stars[i].rotation.y+=0.01
            if(missiles[i].position.distanceTo(enemy_jets[j].position)<0.15){
                console.log("coll enemy missile")
                scene.remove(missiles[i])
                scene.remove(enemy_jets[j])
                // missiles[i].visible=false
                // enemy_jets[j].visible=false
                missiles.splice(i,1)
                enemy_jets.splice(j,1)
                score+=10
                break;
            }
        }
    }
}
function plane_enemy_collision(){
    enemy_to_del=[]
    for(var j=0;j<enemy_jets.length;j++){
        // stars[i].rotation.y+=0.01
        if(cube.position.distanceTo(enemy_jets[j].position)<0.4){
            // console.log("coll enemy plane")
            enemy_jets[j].visible=false
            scene.remove(enemy_jets[j])
            enemy_jets.splice(j,1)
            score-=5
            break;
        }
    }
}
function plane_missile_collision(){
    enemy_to_del=[]
    for(var j=0;j<enemy_missiles.length;j++){
        // stars[i].rotation.y+=0.01
        if(cube.position.distanceTo(enemy_missiles[j].position)<0.4){
            console.log("coll enemy plane")
            enemy_missiles[j].visible=false
            scene.remove(enemy_missiles[j])
            enemy_missiles.splice(j,1)
            score-=5
            break;
        }
    }
}
for(var i =0;i<5;i++){
    addStars()
}
var enemy_jet_cooldown = 15
var flag = 1;   //changed to 1 at the start of every (enemy_jet_cooldown)th second and then changed back to zero
var flag2 = 1;
function animate() {
    requestAnimationFrame( animate );
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;    
    spacesphere.rotation.x -= 0.001;
    elapsed_time = Math.floor((Date.now()-start_time)/1000)
    document.getElementById("time").innerHTML = elapsed_time
    document.getElementById("score").innerHTML = score
    missile_to_del = []
    missiles.forEach(missile => {
        missile.position.y += missile_speed;
        if(missile.position.y>4 || !missile.visible){
            missile_to_del.push(missile)
        }
    });
    for(var i =0;i<missile_to_del.length;i++){
        scene.remove(missile_to_del[i])
        missiles.splice(i,1)
    }
    missile_to_del = []//enemy
    enemy_missiles.forEach(missile => {
        missile.position.y -= missile_speed;
        if(missile.position.y>4 || !missile.visible){
            missile_to_del.push(missile)
        }
    });
    for(var i =0;i<missile_to_del.length;i++){
        scene.remove(missile_to_del[i])
        enemy_missiles.splice(i,1)
    }
    if(stars.length<3){
        while(stars.length<5)
            addStars();
    }
    if(elapsed_time%enemy_jet_cooldown==4 && flag){
        addEnemyJets()
        flag=0
    }
    if(elapsed_time%enemy_jet_cooldown==5)
        flag=1
    enemy_jet_to_del = []
    enemy_jets.forEach(enemy_jet => {
        enemy_jet.position.y -= enemy_jet_ySpeed
        if(enemy_jet.position.y<-4 || !enemy_jet.visible){
            enemy_jet_to_del.push(enemy_jet)
        }
    });
    for(var i =0;i<enemy_jet_to_del.length;i++){
        scene.remove(enemy_jet_to_del[i])
        enemy_jets.splice(i,1)
    }
    if(elapsed_time%enemy_jet_cooldown==9 && enemy_jets.length>0 && flag2){
        shootEnemyMissile(enemy_jets[0].position.x, enemy_jets[0].position.y)
        flag2=0
    }
    if(elapsed_time%enemy_jet_cooldown==10 && enemy_jets.length>0){
        flag2=1
    }
    star_plane_collision();
    missile_enemy_collision();
    plane_enemy_collision();
    plane_missile_collision();
    renderer.render( scene, camera );
}
animate();
