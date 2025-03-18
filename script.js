const rollButton = document.getElementById("roll-button");
const auraNameElement = document.getElementById("aura-name");

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

rollButton.addEventListener("click", () => {
  // Generate a random number between 0 and totalWeight
  const randomNumber = Math.random() * totalWeight;

  // Determine which aura is rolled based on weighted probability
  let cumulativeWeight = 0;
  for (const aura of auras) {
    cumulativeWeight += aura.weight;
    if (randomNumber <= cumulativeWeight) {
      auraNameElement.textContent = aura.name; // Set the aura name
      auraNameElement.style.color = getAuraColor(aura.name); // Set the aura name color

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
});

// Debugging: Display the number of times each aura has been rolled
function updateDebugLog() {
  console.log("--- Roll Counts ---");
  for (const aura of auras) {
    console.log(`${aura.name}: ${auraCounts[aura.name]}`);
  }
  console.log("------------------");
}