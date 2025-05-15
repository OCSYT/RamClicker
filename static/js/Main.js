// DOM Elements
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

const DefaultPlayerData = {
  RamClicks: 0,
  CurrentUpgrades: [],
};
let CurrentPlayerData = Object.assign({}, DefaultPlayerData);

const API_URL = "https://cookie-upgrade-api.vercel.app/api/upgrades";

RamElement.addEventListener("click", handleRamClick);
RamElement.addEventListener("animationend", () => {
  RamElement.classList.remove("RamClick");
});

ShopContent.addEventListener("click", handleShopClick);

function handleRamClick() {
  RamElement.classList.add("RamClick");
  CurrentPlayerData.RamClicks += 1;
  UpdateRamCounter(1);
  console.log("Clicks: " + CurrentPlayerData.RamClicks);
}

function handleShopClick(event) {
  const ShopItem = event.target;
  if (
    ShopItem.tagName === "BUTTON" &&
    !ShopItem.classList.contains("HasUpgrade")
  ) {
    const ItemCost = parseInt(ShopItem.dataset.cost);
    const ItemName = ShopItem.dataset.name;
    if (CurrentPlayerData.RamClicks >= ItemCost) {
      CurrentPlayerData.RamClicks -= ItemCost;
      const Upgrade = {
        Name: ItemName,
        Increase: Number(ShopItem.dataset.increase),
      };
      CurrentPlayerData.CurrentUpgrades.push(Upgrade);
      ShopItem.classList.add("HasUpgrade");
      UpdateRamCounter(0);
      console.log(`Purchased upgrade: ${ItemName}`);
    } else {
      console.log("Not enough Ram to purchase this upgrade.");
    }
  }
}

function ToggleMenu() {
  Menu.classList.toggle("Hidden");
}

async function APIData() {
  const response = await fetch(API_URL);
  const data = await response.json();
  console.log(data);
  return data;
}

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
      ShopItem.disabled =
        isNaN(ItemCost) || ItemCost > CurrentPlayerData.RamClicks;
    }
  }
}

function CreateShopItem(Item, Available) {
  const ShopItem = document.createElement("button");
  const Name = NameOverrides[Item.name] || Item.name;
  ShopItem.innerText = `${Name} - Cost: ${Item.cost} Ram - ${Item.increase} Ram/s`;
  ShopItem.dataset.cost = Item.cost;
  ShopItem.dataset.increase = Item.increase;
  ShopItem.dataset.name = Name;
  ShopItem.disabled = !Available;
  ShopContent.appendChild(ShopItem);
}

function UpdateRamCounter(RamIncrease) {
  RamCounter.innerText =
    "Current Ram: " + Math.floor(CurrentPlayerData.RamClicks);
  if (RamIncrease === 0) return;

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

setInterval(() => {
  let TotalIncrease = 0;
  CurrentPlayerData.CurrentUpgrades.forEach((Upgrade) => {
    TotalIncrease += Upgrade.Increase;
  });
  CurrentPlayerData.RamClicks += TotalIncrease;
  UpdateRamCounter(TotalIncrease);
}, 1000);

InitShop();
