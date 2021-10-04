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

    get activeSkin() {
        return this._activeSkin;
    }

    next() {
        let index = this.skins.indexOf(this._activeSkin) + 1;
        index = index >= this.skins.length ? 0 : index;
        this.activeSkin = this.skins[index];
    }

    previous() {
        let index = this.skins.indexOf(this._activeSkin) - 1;
        index = index < 0 ? this.skins.length - 1 : index;
        this.activeSkin = this.skins[index];
    }

}