import { Database } from "./database.js";

let btns = Array.from(document.querySelectorAll(".controls > button")),
    tbls = Array.from(document.querySelectorAll(".menu > table"));


btns.forEach(btn => btn.addEventListener("click", ()=> show(btn,tbls)));

function show(elem,list) {
    list.forEach(e => e.classList.add("hidden"));
    document.querySelector("table#"+elem.dataset.table).classList.remove("hidden")
}

async function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


let DataAs = new Database();

console.log(DataAs.getAllGoods(),DataAs.getAllBuildings())

DataAs.buildBuilding("Fishing Hut",1)


await Sleep(2000);
console.log(DataAs.getAllGoods(),DataAs.getAllBuildings())


