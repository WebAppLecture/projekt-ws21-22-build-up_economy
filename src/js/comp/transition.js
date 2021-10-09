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
    
document.querySelector(".previous").addEventListener("click", () => switchWindows(2));
document.querySelector(".next").addEventListener("click", () => switchWindows(1));
btns_top.forEach(btn => btn.addEventListener("click", ()=> show(btn.dataset.table,tbls)));


//This section allows us to call the settings and back ONLY IF a json file is loaded

document.querySelector("#reset").addEventListener("click", (btn) => { switchSettings(btn.target); });

//Subfunction for switching settings and back
function switchSettings(targ) {
    let menus = Array.from(document.querySelectorAll(".menu"));
    let ldfst = document.getElementById("loadfirst");
    if (ldfst.className === "hidden"){
        if (targ.innerHTML==="Settings") {
            targ.innerHTML="Back";
            show("settings",menus);
        } else if (targ.innerHTML==="Back") {
            targ.innerHTML="Settings";
            show("default",menus);
        }
    };
};

//subfunction for switching between windows
function switchWindows(offset) {
    show(btns_top[(getUnhidden(tbls)+offset)%3].dataset.table,tbls);
}

//Include keyboard
document.onkeydown = function(e) {e.repeat ? {} : ( keyPressed(e))};
function keyPressed(e) {
    if (e.ctrlKey  && e.keyCode == 83) {    //Speichern via STRG + S
        e.preventDefault();
        DataAs.saveDB();
    };
    if (e.ctrlKey  && e.keyCode == 76) {    //Laden via STRG + L
        e.preventDefault();
        document.getElementById('load').click();
    };
    switch(e.which) {
        case 37: // left
        switchWindows(2);
        break;

        case 13: // Enter
        DataAs.weekPassed();
        break;

        case 39: // right
        switchWindows(1);
        break;

        case 112: // F1
        manualCall();
        break;

        case 27: // ESC
        switchSettings(document.querySelector("#reset"));
        break;

        default: return; // Andere Tasten
    }
    e.preventDefault(); // Sperrt Standardaktion (zB Hilfe bei F1)
};

//subfunction for Manual
function manualCall() {
    document.createElement("a").href = window.open('./src/manual.html','manual','height=700,width=500')
};

//Initializes the moon and sun functionality
document.querySelector("#primary").addEventListener("click", () => DataAs.weekPassed());
document.querySelector("#secondary").addEventListener("click", () => { manualCall(); });


//Loads the main file
let DataAs = new Database();


