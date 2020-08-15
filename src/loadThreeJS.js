const THREE = require("three");

module.exports = function loadThreeJS(homeSection, mobileWidth) {
  let scene, camera, renderer, starGeo, stars;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(
    mobileWidth ? window.innerWidth : window.innerWidth - 17,
    window.innerHeight
  );
  homeSection.appendChild(renderer.domElement);

  starGeo = new THREE.Geometry();

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );

    star.velocity = 0;
    star.acceleration = 0.0002;

    starGeo.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load(
    "https://firebasestorage.googleapis.com/v0/b/personal-web-a99ce.appspot.com/o/star.png?alt=media&token=3e3ef3c1-6cdb-42ff-82f7-5c518c913367"
  );
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 1,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  animate();

  function animate() {
    starGeo.vertices.forEach((p) => {
      p.velocity += p.acceleration;
      p.y -= p.velocity;

      if (p.y < -200) {
        p.y = 200;
        p.velocity = 0;
      }
    });

    starGeo.verticesNeedUpdate = true;
    stars.rotation.y += 0.002;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
};
