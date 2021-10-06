import { Database } from "./database.js";

function show(elem,list) {
    list.forEach(e => e.classList.add("hidden"));
    document.querySelector("#"+elem.dataset.table).classList.remove("hidden")
}




let btns_top = Array.from(document.querySelectorAll(".controls > button")),
    tbls = Array.from(document.querySelectorAll(".menu > .grid")),
    btn_weekpsd = document.querySelector("#primary");


btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn,tbls)));




let DataAs = new Database();

btn_weekpsd.addEventListener("click", () => DataAs.weekPassed())