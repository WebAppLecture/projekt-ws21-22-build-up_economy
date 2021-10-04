export class Database {
    constructor() {
          this.db = new Dexie("assignan_database");
          this.db.version(1).stores({
              goods: 'name,income,total,valPU',
              buildings: 'name,cost,number'
          });
        this.assets = ["Wood","Stone","Silver","Marble","Glass","Gold","Grapes","Pottery","Furniture","Bread","Beef","Fish","spiritual food","GP"];
        this.asset_num = [5475,25,12,220,625,5,40,60,0,1250,700,300,0,2658];
        this.asset_VPU = [1.5,3,50,10,4,100,2.5,2,6.5,0.1,0.3,0.2,0,1];
        
        for (let i=0;i<this.assets.length;i++) {
            this.db.goods.put({name:this.assets[i],income:0,total:this.asset_num[i],valPU:this.asset_VPU[i]});
        }

        this.infstr = ["House","Storehouse","Fishing Hut","Farm","Gristmill","Carpentry","Fiddler's Green"];
        this.infstr_cost = [{"Wood":150,"Stone":100,"GP":475},{"Wood":450,"Stone":300,"GP":925},{"Wood":50,"Stone":20,"GP":140},
            {"Wood":500,"Stone":200,"GP":1900},{"Wood":100,"Stone":75,"GP":300},{"Wood":150,"Stone":100,"GP":550},
            {"Wood":125,"Stone":75,"GP":800}];
        this.infstr_num = [19,1,3,4,2,0,1];
        for (let j=0; j<this.infstr.length;j++) {
            this.db.buildings.put({name: this.infstr[j],cost:this.infstr_cost[j], number: this.infstr_num[j]})
        }
        
        this.createStatTot();
        this.createBuildings();
    };

    createStatTot() {
        let container = document.getElementById("stat-tot");
        let cell1 = document.createElement("div"), 
                cell2 = document.createElement("div"), 
                cell3 = document.createElement("div"),
                cell4 = document.createElement("div");
        cell1.className = "cell" 
        cell1.innerHTML = "Goods"
        cell2.className = "cell" 
        cell2.innerHTML = "Total Number"
        cell3.className = "cell" 
        cell3.innerHTML = "Value per Unit in GP"
        cell4.className = "cell" 
        cell4.innerHTML = "Total value of this asset"

        container.appendChild(cell1)
        container.appendChild(cell2)
        container.appendChild(cell3)
        container.appendChild(cell4)
        container.appendChild(document.createElement("hr"))
        container.appendChild(document.createElement("hr"))
        container.appendChild(document.createElement("hr"))
        container.appendChild(document.createElement("hr"))

        for (let i=0;i<this.assets.length;i++) {
            let cell1 = document.createElement("div"), 
                cell2 = document.createElement("div"), 
                cell3 = document.createElement("div"),
                cell4 = document.createElement("div");
            cell1.className = "cell" 
            cell1.innerHTML = this.assets[i]
            cell2.className = "cell" 
            cell2.innerHTML = this.asset_num[i]
            cell3.className = "cell" 
            cell3.innerHTML = this.asset_VPU[i]
            cell4.className = "cell" 
            cell4.innerHTML = this.asset_num[i]*this.asset_VPU[i]

            container.appendChild(cell1)
            container.appendChild(cell2)
            container.appendChild(cell3)
            container.appendChild(cell4)

            }
    };

    createBuildings() {
        let container = document.getElementById("build");
        let cell1 = document.createElement("div"), cell2 = document.createElement("div"), cell3 = document.createElement("div");
        cell1.className = "cell" 
        cell1.innerHTML = "Building"
        cell2.className = "cell" 
        cell2.innerHTML = "Cost of one building"
        cell3.className = "cell" 
        cell3.innerHTML = "Total number of buildings"

        container.appendChild(cell1)
        container.appendChild(cell2)
        container.appendChild(cell3)
        container.appendChild(document.createElement("hr"))
        container.appendChild(document.createElement("hr"))
        container.appendChild(document.createElement("hr"))

        for (let i=0;i<this.infstr.length;i++) {
            let cell1 = document.createElement("div"), cell2 = document.createElement("div"), cell3 = document.createElement("div");
            cell1.className = "cell" 
            cell1.innerHTML = this.infstr[i]
            cell2.className = "cell" 
            let txt ="";
            for (let x in this.infstr_cost[i]) {
                txt += x+":"+this.infstr_cost[i][x] +" ";
            };
            cell2.innerHTML = txt
            cell3.className = "cell" 
            cell3.innerHTML = this.infstr_num[i]

            container.appendChild(cell1)
            container.appendChild(cell2)
            container.appendChild(cell3)

            }
    };


    async putGood (Name,newInc,newTot){
        await this.db.goods.put({name: Name, income: newInc, total: newTot});
    };

    async addGood (Name,addInc,addTot){
        this.db.transaction("rw",this.db.goods, async () => {
            let aux = await this.db.goods.get(Name);
            aux.total = addTot;
            aux.income= addInc;
            await this.db.goods.put(aux);
        })
        
    };
    async getAllGoods () {
        let aux = await this.db.goods.bulkGet(this.assets);
        return aux;
    }

    async getGood (Name) {
        let aux = await this.db.goods.get(Name);
        return aux;
        }

    async getAllBuildings () {
        let aux = await this.db.buildings.bulkGet(this.infstr);
        return aux;
    }


    async buildBuilding (Name,Number){
        this.db.transaction("rw",this.db.goods,this.db.buildings, async()=>{
            let bui = await this.db.buildings.get(Name);
            console.log("Topl",bui.cost);
            Object.keys(bui.cost).forEach(async key => {
                console.log(key);
                let aux = await this.db.goods.get(key);
                if (-bui.cost[key]+aux.total < 0) {
                    console.log(key,bui.cost[key]-aux.total)
                    throw new Error('Not enough goods!');
                }
                else {
                    console.log("Enough",key,bui.cost[key],aux.total);
                    aux.total -= bui.cost[key];
                    await this.db.goods.put(aux)
                }
            });
        }).then( ()=>{
            this.db.transaction("rw",this.db.buildings,async()=>{
                let bui = await this.db.buildings.get(Name);
                console.log("bui number:",bui.number,"Number:",Number)
                bui.number += Number;
                await this.db.buildings.put(bui)
            })
        }).catch(err => {

            console.error(err.stack)
        })
    };


    async getBuilding (Name) {
        let aux = await this.db.buildings.get(Name);
        console.log(aux);
        return aux;
        }
}