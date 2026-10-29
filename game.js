
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bc9e8);
scene.fog = new THREE.Fog(0x9bc9e8, 35, 100);

// CÁMARA
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

// RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

document.getElementById("game-container").appendChild(renderer.domElement);

// LUCES
const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(-10, 20, 10);
scene.add(sunlight);

scene.add(new THREE.AmbientLight(0xffffff, 1.2));

// FUNCIÓN PARA CREAR FIGURAS
function createBox(width, height, depth, color, x, y, z) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color });
  const object = new THREE.Mesh(geometry, material);

  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;

  return object;
}

// SUELO
scene.add(createBox(100, 0.2, 120, 0x83a96a, 0, -0.2, -30));

// CALLE
scene.add(createBox(12, 0.08, 120, 0x454b52, 0, -0.05, -30));

// LÍNEAS DE LA CALLE
for (let z = 20; z > -100; z -= 10) {
  scene.add(createBox(0.18, 0.03, 4, 0xffffff, 0, 0, z));
}

// CIUDAD
function createCity() {
  const colors = [0xe8c7a1, 0xd7a3a3, 0xe5dfc4, 0xb8cbd5];

  for (let z = 15; z > -100; z -= 15) {
    for (const side of [-1, 1]) {
      const x = side * 11;

      const house = createBox(
        7,
        6,
        8,
        colors[Math.floor(Math.random() * colors.length)],
        x,
        3,
        z
      );

      scene.add(house);

      const roof = createBox(
        7.8, 0.5, 8.8,
        0x80594b,
        x, 6.2, z
      );

      scene.add(roof);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.35, 2),
        new THREE.MeshStandardMaterial({ color: 0x765035 })
      );

      trunk.position.set(side * 6, 1, z - 4);
      scene.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x397c45 })
      );

      leaves.position.set(side * 6, 2.5, z - 4);
      scene.add(leaves);
    }
  }
}

createCity();

// CAMIÓN
function createTruck() {
  const truck = new THREE.Group();

  // CAJA DE CARGA
  truck.add(createBox(3.8, 2.5, 4.5, 0xe5e8ec, 0, 2.1, 1.2));

  // CABINA
  truck.add(createBox(3.4, 2.5, 2.2, 0x1768bd, 0, 1.9, -2.2));

  // PARABRISAS
  truck.add(createBox(2.6, 1.1, 0.08, 0x8ed2ed, 0, 2.5, -3.32));

  // PARAGOLPES
  truck.add(createBox(3.5, 0.35, 0.3, 0x333333, 0, 0.65, -3.35));

  // RUEDAS
  for (const x of [-1.9, 1.9]) {
    for (const z of [-2.4, 1.9]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.35, 20),
        new THREE.MeshStandardMaterial({ color: 0x202020 })
      );

      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.65, z);
      truck.add(wheel);
    }
  }

  // PUERTAS TRASERAS
  truck.add(createBox(3.5, 2.3, 0.12, 0xb6c0ca, 0, 2.1, 3.48));

  truck.position.set(0, 0, 4);
  scene.add(truck);

  return truck;
}

const truck = createTruck();

// BAUTI: PERSONAJE PROVISORIO
function createBauti() {
  const character = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({ color: 0xe0ad85 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x35251f });
  const clothes = new THREE.MeshStandardMaterial({ color: 0x263e65 });

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.3, 0.5),
    clothes
  );

  body.position.y = 1.1;
  character.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.48, 20, 20),
    skin
  );

  head.position.y = 2.1;
  character.add(head);

  // RULOS
  for (let i = 0; i < 9; i++) {
    const curl = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 10, 10),
      hair
    );

    const angle = (i / 9) * Math.PI * 2;

    curl.position.set(
      Math.cos(angle) * 0.35,
      2.45 + Math.sin(angle) * 0.12,
      Math.sin(angle) * 0.3
    );

    character.add(curl);
  }

  character.add(
    createBox(0.8, 0.8, 0.45, 0x30343a, 0, 0.4, 0)
  );

  character.position.set(-4, 0, 3);
  scene.add(character);
}

createBauti();

// CAJAS PARA CARGAR
const boxes = [];
const loadedBoxes = [];

function placeBoxes() {
  const colors = [0xb98250, 0xc99560, 0xa87343];

  for (let i = 0; i < 3; i++) {
    const box = createBox(
      1.2, 1.2, 1.2,
      colors[i],
      -3 + i * 3,
      0.6,
      -1
    );

    scene.add(box);
    boxes.push(box);
  }
}

placeBoxes();

// ELEMENTOS DE LA PANTALLA
let stage = "loading";

const mission = document.getElementById("mission");
const instructions = document.getElementById("instructions");
const message = document.getElementById("message");

const loadButton = document.getElementById("load-button");
const driveButton = document.getElementById("drive-button");
const unloadButton = document.getElementById("unload-button");

// CARGAR CAJAS
loadButton.addEventListener("click", () => {
  if (stage !== "loading") return;

  boxes.forEach((box, index) => {
    scene.remove(box);

    const cargo = createBox(
      0.9, 0.9, 0.9,
      [0xb98250, 0xc99560, 0xa87343][index],
      -0.9 + (index % 2) * 1.8,
      1.3 + Math.floor(index / 2) * 0.95,
      0.2
    );

    cargo.userData.isCargo = true;
    truck.add(cargo);
    loadedBoxes.push(cargo);
  });

  stage = "driving";

  mission.textContent = "Misión 1: Llevá las cajas a destino";
  instructions.textContent = "¡Todo listo! Avanzá con el camión.";
  message.textContent = "¡Cajas cargadas!";

  loadButton.disabled = true;
  driveButton.disabled = false;
});

// AVANZAR
driveButton.addEventListener("click", () => {
  if (stage !== "driving") return;

  truck.position.z -= 12;

  stage = "unloading";

  mission.textContent = "Misión 1: Llegaste a destino";
  instructions.textContent = "Descargá las cajas del camión.";
  message.textContent = "¡Llegaste! Ahora descargá.";

  driveButton.disabled = true;
  unloadButton.disabled = false;
});

// DESCARGAR
unloadButton.addEventListener("click", () => {
  if (stage !== "unloading") return;

  loadedBoxes.forEach((box) => {
    truck.remove(box);
  });

  loadedBoxes.length = 0;

  stage = "complete";

  mission.textContent = "¡Misión 1 completada!";
  instructions.textContent = "¡Buen trabajo! Próximamente habrá más misiones.";
  message.textContent = "🏆 ¡Flete terminado!";

  unloadButton.disabled = true;
});

// CÁMARA
function animate() {
  requestAnimationFrame(animate);

  const targetCamera = new THREE.Vector3(
    truck.position.x,
    5.5,
    truck.position.z + 11
  );

  camera.position.lerp(targetCamera, 0.06);

  camera.lookAt(
    truck.position.x,
    1.5,
    truck.position.z - 5
  );

  renderer.render(scene, camera);
}

animate();

// AJUSTAR PANTALLA
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

