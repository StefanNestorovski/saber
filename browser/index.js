'use strict'

const { ipcRenderer } = require('electron')
var THREE = require('three');
var STLLoader = require('three-stl-loader')(THREE);

let canvas;
let ctx;

let x = 200;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var offset = [0, 0, 0];
var lb;
let euler;
window.onload = function () {

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  var geometry = new THREE.BoxGeometry();
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  var loader = new STLLoader()
  loader.load('./Lightsaber.stl', function (geometry) {
    var material = new THREE.MeshNormalMaterial()
    lb = new THREE.Mesh(geometry, material)
    scene.add(lb)
    lb.scale.x = 0.3;
    lb.scale.y = 0.3;
    lb.scale.z = 0.3;
  })

  camera.position.z = 5;
  var animate = function () {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	};

	animate();

  canvas = document.getElementById('gameCanvas');
  console.log(canvas);
  ctx = canvas.getContext('2d');
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    },
    methods: {
      updateRot: function (rot) {
        this.message = "let's go " + rot;
      }
    }
  })

  ipcRenderer.on('toRend', (e, data) => {
    if (data.updatedRot) {
      console.log(app)
      app.updateRot(data.updatedRot);
      if (data.updatedRot === "left") {
        x -= 20;
      } else if (data.updatedRot === "right") {
        x += 20;
      }
    	ctx.fillStyle = 'black';
    	ctx.fillRect(0,0 ,canvas.width,canvas.height);
    	ctx.fillStyle = 'white';
    	ctx.fillRect(x,canvas.height-30,20,20);
      //ipcRenderer.send('toMain', {'updated': true})
    }
  })

  ipcRenderer.on('toRendLine', (e, data) => {
    let q = data.substr(1, data.length - 2).split(", ");
    euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(parseFloat(q[1]), parseFloat(q[2]), parseFloat(q[3]), parseFloat(q[0])), "XYZ");
    // ctx.fillStyle = 'black';
    // ctx.fillRect(0,0 ,canvas.width,canvas.height);
    // ctx.fillStyle = 'white';
    // ctx.fillRect(x,canvas.height-30,5*euler.x,20);
    // ctx.fillRect(x+50,canvas.height-30,5*euler.y,20);
    // ctx.fillRect(x-50,canvas.height-30,5*euler.z,20);
    lb.rotation.x = euler.x - offset[0];
    lb.rotation.y = euler.y - offset[1];
    lb.rotation.z = euler.z - offset[2];
    app.updateRot(lb.rotation.x*90/Math.PI + ", " + lb.rotation.y*90/Math.PI + ", " + lb.rotation.z*90/Math.PI);
  })
}

function calibrate() {
  offset[0] = euler.x;
  offset[1] = euler.y;
  offset[2] = euler.z + Math.PI;
}
