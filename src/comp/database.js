export class Database {
    constructor() {
          this.db = new Dexie("assignan_database");
          this.db.version(1).stores({
              goods: 'name,income,total,valPU',
              buildings: 'name,cost,number,yield_weekly,yield_const'
          });
        this.assets = ["Wood","Stone","Silver","Marble","Glass","Gold","Grapes","Pottery","Furniture","Bread","Wheat","Beef","Fish","spiritual food","GP"];
        this.asset_num = [5475,2500,12,220,625,5,40,60,0,1250,0,700,300,0,20658];
        this.asset_VPU = [1.5,3,50,10,4,100,2.5,2,6.5,0.1,0.1,0.3,0.2,0,1];
        this.population_adult = 144
        this.population_infant= 23
        this.housing = 0
        this.fame = 0
        this.total_value = 0
        for (let i=0;i<this.assets.length;i++) {
            this.db.goods.put({name:this.assets[i],income:0,total:this.asset_num[i],valPU:this.asset_VPU[i]});
        }

        this.infstr = ["House","Storehouse","Fishing Hut","Farm","Gristmill","Carpentry","Fiddler's Green"];
        this.infstr_cost = [{"Wood":150,"Stone":100,"GP":475},{"Wood":450,"Stone":300,"GP":925},{"Wood":50,"Stone":20,"GP":140},
            {"Wood":500,"Stone":200,"GP":1900},{"Wood":100,"Stone":75,"GP":300},{"Wood":150,"Stone":100,"GP":550},
            {"Wood":125,"Stone":75,"GP":800}];
        this.infstr_num  = [19,1,3,4,2,0,1];
        this.yield_weekly= [{},{},{"Fish": 48},{"Beef": 80, "Wheat": 100},{"Wheat": -200, "Bread": 200, "GP": 2},{"Wood": -4,"Furniture":4},{}];
        this.yield_const = [{"Housings":8},{"Stor-Res": 15000, "Stor-Food": 30000},{},{"Housings":4},{},{},{},];
        for (let j=0; j<this.infstr.length;j++) {
            this.db.buildings.put({name: this.infstr[j],cost:this.infstr_cost[j], 
                                    number: this.infstr_num[j],yield_weekly:this.yield_weekly[j],yield_const:this.yield_const[j]})
        }
        this.update();
    };

    async sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    async update(){
        await this.createStatBuild();
        await this.computeYield();
        await this.createStatTot();
    };


    async createStatTot() {
        let container = document.getElementById("stat-goods");
        container.innerHTML="";
        let cell1 = document.createElement("div"), 
                cell2 = document.createElement("div"), 
                cell3 = document.createElement("div"),
                cell4 = document.createElement("div"),
                cell5 = document.createElement("div");
        cell1.className = "cell" 
        cell1.innerHTML = "Goods"
        cell2.className = "cell" 
        cell2.innerHTML = "Total Number"
        cell5.innerHTML = "Income per Week"
        cell5.className = "cell"
        cell3.className = "cell" 
        cell3.innerHTML = "Value per Unit in GP"
        cell4.className = "cell" 
        cell4.innerHTML = "Total value of this asset"



        container.appendChild(cell1)
        container.appendChild(cell2)
        container.appendChild(cell5)
        container.appendChild(cell3)
        container.appendChild(cell4)
        for (let i=1;i<=5;i++){
            container.appendChild(document.createElement("hr"))
        };

        for (let i=0;i<this.assets.length;i++) {
            let cell1 = document.createElement("div"), 
                cell2 = document.createElement("div"), 
                cell3 = document.createElement("div"),
                cell4 = document.createElement("div"),
                cell5 = document.createElement("div");
            let aux = await this.db.goods.get(this.assets[i])
            cell1.className = "cell" 
            cell1.innerHTML = aux.name
            cell2.className = "cell" 
            cell2.innerHTML = aux.total
            cell3.className = "cell" 
            cell3.innerHTML = aux.valPU
            cell4.className = "cell" 
            cell4.innerHTML = aux.total*aux.valPU
            cell5.className = "cell"
            cell5.innerHTML = aux.income

            container.appendChild(cell1)
            container.appendChild(cell2)
            container.appendChild(cell5)
            container.appendChild(cell3)
            container.appendChild(cell4)

            }
    };

    async createStatBuild() {
        let container = document.getElementById("build");
        container.innerHTML="";
        let cell1 = document.createElement("div"), 
            cell2 = document.createElement("div"), 
            cell3 = document.createElement("div"),
            cell4 = document.createElement("div"),
            cell5 = document.createElement("div");
        cell1.className = "cell" 
        cell1.innerHTML = "Building"
        cell2.className = "cell" 
        cell2.innerHTML = "Cost"
        cell3.className = "cell" 
        cell3.innerHTML = "Number"
        cell4.className = "cell"
        cell4.innerHTML = "Build"
        cell5.className = "cell"
        cell5.innerHTML = "Yield"

        container.appendChild(cell1)
        container.appendChild(cell2)
        container.appendChild(cell3)
        container.appendChild(cell5)
        container.appendChild(cell4)
        
        for (let i=1;i<=5;i++){
            container.appendChild(document.createElement("hr"))
        };

        for (let i=0;i<this.infstr.length;i++) {
            let cell1 = document.createElement("div"), 
                cell2 = document.createElement("div"), 
                cell3 = document.createElement("div"),
                cell5 = document.createElement("div"),
                btn = document.createElement("button");
            let aux = await this.db.buildings.get(this.infstr[i])
            cell1.className = "cell" 
            cell1.innerHTML = aux.name
            cell2.className = "cell" 
            let txt_cost ="";
            for (let x in aux.cost) {
                txt_cost += x+": "+aux.cost[x] +" ";
            };
            cell2.innerHTML = txt_cost
            cell3.className = "cell" 
            cell3.innerHTML = aux.number
            cell5.className = "cell"
            let txt_yield = "";
            if (Object.keys(aux.yield_weekly) != 0) {
                let txt_yield_weekly ="";
                for (let x in aux.yield_weekly) {
                    txt_yield_weekly += x+": "+aux.yield_weekly[x] +" ";
                };
                txt_yield += "Weekly: "+txt_yield_weekly
            };
            if (Object.keys(aux.yield_const) != 0) {
                let txt_yield_const ="";
                for (let x in aux.yield_const) {
                    txt_yield_const += x+": "+aux.yield_const[x] +" ";
                };
                txt_yield += "Const: "+txt_yield_const
            };
            
            cell5.innerHTML = txt_yield


            btn.innerHTML   = "Build"
            btn.id          = "btn-build-"+aux.name
            btn.className   = "build"
            btn.addEventListener("click", ()=>this.buildBuilding(aux.name,1))
            

            container.appendChild(cell1)
            container.appendChild(cell2)
            container.appendChild(cell3)
            container.appendChild(cell5)
            container.appendChild(btn)

            }
    };

    
    computeYield() {
        return this.db.transaction("rw",this.db.goods,this.db.buildings, async()=>{
            let incomes = {},
                goods = {},
                number = {};
            (await this.db.buildings.bulkGet(this.infstr)).forEach((building, j) => {incomes[this.infstr[j]] = building.yield_weekly, number[this.infstr[j]]=building.number});
            //console.log(incomes,number);
            (await this.db.goods.bulkGet(this.assets)).forEach((res,k)=> {goods[this.assets[k]] = res});
            
            let goods_aux = {...goods};
            console.log("Before:",goods_aux);
            Object.keys(goods_aux).forEach(resource => goods_aux[resource].income = 0);
            Object.keys(incomes).forEach(building => {Object.keys(incomes[building]).forEach((resource,i) => { goods_aux[resource].income += Object.values(incomes[building])[i]*number[building];})});
            console.log(goods,goods_aux)
            goods = {...goods_aux}
            console.log("After:",goods);
            await this.db.goods.bulkPut(Object.values(goods));
        }).catch(err => {
            console.error(err.stack);
        });
    };
 
    async buildBuilding (name, number){
        this.db.transaction("rw",this.db.goods,this.db.buildings, async()=>{
            const building = await this.db.buildings.get(name),
                requiredGoods = Object.keys(building.cost),
                goods = {};
            (await this.db.goods.bulkGet(requiredGoods)).forEach((resource, i) => goods[requiredGoods[i]] = resource)
            console.log(goods)
            const buildable = requiredGoods.every(resourceName => goods[resourceName].total >= building.cost[resourceName])
            if(!buildable) {
                return
            }
            requiredGoods.forEach(resourceName => goods[resourceName].total -= building.cost[resourceName])
            console.log("Updated Goods:", Object.values(goods))
            await this.db.goods.bulkPut(Object.values(goods))
            building.number += number
            await this.db.buildings.put(building)
            console.log("built " + number +" more of this", building)
        }).then( () => { 
            this.update();
        }).catch(err => {
            console.error(err.stack)
        })
        
    };

    async putGood (Name,newInc,newTot){
        await this.db.goods.put({name: Name, income: newInc, total: newTot});
        this.update();
    };

    async addGood (Name,addInc,addTot){
        this.db.transaction("rw",this.db.goods, async () => {
            let aux = await this.db.goods.get(Name);
            aux.total += addTot;
            aux.income+= addInc;
            await this.db.goods.put(aux);
        })
        this.update();
    };

    async getAllGoods () {
        let aux = await this.db.goods.bulkGet(this.assets);
        return aux;
    };

    async getGood (Name) {
        let aux = await this.db.goods.get(Name);
        return aux;
    };

    async getAllBuildings () {
        let aux = await this.db.buildings.bulkGet(this.infstr);
        return aux;
    };





    async getBuilding (Name) {
        let aux = await this.db.buildings.get(Name);
        console.log(aux);
        return aux;
        }
}