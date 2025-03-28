// DOM Elements
const rollButton = document.getElementById("roll-button");
const auraNameElement = document.getElementById("aura-name");
const clickSound = document.getElementById("click-sound");
const gameContainer = document.querySelector(".game-container");


// Initialize aura text
auraNameElement.classList.add('aura-text');


// Aura definitions
const auras = [
  { name: "Common", weight: 50000 },
  { name: "Uncommon", weight: 25000 },
  { name: "Good", weight: 20000 },
  { name: "Natural", weight: 12500 },
  { name: "Rare", weight: 6250 },
  { name: "Divinus", weight: 3125 },
  { name: "Crystallized", weight: 1562 },
  { name: "Pink Star", weight: 1000 },
  { name: "Rage", weight: 781 },
  { name: "Topaz", weight: 667 },
  { name: "Ruby", weight: 286 },
  { name: "Forbidden", weight: 248 },
  { name: "Emerald", weight: 200 },
  { name: "Gilded", weight: 195 },
  { name: "Ink", weight: 143 },
  { name: "Jackpot", weight: 129 },
  { name: "Nothing", weight: 8500 }
];


const totalWeight = auras.reduce((sum, aura) => sum + aura.weight, 0);


// Audio initialization
function initAudio() {
  if (!clickSound) return;
  clickSound.volume = 0;
  clickSound.play()
    .then(() => {
      clickSound.pause();
      clickSound.currentTime = 0;
      clickSound.volume = 1;
    })
    .catch(e => console.warn("Audio init failed:", e));
}


// Mobile Safari workaround
document.body.addEventListener('touchstart', initAudio, { once: true });
window.addEventListener('load', initAudio);


// Sound playback
async function playSound() {
  if (!clickSound) return;
  try {
    clickSound.currentTime = 0;
    await clickSound.play();
  } catch (e) {
    console.warn("Audio playback error:", e);
  }
}


// Dynamic text scaling to fill container
function scaleAuraText() {
  // Reset styles
  auraNameElement.style.transform = 'scale(1)';
  auraNameElement.style.whiteSpace = 'nowrap';
  auraNameElement.style.left = '50%';
  auraNameElement.style.transform = 'translateX(-50%) scale(1)';
 
  // Special handling for Crystallized
  const isCrystallized = auraNameElement.textContent === "Crystallized";
  if (isCrystallized) {
    auraNameElement.classList.add('crystallized');
  } else {
    auraNameElement.classList.remove('crystallized');
  }
 
  // Force reflow for accurate measurements
  void auraNameElement.offsetWidth;
 
  // Get dimensions with 10% margin
  const maxWidth = gameContainer.clientWidth * 0.9;
  const textWidth = auraNameElement.scrollWidth;
 
  // Calculate scale
  let scale = Math.min(maxWidth / textWidth, 1);
 
  // Apply additional scaling for Crystallized
  if (isCrystallized) {
    scale *= 0.85; // 15% smaller than other auras
  }
 
  // Apply scaling with minimum limit
  const finalScale = Math.max(scale, 0.85);
  auraNameElement.style.transform = `translateX(-50%) scale(${finalScale})`;
}


// Aura color mapping
function getAuraColor(auraName) {
  const colors = {
    "Common": "gray", "Uncommon": "green", "Good": "blue",
    "Natural": "lightgreen", "Rare": "purple", "Divinus": "gold",
    "Crystallized": "cyan", "Pink Star": "pink", "Rage": "red",
    "Topaz": "orange", "Ruby": "darkred", "Forbidden": "darkpurple",
    "Emerald": "lime", "Gilded": "goldenrod", "Ink": "black",
    "Jackpot": "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
    "Nothing": "white"
  };
  return colors[auraName] || "white";
}


// Roll animation
function simulateRoll() {
  // Reset previous state
  auraNameElement.classList.remove('jackpot-effect');
  auraNameElement.style.background = "none";
  auraNameElement.style.webkitTextFillColor = "";
  rollButton.disabled = true;
 
  const duration = 2000;
  const startTime = performance.now();
  let lastUpdate = 0;
  const minInterval = 50;


  function updateAura(timestamp) {
    if (!lastUpdate) lastUpdate = timestamp;
    const elapsed = timestamp - startTime;
    const progress = elapsed / duration;
   
    if (timestamp - lastUpdate >= minInterval + (200 * progress)) {
      const randomAura = auras[Math.floor(Math.random() * auras.length)];
      auraNameElement.textContent = randomAura.name;
      auraNameElement.style.color = getAuraColor(randomAura.name);
      scaleAuraText();
      playSound();
      lastUpdate = timestamp;
    }


    if (elapsed < duration) {
      requestAnimationFrame(updateAura);
    } else {
      determineFinalAura();
      rollButton.disabled = false;
    }
  }


  requestAnimationFrame(updateAura);
}


// Final aura determination
function determineFinalAura() {
  const randomNumber = Math.random() * totalWeight;
  let cumulativeWeight = 0;


  for (const aura of auras) {
    cumulativeWeight += aura.weight;
    if (randomNumber <= cumulativeWeight) {
      displayFinalAura(aura);
      break;
    }
  }
}


// Display final aura
function displayFinalAura(aura) {
  auraNameElement.textContent = aura.name;
  auraNameElement.style.color = getAuraColor(aura.name);
 
  // Special treatments
  if (aura.name === "Jackpot") {
    auraNameElement.style.background = getAuraColor(aura.name);
    auraNameElement.style.webkitBackgroundClip = "text";
    auraNameElement.style.backgroundClip = "text";
    auraNameElement.style.webkitTextFillColor = "transparent";
    auraNameElement.classList.add('jackpot-effect');
  } else {
    auraNameElement.style.background = "none";
    auraNameElement.style.webkitTextFillColor = "";
  }
 
  scaleAuraText();
}


// Handle window resizing
window.addEventListener('resize', () => {
  if (auraNameElement.textContent) {
    scaleAuraText();
  }
});


// Initialize on first interaction
document.body.addEventListener('click', function init() {
  initAudio();
  document.body.removeEventListener('click', init);
}, { once: true });


// Event listeners
rollButton.addEventListener("click", simulateRoll);
