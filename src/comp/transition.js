import { Database } from "./database.js";


//These lines take care of the switching between the windows by arrows at the bottom or button clicks on the top
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
    tbls = Array.from(document.querySelectorAll(".menu > .grid"));
    
document.querySelector(".previous").addEventListener("click", () => show(btns_top[(getUnhidden(tbls)+2)%3].dataset.table,tbls))
document.querySelector(".next").addEventListener("click", () => show(btns_top[(getUnhidden(tbls)+1)%3].dataset.table,tbls))
btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn.dataset.table,tbls)));


//This section allows us to call the settings and back ONLY IF a json file is loaded
let btn_settings = document.querySelector("#reset"),
    menus = Array.from(document.querySelectorAll(".menu"));

btn_settings.addEventListener("click", (btn) => {
    let ldfst = document.getElementById("loadfirst");
    if (ldfst.className === "hidden"){
        if (btn.target.innerHTML==="Settings") {
            btn.target.innerHTML="Back";
            show("settings",menus);
        } else if (btn.target.innerHTML==="Back") {
            btn.target.innerHTML="Settings";
            show("default",menus);
        }
    };
    
});


//Initializes the moon and sun functionality
document.querySelector("#primary").addEventListener("click", () => DataAs.weekPassed());
document.querySelector("#secondary").addEventListener("click", () => {
        document.createElement("a").href = window.open('./src/manual.html','manual','height=700,width=500')
    });


//Loads the main file
let DataAs = new Database();


