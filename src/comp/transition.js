import { Database } from "./database.js";

function show(elem,list) {
    list.forEach(e => e.classList.add("hidden"));
    document.querySelector("#"+elem.dataset.table).classList.remove("hidden")
}




let btns_top = Array.from(document.querySelectorAll(".controls > button")),
    tbls = Array.from(document.querySelectorAll(".menu > .grid"));


btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn,tbls)));




let DataAs = new Database();

DataAs.Sleep(200);
DataAs.computeYield();
