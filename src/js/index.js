import { Skin } from "./Skin.js";

let skinStyle = document.querySelector("#skin"),
    skins = ["assignan"];


window.skin = new Skin(skinStyle, skins, "./src/css/");

//document.querySelector(".next").addEventListener("click", () => skinChanger.next());
//document.querySelector(".previous").addEventListener("click", () => skinChanger.previous());

skin.activeSkin = "assignan";

