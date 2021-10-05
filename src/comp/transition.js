import { Database } from "./database.js";

function show(elem,list) {
    list.forEach(e => e.classList.add("hidden"));
    document.querySelector("#"+elem.dataset.table).classList.remove("hidden")
}

async function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


let btns_top = Array.from(document.querySelectorAll(".controls > button")),
    tbls = Array.from(document.querySelectorAll(".menu > .grid"));


btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn,tbls)));




let DataAs = new Database();

console.log(DataAs.getAllGoods(),DataAs.getAllBuildings())

DataAs.buildBuilding("Fishing Hut",1)


await Sleep(200);
console.log(DataAs.getAllGoods(),DataAs.getAllBuildings())


DataAs.addGood("Furniture",0,10)
await Sleep(200);
console.log(DataAs.getAllGoods(),DataAs.getAllBuildings())
DataAs.createStatTot()
