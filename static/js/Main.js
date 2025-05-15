const RamElement = document.getElementById("Ram");
const RamCounter = document.getElementById("RamCounter");
const RamIncreaseCounterParent = document.getElementById("RamIncreaseParent");
const Menu = document.getElementById("Menu");
const ShopContent = document.getElementById("ShopContent");
const NameOverrides = {
  "Auto-Clicker": "Basic Memory Loop",
  "Enhanced Oven": "Cache Booster",
  "Cookie Farm": "Overclock Node",
  "Robot Baker": "Multi-Core Daemon",
  "Cookie Factory": "Memory Farm",
  "Magic Flour": "Quantum Stick",
  "Time Machine": "Virtual RAM Matrix",
  "Quantum Oven": "Neural Coprocessor",
  "Alien Technology": "Alien Bus Architecture",
  "Interdimensional Baker": "Interdimensional RAM Core",
};

ShopContent.addEventListener("click", function (event) {
  const ShopItem = event.target;
  if (
    ShopItem.tagName === "BUTTON" &&
    !ShopItem.classList.contains("HasUpgrade")
  ) {
    const ItemCost = parseInt(ShopItem.dataset.cost);
    const ItemName = ShopItem.dataset.name;
    if (CurrentPlayerData.RamClicks >= ItemCost) {
      CurrentPlayerData.RamClicks -= ItemCost;
      ShopItem.classList.add("HasUpgrade");
      UpdateRamCounter(0); // Update the counter to reflect the new RamClicks value
      console.log(`Purchased upgrade: ${ItemName}`);
    } else {
      console.log("Not enough Ram to purchase this upgrade.");
    }
  }
});

function ToggleMenu() {
  Menu.classList.toggle("Hidden");
}

const DefaultPlayerData = {
  RamClicks: 0,
  CurrentUpgrades: [],
};
let CurrentPlayerData = Object.assign({}, DefaultPlayerData);

const API_URL = "https://cookie-upgrade-api.vercel.app/api/upgrades";

const APIData = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  console.log(data);
  return data;
};

async function InitShop() {
  try {
    const Data = await APIData();
    for (let i = 0; i < Data.length; i++) {
      const Item = Data[i];
      const Available = Item.cost <= CurrentPlayerData.RamClicks;
      CreateShopItem(Item, Available);
    }
    UpdateShopAvailability();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function UpdateShopAvailability() {
  const ShopItems = ShopContent.children;
  for (let i = 0; i < ShopItems.length; i++) {
    const ShopItem = ShopItems[i];
    if (ShopItem.tagName === "BUTTON" && ShopItem.dataset.cost) {
      const ItemCost = parseInt(ShopItem.dataset.cost, 10);
      if (!isNaN(ItemCost) && ItemCost <= CurrentPlayerData.RamClicks) {
        ShopItem.disabled = false;
      } else {
        ShopItem.disabled = true;
      }
    }
  }
}
InitShop();

function CreateShopItem(Item, Available) {
  const ShopItem = document.createElement("button");
  const Name = NameOverrides[Item.name] || Item.name;
  ShopItem.innerText = `${Name} - Cost: ${Item.cost} Ram - ${Item.increase} Ram/s`;
  ShopItem.dataset.cost = Item.cost;
  ShopItem.dataset.name = Name;
  if (!Available) {
    ShopItem.disabled = true;
  }
  ShopContent.appendChild(ShopItem);
}

RamElement.addEventListener("click", function () {
  RamElement.classList.add("RamClick");
  CurrentPlayerData.RamClicks += 1;
  UpdateRamCounter(1);
  console.log("Clicks: " + CurrentPlayerData.RamClicks);
});

RamElement.addEventListener("animationend", () => {
  RamElement.classList.remove("RamClick");
});

function UpdateRamCounter(RamIncrease) {
  RamCounter.innerText =
    "Current Ram: " + Math.floor(CurrentPlayerData.RamClicks);
  if (RamIncrease == 0) return;
  const RamIncreaseCounter = document.createElement("h1");
  RamIncreaseCounter.classList.add("RamIncreaseStyle");
  RamIncreaseCounter.innerText = "+" + RamIncrease.toFixed(2) + " Ram";
  RamIncreaseCounter.classList.add("RamIncrease");
  RamIncreaseCounterParent.appendChild(RamIncreaseCounter);
  UpdateShopAvailability();
  setTimeout(() => {
    RamIncreaseCounter.remove();
  }, 1000);
}
