const rollButton = document.getElementById("roll-button");
const auraNameElement = document.getElementById("aura-name");
const clickSound = document.getElementById("click-sound"); // Get the audio element

// Debugging: Check if the audio element is found
console.log("Audio element:", clickSound);

// Define a list of auras with their rarity (using integer weights)
const auras = [
  { name: "Common", weight: 50000 }, // 50% chance
  { name: "Uncommon", weight: 25000 }, // 25% chance
  { name: "Good", weight: 20000 }, // 20% chance
  { name: "Natural", weight: 12500 }, // 12.5% chance
  { name: "Rare", weight: 6250 }, // 6.25% chance
  { name: "Divinus", weight: 3125 }, // 3.125% chance
  { name: "Crystallized", weight: 1562 }, // 1.562% chance
  { name: "Pink Star", weight: 1000 }, // 1% chance
  { name: "Rage", weight: 781 }, // 0.781% chance
  { name: "Topaz", weight: 667 }, // 0.667% chance
  { name: "Ruby", weight: 286 }, // 0.286% chance
  { name: "Forbidden", weight: 248 }, // 0.248% chance
  { name: "Emerald", weight: 200 }, // 0.2% chance
  { name: "Gilded", weight: 195 }, // 0.195% chance
  { name: "Ink", weight: 143 }, // 0.143% chance
  { name: "Jackpot", weight: 129 }, // 0.129% chance
  { name: "Nothing", weight: 8500 }, // 8.5% chance (to make total 100%)
];

// Calculate the total weight of all auras
const totalWeight = auras.reduce((sum, aura) => sum + aura.weight, 0);

// Debugging: Track how many times each aura is rolled
const auraCounts = {};
for (const aura of auras) {
  auraCounts[aura.name] = 0;
}

// Function to get the color for each aura
function getAuraColor(auraName) {
  switch (auraName) {
    case "Common": return "gray";
    case "Uncommon": return "green";
    case "Good": return "blue";
    case "Natural": return "lightgreen";
    case "Rare": return "purple";
    case "Divinus": return "gold";
    case "Crystallized": return "cyan";
    case "Pink Star": return "pink";
    case "Rage": return "red";
    case "Topaz": return "orange";
    case "Ruby": return "darkred";
    case "Forbidden": return "darkpurple";
    case "Emerald": return "lime";
    case "Gilded": return "goldenrod";
    case "Ink": return "black";
    case "Jackpot": return "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)"; // Rainbow gradient
    default: return "white"; // Default color
  }
}

// Function to simulate the rapid switching effect
function simulateRoll() {
  let interval = 75; // Initial interval between switches (in milliseconds)
  const duration = 2000; // Total duration of the effect (in milliseconds)
  const startTime = Date.now();

  // Function to switch aura names and adjust the interval
  function switchAura() {
    const randomAura = auras[Math.floor(Math.random() * auras.length)];
    auraNameElement.textContent = randomAura.name;
    auraNameElement.style.color = getAuraColor(randomAura.name);

    // Play the click sound
    if (clickSound) {
      console.log("Playing sound..."); // Debugging
      clickSound.currentTime = 0; // Reset the sound to the beginning
      clickSound.play().then(() => {
        console.log("Sound played successfully!"); // Debugging
      }).catch((error) => {
        console.error("Error playing sound:", error); // Debugging
      });
    } else {
      console.error("Audio element not found!"); // Debugging
    }

    // Gradually slow down the switching
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= duration) {
      determineFinalAura(); // Determine and display the final aura
    } else {
      interval += 5; // Gradually increase the interval to slow down the switching
      setTimeout(switchAura, interval); // Recursively call switchAura with the new interval
    }
  }

  // Start the rapid switching effect
  switchAura();
}

// Function to determine the final aura
function determineFinalAura() {
  const randomNumber = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const aura of auras) {
    cumulativeWeight += aura.weight;
    if (randomNumber <= cumulativeWeight) {
      auraNameElement.textContent = aura.name; // Set the final aura name
      auraNameElement.style.color = getAuraColor(aura.name); // Set the final aura color

      // Handle gradient for "Jackpot"
      if (aura.name === "Jackpot") {
        auraNameElement.style.background = getAuraColor(aura.name); // Set gradient background
        auraNameElement.style.webkitBackgroundClip = "text"; // Clip background to text (for WebKit browsers)
        auraNameElement.style.backgroundClip = "text"; // Standard property
        auraNameElement.style.webkitTextFillColor = "transparent"; // Make text transparent
      } else {
        auraNameElement.style.background = "none"; // Reset background
        auraNameElement.style.webkitTextFillColor = ""; // Reset text fill color
      }

      auraCounts[aura.name]++;
      updateDebugLog();
      break;
    }
  }
}

// Add event listener to the roll button
rollButton.addEventListener("click", () => {
  simulateRoll(); // Start the rapid switching effect
});

// Debugging: Display the number of times each aura has been rolled
function updateDebugLog() {
  console.log("--- Roll Counts ---");
  for (const aura of auras) {
    console.log(`${aura.name}: ${auraCounts[aura.name]}`);
  }
  console.log("------------------");
}
