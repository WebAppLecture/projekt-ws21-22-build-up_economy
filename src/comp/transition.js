import { Database } from "./database.js";

function show(elem,list) {
    list.forEach(e => e.classList.add("hidden"));
    document.querySelector("#"+elem.dataset.table).classList.remove("hidden")
}
function getUnhidden(tbls) {
    let counter = 0, res = 0;
    tbls.forEach(tbl => {
        if (Array.from(tbl.classList).includes("hidden")===false) {res = counter};
        counter += 1
    })
    return res;
}



let btns_top = Array.from(document.querySelectorAll(".controls > button")),
    tbls = Array.from(document.querySelectorAll(".menu > .grid")),
    btn_weekpsd = document.querySelector("#primary"),
    btn_left = document.querySelector(".previous"),
    btn_right = document.querySelector(".next");


btn_left.addEventListener("click", () => show(btns_top[(getUnhidden(tbls)+2)%3],tbls))
btn_right.addEventListener("click", () => show(btns_top[(getUnhidden(tbls)+1)%3],tbls))
btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn,tbls)));




let DataAs = new Database();

btn_weekpsd.addEventListener("click", () => DataAs.weekPassed())