/* =========================
   DATA HEWAN NFT
========================= */

const animals = [
    {
        id: "ayam",
        nama: "Ayam",
        model: "assets/models/ayam.glb",
        suara: "assets/audio/ayam.mp3",
        marker: "assets/markers/wolf", // TANPA .fset
        scale: 0.5
    },
    {
        id: "wolf",
        nama: "WOLF",
        model: "assets/models/wolf.glb",
        suara: "assets/audio/wolf.mp3",
        marker: "assets/markers/wolf",
        scale: 0.5
    }
];

/* =========================
   GLOBAL STATE
========================= */

let currentObj = null;
let currentScale = 1;
let currentRotation = 0;
let currentSound = null;

window.addEventListener("load", function () {

    const namaHewan = document.getElementById("namaHewan");
    const controlUI = document.getElementById("controlUI");
    const scene = document.getElementById("scene");
    const assetContainer = document.getElementById("assetContainer");
    const loading = document.getElementById("loading");

    if (!scene || !assetContainer) {
        console.error("Scene belum siap!");
        return;
    }

    animals.forEach(animal => {

        /* =========================
           LOAD MODEL
        ========================== */

        const modelAsset = document.createElement("a-asset-item");
        modelAsset.setAttribute("id", animal.id + "Model");
        modelAsset.setAttribute("src", animal.model);
        assetContainer.appendChild(modelAsset);

        /* =========================
           LOAD AUDIO
        ========================== */

        const audio = document.createElement("audio");
        audio.setAttribute("id", animal.id + "Sound");
        audio.setAttribute("src", animal.suara);
        audio.setAttribute("preload", "auto");
        audio.setAttribute("playsinline", "");
        document.body.appendChild(audio);

        /* =========================
           NFT MARKER
        ========================== */

        const marker = document.createElement("a-nft");
        marker.setAttribute("type", "nft");
        marker.setAttribute("url", animal.marker); // TANPA ekstensi
        marker.setAttribute("smooth", "true");
        marker.setAttribute("smoothCount", "10");
        marker.setAttribute("smoothTolerance", ".01");
        marker.setAttribute("smoothThreshold", "5");

        /* =========================
           MODEL ENTITY
        ========================== */

        const entity = document.createElement("a-entity");
        entity.setAttribute("gltf-model", "#" + animal.id + "Model");
        entity.setAttribute("scale", `${animal.scale} ${animal.scale} ${animal.scale}`);
        entity.setAttribute("rotation", "0 0 0");
        entity.setAttribute("position", "0 0 0");

        marker.appendChild(entity);
        scene.appendChild(marker);

        /* =========================
           EVENTS
        ========================== */

        marker.addEventListener("markerFound", () => {

            currentObj = entity;
            currentScale = animal.scale;
            currentRotation = 0;
            currentSound = animal.id + "Sound";

            namaHewan.innerText = animal.nama;
            namaHewan.style.display = "block";
            controlUI.style.display = "flex";
        });

        marker.addEventListener("markerLost", () => {

            namaHewan.style.display = "none";
            controlUI.style.display = "none";
            currentObj = null;
        });

    });

    loading.style.display = "none";
});

/* =========================
   CONTROL FUNCTIONS
========================= */

function zoomIn() {
    if (!currentObj) return;
    currentScale += 0.1;
    currentObj.setAttribute("scale", `${currentScale} ${currentScale} ${currentScale}`);
}

function zoomOut() {
    if (!currentObj) return;
    currentScale -= 0.1;
    if (currentScale < 0.1) currentScale = 0.1;
    currentObj.setAttribute("scale", `${currentScale} ${currentScale} ${currentScale}`);
}

function rotateLeft() {
    if (!currentObj) return;
    currentRotation -= 15;
    currentObj.setAttribute("rotation", `0 ${currentRotation} 0`);
}

function rotateRight() {
    if (!currentObj) return;
    currentRotation += 15;
    currentObj.setAttribute("rotation", `0 ${currentRotation} 0`);
}

function playSound() {
    if (!currentSound) return;

    const audio = document.getElementById(currentSound);
    audio.pause();
    audio.currentTime = 0;

    audio.play().catch(() => {
        console.log("Autoplay diblokir browser");
    });
}