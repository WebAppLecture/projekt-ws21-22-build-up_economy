import { Skin } from "./Skin.js";

let skinStyle = document.querySelector("#skin"),
    skins = ["assignan"];

window.skin = new Skin(skinStyle, skins, "./src/css/");

skin.activeSkin = "assignan";

