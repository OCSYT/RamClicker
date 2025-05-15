// DOM Elements
const RAMElement = document.getElementById("RAM");
const RAMCounter = document.getElementById("RAMCounter");
const RAMIncreaseCounterParent = document.getElementById("RAMIncreaseParent");
const Menu = document.getElementById("Menu");
const ShopContent = document.getElementById("ShopContent");
const NotificationsContainer = document.getElementById("Notifications");
const RAMPerSecondCounter = document.getElementById("RAMPerSecondCounter");
const SoundIcon = document.getElementById("SoundIcon");

function Notification(Message) {
  const NotificationElement = document.createElement("h1");
  NotificationElement.classList.add("RAMIncreaseStyle");
  NotificationElement.innerText = Message;
  NotificationElement.classList.add("Notification");
  NotificationsContainer.appendChild(NotificationElement);
  setTimeout(() => {
    NotificationElement.remove();
  }, 1000);
}

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
  RAMClicks: 0,
  Sound: true,
  CurrentUpgrades: [],
};
let CurrentPlayerData = Object.assign({}, DefaultPlayerData);

function ToggleSound() {
  CurrentPlayerData.Sound = !CurrentPlayerData.Sound;
  if (CurrentPlayerData.Sound) {
    Notification("Sound enabled.");
  } else {
    Notification("Sound disabled.");
  }
  UpdateSoundIcon(CurrentPlayerData.Sound);
}
function UpdateSoundIcon(Status){
  if(Status){
    SoundIcon.classList.add("fa-volume-high");
    SoundIcon.classList.remove("fa-volume-xmark");
  }
  else{
    SoundIcon.classList.add("fa-volume-xmark");
    SoundIcon.classList.remove("fa-volume-high");
  }
}

function SaveGame() {
  localStorage.setItem("RAMClickerSave", JSON.stringify(CurrentPlayerData));
  Notification("Game saved.");
}

function LoadGame() {
  const SavedData = localStorage.getItem("RAMClickerSave");
  if (SavedData) {
    CurrentPlayerData = JSON.parse(SavedData);
    UpdateRAMCounter(0);
    UpdateShopAvailability();
    Notification("Game loaded.");
  } else {
    Notification("No saved game found.");
  }
  UpdateSoundIcon(CurrentPlayerData.Sound);
}
function ResetGame() {
  const PrevSound = CurrentPlayerData.Sound;
  if (confirm("Are you sure you want to reset the game?")) {
    CurrentPlayerData = Object.assign({}, DefaultPlayerData);
    CurrentPlayerData.Sound = PrevSound;
    localStorage.removeItem("RAMClickerSave");
    UpdateRAMCounter(0);
    UpdateShopAvailability();
    Notification("Game reset.");
  } else {
    Notification("Game reset cancelled.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  LoadGame();
});

const API_URL = "https://cookie-upgrade-api.vercel.app/api/upgrades";

RAMElement.addEventListener("click", handleRAMClick);
RAMElement.addEventListener("animationend", () => {
  RAMElement.classList.remove("RAMClick");
});

ShopContent.addEventListener("click", handleShopClick);

function handleRAMClick() {
  RAMElement.classList.add("RAMClick");
  CurrentPlayerData.RAMClicks += 1;
  UpdateRAMCounter(1);
}

function handleShopClick(event) {
  const ShopItem = event.target;
  if (ShopItem.tagName === "BUTTON") {
    const ItemCost = parseInt(ShopItem.dataset.cost);
    const ItemName = ShopItem.dataset.name;
    if (CurrentPlayerData.RAMClicks >= ItemCost) {
      CurrentPlayerData.RAMClicks -= ItemCost;
      const Upgrade = {
        Name: ItemName,
        Increase: Number(ShopItem.dataset.increase),
      };
      CurrentPlayerData.CurrentUpgrades.push(Upgrade);
      UpdateRAMCounter(0);
      Notification(`Purchased upgrade: ${ItemName}`);
      UpdateShopAvailability();
    } else {
      Notification("Not enough RAM to purchase this upgrade.");
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
      const Available = Item.cost <= CurrentPlayerData.RAMClicks;
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
        isNaN(ItemCost) || ItemCost > CurrentPlayerData.RAMClicks;

      const HasUpgrade = CurrentPlayerData.CurrentUpgrades.some(
        (Upgrade) => Upgrade.Name === ShopItem.dataset.name
      );
      if (HasUpgrade) {
        ShopItem.classList.add("HasUpgrade");
      } else {
        try {
          ShopItem.classList.remove("HasUpgrade");
        } catch {}
      }
    }
  }
}

function CreateShopItem(Item, Available) {
  const ShopItem = document.createElement("button");
  const Name = NameOverrides[Item.name] || Item.name;
  ShopItem.innerText = `${Name} - Cost: ${Item.cost} RAM - ${Item.increase} RAM/s`;
  ShopItem.dataset.cost = Item.cost;
  ShopItem.dataset.increase = Item.increase;
  ShopItem.dataset.name = Name;

  const HasUpgrade = CurrentPlayerData.CurrentUpgrades.some(
    (Upgrade) => Upgrade.Name === Name
  );
  if (HasUpgrade) {
    ShopItem.classList.add("HasUpgrade");
  }

  ShopItem.disabled = !Available;
  ShopContent.appendChild(ShopItem);
}

let LastRAMNotification = null;
function UpdateRAMCounter(RAMIncrease) {
  RAMCounter.innerText =
    "Current RAM: " + Math.floor(CurrentPlayerData.RAMClicks).toFixed(2);

  let TotalRAMPerSecond = 0;
  CurrentPlayerData.CurrentUpgrades.forEach((Upgrade) => {
    TotalRAMPerSecond += Upgrade.Increase;
  });
  RAMPerSecondCounter.innerText = `RAM/s: ${TotalRAMPerSecond.toFixed(2)}`;

  if (RAMIncrease === 0) return;
  if (CurrentPlayerData.Sound) {
    const ClickSound = new Audio("./static/sounds/RamClick.wav");
    ClickSound.pause();
    ClickSound.currentTime = 0;
    ClickSound.play();
  }

  if (LastRAMNotification) {
    LastRAMNotification.remove();
  }

  const RAMIncreaseCounter = document.createElement("h1");
  RAMIncreaseCounter.classList.add("RAMIncreaseStyle");
  RAMIncreaseCounter.innerText = "+" + RAMIncrease.toFixed(2) + " RAM";
  RAMIncreaseCounter.classList.add("Notification");
  RAMIncreaseCounterParent.appendChild(RAMIncreaseCounter);
  LastRAMNotification = RAMIncreaseCounter;
  UpdateShopAvailability();

  setTimeout(() => {
    RAMIncreaseCounter.remove();
  }, 1000);
}

setInterval(() => {
  let TotalIncrease = 0;
  CurrentPlayerData.CurrentUpgrades.forEach((Upgrade) => {
    TotalIncrease += Upgrade.Increase;
  });
  CurrentPlayerData.RAMClicks += TotalIncrease;
  UpdateRAMCounter(TotalIncrease);
}, 1000);

InitShop();
