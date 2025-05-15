const RamElement = document.getElementById("Ram");
const DefaultPlayerData = {
    RamClicks: 0
}
let CurrentPlayerData = Object.assign({}, DefaultPlayerData);

const API_URL = "https://cookie-upgrade-api.vercel.app/api/upgrades";

const APIData = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);
    return data;
}
console.log(APIData());

console.log(RamElement);

RamElement.addEventListener("click", function() {
    RamElement.classList.add("RamClick");
    CurrentPlayerData.RamClicks += 1;
    console.log('Clicks: ' + CurrentPlayerData.RamClicks);
});

RamElement.addEventListener("animationend", () => {
    RamElement.classList.remove("RamClick");
});