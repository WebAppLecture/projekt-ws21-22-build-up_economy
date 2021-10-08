export class Skin {

    constructor(target, skins, path) {
        this.target = target;
        this.skins = skins;
        this.path = path;
        this.activeSkin = this.skins[0];
    }

    set activeSkin(name) {
        if(this.skins.includes(name)) {
            this._activeSkin = name;
            this.target.setAttribute("href", this.path + name + "/" + name + ".css");
        }
    }
}