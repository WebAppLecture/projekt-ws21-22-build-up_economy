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
function clickPopup() {
    console.log("opening manual in popup");
    window.open('./src/manual.html','manual','height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
};

let btns_top = Array.from(document.querySelectorAll(".controls > button")),
    tbls = Array.from(document.querySelectorAll(".menu > .grid")),
    btn_weekpsd = document.querySelector("#primary"),
    btn_man = document.querySelector("#secondary"),
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
    } else if (btn.target.innerHTML==="Back") {
        btn.target.innerHTML="Settings";
        show("default",menus);
    }
});
btn_weekpsd.addEventListener("click", () => DataAs.weekPassed());
btn_man.addEventListener("click", () => document.createElement("a").href = clickPopup());
let DataAs = new Database();


