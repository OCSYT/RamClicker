const RAMElement = document.getElementById("RAM");
const RAMCounter = document.getElementById("RAMCounter");
const RAMIncreaseCounterParent = document.getElementById("RAMIncreaseParent");
const Menu = document.getElementById("Menu");
const ShopContent = document.getElementById("ShopContent");
const NotificationsContainer = document.getElementById("Notifications");
const RAMPerSecondCounter = document.getElementById("RAMPerSecondCounter");
const SoundIcon = document.getElementById("SoundIcon");
const FallingRamContainer = document.getElementById("FallingRamContainer");
const RamImageSrc = "./static/images/RamImage.svg";


const canvas = document.createElement("canvas");
canvas.id = "FallingRamCanvas";
canvas.style.pointerEvents = "none";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
FallingRamContainer.appendChild(canvas);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let RamSticks = [];
const MaxRamSticks = 25;
const RamImage = new Image();
RamImage.src = RamImageSrc;

function GetRandomInt(Max) {
  return Math.floor(Math.random() * Max);
}

function SpawnRamStick() {
  if (RamSticks.length >= MaxRamSticks) return;
  const Scale = 50 + Math.random() * 50;
  RamSticks.push({
    x: Math.random() * canvas.width,
    y: -100,
    width: Scale,
    height: Scale,
    speed: 2 + Math.random() * 2,
    angle: Math.random() * Math.PI * 2,
    spin: (1 + Math.random() * 2) / 50,
    scale: Scale,
  });
}

let LastUpdate = performance.now();

function UpdateRamSticks() {
  const Now = performance.now();
  const DeltaTime = (Now - LastUpdate) / 1000;
  LastUpdate = Now;

  for (let i = RamSticks.length - 1; i >= 0; i--) {
    const stick = RamSticks[i];
    stick.y += stick.speed * DeltaTime * 100;
    stick.angle += stick.spin * DeltaTime * 100;
    if (stick.y - stick.height > canvas.height) {
      RamSticks.splice(i, 1);
    }
  }
}

function DrawRamSticks(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const stick of RamSticks) {
    ctx.save();
    ctx.translate(stick.x + stick.width / 2, stick.y + stick.height / 2);
    ctx.rotate(stick.angle);
    ctx.drawImage(
      RamImage,
      -stick.width / 2,
      -stick.height / 2,
      stick.width,
      stick.height
    );
    ctx.restore();
  }
}

function AnimateRamSticks() {
  UpdateRamSticks();
  DrawRamSticks(canvas.getContext("2d"));
  requestAnimationFrame(AnimateRamSticks);
}

requestAnimationFrame(AnimateRamSticks);

document.addEventListener("keydown", (Event) => {
  if (Event.key === "Escape") {
    ToggleMenu();
  }
});

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
let CurrentPlayerData = DefaultPlayerData;

function ToggleSound() {
  CurrentPlayerData.Sound = !CurrentPlayerData.Sound;
  if (CurrentPlayerData.Sound) {
    Notification("Sound enabled.");
  } else {
    Notification("Sound disabled.");
  }
  UpdateSoundIcon(CurrentPlayerData.Sound);
}
function UpdateSoundIcon(Status) {
  if (Status) {
    SoundIcon.classList.add("fa-volume-high");
    SoundIcon.classList.remove("fa-volume-xmark");
  } else {
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
    CurrentPlayerData = DefaultPlayerData;
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

RAMElement.addEventListener("click", HandleRAMClick);
RAMElement.addEventListener("animationend", () => {
  RAMElement.classList.remove("RAMClick");
});

ShopContent.addEventListener("click", HandleShopClick);

function HandleRAMClick() {
  RAMElement.classList.add("RAMClick");
  CurrentPlayerData.RAMClicks += 1;
  UpdateRAMCounter(1);
}

function HandleShopClick(event) {
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
    Notification("Error fetching data!");
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
  if (document.hasFocus()) {
    SpawnRamStick();
  }
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
