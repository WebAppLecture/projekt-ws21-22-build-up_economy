import { Database } from "./database.js";

function show(elem,list) {
    list.forEach(e => e.classList.add("hidden"));
    document.querySelector("#"+elem).classList.remove("hidden")
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
    btn_right = document.querySelector(".next"),
    btn_settings = document.querySelector("#reset"),
    menus = Array.from(document.querySelectorAll(".menu"));

btn_left.addEventListener("click", () => show(btns_top[(getUnhidden(tbls)+2)%3].dataset.table,tbls))
btn_right.addEventListener("click", () => show(btns_top[(getUnhidden(tbls)+1)%3].dataset.table,tbls))
btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn.dataset.table,tbls)));

btn_settings.addEventListener("click", (btn) => {
    if (btn.target.innerHTML==="Settings") {
        btn.target.innerHTML="Back";
        show("settings",menus);
    }
    else if (btn.target.innerHTML==="Back") {
        btn.target.innerHTML="Settings";
        show("default",menus);
    }
    else {
        console.log("Something went wrong with the menu button.")
    }
});


let DataAs = new Database();

btn_weekpsd.addEventListener("click", () => DataAs.weekPassed())