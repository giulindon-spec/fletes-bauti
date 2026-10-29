
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// =====================================
// 1. CONFIGURACIÓN DEL JUEGO
// =====================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9dbed0);
scene.fog = new THREE.Fog(0x9dbed0, 35, 110);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

renderer.domElement.style.touchAction = "none";
document.getElementById("game-container").appendChild(renderer.domElement);

// Luces
scene.add(new THREE.HemisphereLight(0xffffff, 0x68745a, 2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
sunlight.position.set(-12, 22, 12);
sunlight.castShadow = true;
scene.add(sunlight);

// =====================================
// 2. FUNCIONES PARA CREAR OBJETOS
// =====================================

function box(width, height, depth, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

// =====================================
// 3. CIUDAD Y CALLE
// =====================================

scene.add(box(100, 0.3, 150, 0x718b62, 0, -0.2, -30));
scene.add(box(12, 0.12, 150, 0x41464c, 0, -0.02, -30));

// Líneas de la calle
for (let z = 30; z > -110; z -= 9) {
  scene.add(box(0.18, 0.04, 4, 0xe8e3ce, 0, 0.06, z));
}

// Veredas
scene.add(box(4, 0.2, 150, 0xb8b4a8, -8, 0, -30));
scene.add(box(4, 0.2, 150, 0xb8b4a8, 8, 0, -30));

// Casas
function createHouse(x, z, color) {
  const house = new THREE.Group();

  house.add(box(7, 5, 7, color, 0, 2.5, 0));
  house.add(box(7.8, 0.45, 7.8, 0x51433c, 0, 5.2, 0));

  // Puerta y ventanas
  house.add(box(1.1, 2.1, 0.12, 0x65452f, 0, 1.05, 3.57));
  house.add(box(1.3, 1.2, 0.12, 0x9cc8d6, -2, 2.8, 3.57));
  house.add(box(1.3, 1.2, 0.12, 0x9cc8d6, 2, 2.8, 3.57));

  house.position.set(x, 0, z);
  scene.add(house);
}

for (let z = 15; z > -95; z -= 17) {
  createHouse(-13, z, 0xd7c1a4);
  createHouse(13, z, 0xc9b4aa);
}

// Árboles
function createTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 2, 10),
    new THREE.MeshStandardMaterial({ color: 0x725039 })
  );

  trunk.position.set(x, 1, z);
  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x47764b })
  );

  leaves.position.set(x, 2.8, z);
  scene.add(leaves);
}

for (let z = 20; z > -100; z -= 12) {
  createTree(-6, z);
  createTree(6, z);
}

// =====================================
// 4. CAMIÓN
// =====================================

const truck = new THREE.Group();

truck.position.set(0, 0, 5);
scene.add(truck);

// Plataforma de carga
truck.add(box(3.7, 0.35, 4.8, 0x555b61, 0, 0.55, 0));

// Laterales de la caja
truck.add(box(0.15, 2.2, 4.8, 0xe2e5e8, -1.85, 1.65, 0));
truck.add(box(0.15, 2.2, 4.8, 0xe2e5e8, 1.85, 1.65, 0));

// Techo de carga
truck.add(box(3.8, 0.18, 4.9, 0xd5dbe0, 0, 2.8, 0));

// Cabina delantera
truck.add(box(3.4, 2.4, 2.3, 0x1768bd, 0, 1.7, -3.2));

// Parabrisas
truck.add(box(2.7, 1.1, 0.08, 0x91c8dc, 0, 2.05, -4.38));

// Paragolpes
truck.add(box(3.5, 0.35, 0.35, 0x30343a, 0, 0.65, -4.45));

// Ruedas
for (const x of [-1.9, 1.9]) {
  for (const z of [-3.1, 1.5]) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0x202020 })
    );

    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.65, z);
    wheel.castShadow = true;
    truck.add(wheel);
  }
}

// Puertas traseras con bisagras
const leftDoor = new THREE.Group();
const rightDoor = new THREE.Group();

leftDoor.position.set(-1.75, 1.65, 2.45);
rightDoor.position.set(1.75, 1.65, 2.45);

leftDoor.add(box(1.75, 2.2, 0.12, 0xb8c5cf, 0.875, 0, 0));
rightDoor.add(box(1.75, 2.2, 0.12, 0xb8c5cf, -0.875, 0, 0));

truck.add(leftDoor, rightDoor);

// =====================================
// 5. ZONA DE DESCARGA
// =====================================

const deliveryZone = box(
  5, 0.08, 5,
  0x9bbd81,
  4, 0.12, -20
);

scene.add(deliveryZone);

const targetHouse = new THREE.Group();

targetHouse.add(box(7, 5, 7, 0xe0c7a8, 0, 2.5, 0));
targetHouse.add(box(7.8, 0.5, 7.8, 0x745448, 0, 5.2, 0));
targetHouse.add(box(1.1, 2.1, 0.15, 0x65452f, 0, 1.05, 3.6));

targetHouse.position.set(10, 0, -20);
scene.add(targetHouse);

// =====================================
// 6. CAJAS
// =====================================

const boxes = [];
const loadedBoxes = [];

const boxColors = [0xb98250, 0xc99560, 0xa87343];

function createPackage(x, z, index) {
  const packageGroup = new THREE.Group();

  const carton = box(
    1.15, 1.1, 1.15,
    boxColors[index],
    0, 0, 0
  );

  packageGroup.add(carton);

  // Cinta de embalaje
  packageGroup.add(box(0.12, 1.12, 1.17, 0xe5d5b7, 0, 0, 0));
  packageGroup.add(box(1.17, 1.12, 0.12, 0xe5d5b7, 0, 0, 0));

  packageGroup.position.set(x, 0.7, z);
  packageGroup.userData.isPackage = true;
  packageGroup.userData.packageIndex = index;

  scene.add(packageGroup);
  boxes.push(packageGroup);
}

for (let i = 0; i < 3; i++) {
  createPackage(-3 + i * 3, 13, i);
}

// =====================================
// 7. PERSONAJE PROVISORIO: BAUTI
// =====================================

function createBauti() {
  const character = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({ color: 0xd9a47f });
  const hair = new THREE.MeshStandardMaterial({ color: 0x35251f });
  const clothes = new THREE.MeshStandardMaterial({ color: 0x273c60 });

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.42, 0.9, 5, 12),
    clothes
  );

  body.position.y = 1.1;
  character.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 24, 24),
    skin
  );

  head.position.y = 2.05;
  character.add(head);

  for (let i = 0; i < 12; i++) {
    const curl = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 12, 12),
      hair
    );

    const angle = (i / 12) * Math.PI * 2;
    curl.position.set(
      Math.cos(angle) * 0.3,
      2.35 + Math.sin(angle) * 0.1,
      Math.sin(angle) * 0.3
    );

    character.add(curl);
  }

  character.position.set(-4, 0, 10);
  scene.add(character);
}

createBauti();

// =====================================
// 8. INTERFAZ
// =====================================

let stage = "loading";
let draggedBox = null;
let dragOffset = new THREE.Vector3();
let truckMoving = false;
let truckProgress = 0;
let doorProgress = 0;

const mission = document.getElementById("mission");
const instructions = document.getElementById("instructions");
const message = document.getElementById("message");

const loadButton = document.getElementById("load-button");
const driveButton = document.getElementById("drive-button");
const unloadButton = document.getElementById("unload-button");

// Los botones de carga y descarga ya no se usan.
// Ahora las cajas se arrastran directamente.
loadButton.style.display = "none";
unloadButton.style.display = "none";

driveButton.textContent = "➜ AVANZAR";
driveButton.disabled = true;

mission.textContent = "Misión 1: Cargá las cajas";
instructions.textContent = "Arrastrá cada caja hasta el interior del camión.";
message.textContent = "Tocá una caja y llevala al camión";

// =====================================
// 9. ARRASTRAR CON MOUSE O DEDO
// =====================================

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(
  new THREE.Vector3(0, 1, 0),
  -0.7
);

const dragPoint = new THREE.Vector3();

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (stage !== "loading" && stage !== "unloading") return;

  updatePointer(event);

  const selectable = stage === "loading"
    ? boxes
    : loadedBoxes;

  const hits = raycaster.intersectObjects(selectable, true);

  if (!hits.length) return;

  let selected = hits[0].object;

  while (selected.parent && !selectable.includes(selected)) {
    selected = selected.parent;
  }

  if (!selectable.includes(selected)) return;

  draggedBox = selected;

  // Guardar su posición mundial antes de separarla del camión.
  const worldPosition = new THREE.Vector3();
  draggedBox.getWorldPosition(worldPosition);

  if (draggedBox.parent !== scene) {
    scene.add(draggedBox);
    draggedBox.position.copy(worldPosition);
  }

  camera.updateMatrixWorld();
  raycaster.setFromCamera(pointer, camera);

  if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
    dragOffset.copy(draggedBox.position).sub(dragPoint);
  }

  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!draggedBox) return;

  updatePointer(event);

  if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
    draggedBox.position.x = dragPoint.x + dragOffset.x;
    draggedBox.position.z = dragPoint.z + dragOffset.z;
    draggedBox.position.y = 0.7;
  }
});

renderer.domElement.addEventListener("pointerup", () => {
  if (!draggedBox) return;

  if (stage === "loading") {
    const insideTruck =
      Math.abs(draggedBox.position.x - truck.position.x) < 1.55 &&
      draggedBox.position.z > truck.position.z - 2.1 &&
      draggedBox.position.z < truck.position.z + 2.1;

    if (insideTruck) {
      const index = loadedBoxes.length;
      const localPosition = new THREE.Vector3(
        -0.7 + (index % 2) * 1.4,
        1.15 + Math.floor(index / 2) * 1.15,
        -1.1 + (index % 2) * 1.5
      );

      scene.remove(draggedBox);
      truck.add(draggedBox);
      draggedBox.position.copy(localPosition);

      loadedBoxes.push(draggedBox);
      boxes.splice(boxes.indexOf(draggedBox), 1);

      message.textContent = `¡Caja cargada! ${loadedBoxes.length} de 3`;

      if (loadedBoxes.length === 3) {
        stage = "ready";
        driveButton.disabled = false;
        mission.textContent = "¡Camión listo!";
        instructions.textContent = "Todas las cajas están cargadas. ¡Vamos!";
        message.textContent = "¡Excelente! Ahora podés avanzar.";
      }
    } else {
      message.textContent = "Llevá la caja hasta el interior del camión.";
      // Si no entró, la caja vuelve a su lugar.
      scene.remove(draggedBox);
      const index = draggedBox.userData.packageIndex;
      createPackage(-3 + index * 3, 13, index);
    }
  } else if (stage === "unloading") {
    const inDeliveryZone =
      Math.abs(draggedBox.position.x - 4) < 3 &&
      Math.abs(draggedBox.position.z + 20) < 3;

    if (inDeliveryZone) {
      scene.remove(draggedBox);
      loadedBoxes.splice(loadedBoxes.indexOf(draggedBox), 1);

      message.textContent = `¡Caja entregada! Quedan ${loadedBoxes.length}`;

      if (loadedBoxes.length === 0) {
        stage = "complete";
        mission.textContent = "¡Mudanza completada!";
        instructions.textContent = "¡Terminaste tu primer trabajo!";
        message.textContent = "🏆 ¡Flete terminado!";
      }
    } else {
      message.textContent = "Arrastrá la caja hasta la zona marcada frente a la casa.";
    }
  }

  draggedBox = null;
});

// =====================================
// 10. MOVIMIENTO DEL CAMIÓN
// =====================================

driveButton.addEventListener("click", () => {
  if (stage !== "ready") return;

  stage = "driving";
  truckMoving = true;
  truckProgress = 0;

  driveButton.disabled = true;

  mission.textContent = "Misión 1: En camino";
  instructions.textContent = "El camión está viajando hacia la casa.";
  message.textContent = "¡Vamos hacia el destino!";
});

// =====================================
// 11. ABRIR Y CERRAR PUERTAS
// =====================================

function openDoors() {
  leftDoor.rotation.y = -doorProgress * 1.5;
  rightDoor.rotation.y = doorProgress * 1.5;
}

// =====================================
// 12. ANIMACIÓN
// =====================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (truckMoving) {
    truckProgress += delta * 0.22;
    truck.position.z = THREE.MathUtils.lerp(5, -15, Math.min(truckProgress, 1));

    if (truckProgress >= 1) {
      truckMoving = false;
      stage = "opening";

      mission.textContent = "Misión 1: Llegaste a destino";
      instructions.textContent = "Las puertas se están abriendo...";
      message.textContent = "¡Llegamos!";

      doorProgress = 0;
    }
  }

  if (stage === "opening") {
    doorProgress = Math.min(doorProgress + delta * 1.5, 1);
    openDoors();

    if (doorProgress >= 1) {
      stage = "unloading";
      mission.textContent = "Misión 1: Descargá las cajas";
      instructions.textContent = "Arrastrá las cajas hasta la zona marcada frente a la casa.";
      message.textContent = "¡Ya podés descargar!";
    }
  }

  // Cámara detrás del camión
  const desiredCamera = new THREE.Vector3(
    truck.position.x,
    6,
    truck.position.z + 14
  );

  camera.position.lerp(desiredCamera, 0.05);

  camera.lookAt(
    truck.position.x,
    1.2,
    truck.position.z - 5
  );

  renderer.render(scene, camera);
}

animate();

// =====================================
// 13. ADAPTAR A CELULAR Y COMPUTADORA
// =====================================

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

