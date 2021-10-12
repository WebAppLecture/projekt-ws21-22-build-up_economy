export class Database {
    constructor() {
          this.db = new Dexie("assignan_database");
          this.db.version(1).stores({
              goods: 'name,income,total,valPU',
              buildings: 'name,cost,number,yield_weekly,yield_const,value,buildable,variable',
              time: 'name,year,week',
              population: 'name,total,adult,infant,housings',
              capacity: 'name,resources,food,prodmod,actres,actfood',
              diplomacy: 'name,fame,arcane',
              value: 'name,total,resources,buildings'
          });

        //Takes care of the possibility to load databases in case of missing data
        
        let btn_save = document.querySelector("button#save"),
            inp_load = document.querySelector("input#load");

            btn_save.addEventListener("click", () =>{
                this.saveDB();
            });
            inp_load.addEventListener("change", (e) => {
                let reader = new FileReader();
                reader.addEventListener("load", (ev) => this.loadDB(ev.target.result));
                reader.readAsText(e.target.files[0]);
            });
            
        //If there is no other possibility, one can recreate the village by uncommenting this command:
        //this.initDatabase();

        //Initializes the Settings button (which wont run without data!)
        this.initSettings();
        //If there is data available, the "json needed" message is cleared
        this.getAllGoods().then((goods)=>{
            if (Object.keys(goods).length > 0) {
                this.update();
            }
        })
    };

    //Initializes the Database with certain values - shouldnt be used anymore, since data is loaded via external json
    async initDatabase() {
        this.assets = ["Wood","Stone","Silver","Marble","Glass","Gold","Grapes","Pottery","Furniture","Bread","Wheat","Beef","Fish","Spiritual Food","GP"];
        this.asset_num = [5475,25,12,220,625,5,40,60,0,1250,0,700,300,0,2658];
        this.asset_VPU = [1.5,3,50,10,4,100,2.5,2,6.5,0.1,0.1,0.3,0.2,0,1];
        
        
        for (let i=0;i<this.assets.length;i++) {
            this.db.goods.put({name:this.assets[i],income:0,total:this.asset_num[i],valPU:this.asset_VPU[i]});
        }
        let goods = await this.getAllGoods();

        this.infstr = ["House","Storehouse","Fishing Hut","Farm","Gristmill","Carpentry","Fiddler's Green","Silver Mine - unskilled Workers","Silver Mine - skilled Workers","Fishing Village - Paris","Chapel - Lancellin","Inn","Docks"];
        this.infstr_cost = [{"Wood":150,"Stone":100,"GP":475},{"Wood":450,"Stone":300,"GP":925},{"Wood":50,"Stone":20,"GP":140},
            {"Wood":500,"Stone":200,"GP":1900},{"Wood":100,"Stone":75,"GP":300},{"Wood":150,"Stone":100,"GP":550},
            {"Wood":125,"Stone":75,"GP":800},{},{},{},{"GP": 600},{"GP": 800},{"GP": 6000}];
        this.infstr_num  = [19,1,3,4,2,0,1,15,4,1,1,1,1];
        this.yield_weekly= [{},{},{"Fish": 48},{"Beef": 80, "Wheat": 100},{"Wheat": -200, "Bread": 200, "GP": 2},{"Wood": -4,"Furniture":4},{},{"Silver": 0.064},{"Silver": 0.4},{"Fish": 100},{"Spiritual Food":240},{},{}];
        this.yield_const = [{"Housings":8},{"StorRes": 15000, "StorFood": 30000},{},{"Housings":4},{},{},{},{},{},{},{},{},{}];
        this.buildable = [true,true,true,true,true,true,true,false,false,false,false,false,false];
        this.variable = [false,false,false,false,false,false,false,true,true,false,false,false,false]
        for (let j=0; j<this.infstr.length;j++) {
            let valueBuilding = 0;
            Object.keys(this.infstr_cost[j]).forEach(resource =>{
                valueBuilding += this.infstr_cost[j][resource]*goods[resource].valPU
            })

            this.db.buildings.put({name: this.infstr[j],cost:this.infstr_cost[j], 
                                    number: this.infstr_num[j],yield_weekly:this.yield_weekly[j],yield_const:this.yield_const[j],
                                    value: valueBuilding,buildable:this.buildable[j],variable:this.variable[j]})
        }
        await this.db.time.put({name:"Time",year: 1132, week:30});
        await this.db.population.put({name:"Population",total:167,adult:144,infant:23,housings:0});
        await this.db.capacity.put({name:"Capacity",resources:0,food:0,prodmod:100});
        
        await this.db.diplomacy.put({name:"Diplomacy",fame: 2,arcane:1});
        await this.db.value.put({name:"Value",total: 0,resources:0,buildings:0});
    };

    //Is called when important things happen and an update is necessary
    async update(){
        this.getAllGoods().then((goods)=>{
            if (Object.keys(goods).length > 0) {
                let loadtxt = document.querySelector("#loadfirst");
                loadtxt.className ="hidden";
            }});
        let root = document.documentElement;
        let time_aux = await this.db.time.get("Time");
        let str = "'"+"Assignan " + time_aux.week +"/"+time_aux.year + " p.F."+"'";
        root.style.setProperty('--accent-content',str);
        await this.createStatGoods();
        await this.createStatBuild();
        await this.computeWeeklyYield();
        await this.computeConstantYield();
        await this.createStatGoods();
        await this.createStatTot();
        await this.initSettings();
    };

    //Initializing Settings page
    async initSettings() {
        await this.createItemsAdd();
        let add = document.getElementById("AddingGoods"),
            inputsItems = Array.from(add.querySelectorAll("input")),
            btn = add.querySelector("button"),
            ops = document.getElementById("opt");
        let abort = false;
        await btn.addEventListener("click", async () => {
            let inpValTot = inputsItems[1].value;
            if(inputsItems[0].value.length === 0 || inputsItems[1].value.length === 0){
                abort = true;
            }
            if (abort === false){
                if (ops.selectedOptions[0].text==="Remove") {
                     inpValTot *= -1;
                }
                await this.addGood(inputsItems[0].value,0,inpValTot*1,inputsItems[2].value*1)
            }
        });
        await this.createBuildingsAdd();
        let buildAdd = document.getElementById("AddingBuilds"),
            inputsBuilds = Array.from(buildAdd.querySelectorAll("input")),
            selectsBuilds = Array.from(buildAdd.querySelectorAll("select")),
            btnBuild = buildAdd.querySelector("button");
        
        await btnBuild.addEventListener("click", async () => {
            this.db.transaction("rw",this.db.buildings, async () => {
                    this.db.buildings.put({name: inputsBuilds[0].value,cost:{}, number: 1,yield_weekly: {[selectsBuilds[1].value]: inputsBuilds[2].value},
                        yield_const: {[selectsBuilds[0].value]: inputsBuilds[1].value}, value: 0,buildable: false,variable:selectsBuilds[2].value})}).then(
                            async () => {await this.update(); await this.createStatBuild();}
                        );  
        })
        
    };

    //Create new buildings, which are not buildable, but possibly with variable worker number
    async createBuildingsAdd () {
        let container = document.getElementById("settings");
        let head = document.createElement("h1"), Add = document.createElement("div");
        Add.id ="AddingBuilds";
        head.innerHTML = "Add new (unbuildable) sources of income";
        container.appendChild(head);
        let inpName = document.createElement("input");
        let builds = await this.getAllBuildings();
        inpName.placeholder="Add name"
        inpName.type = "text"
        inpName.required = true
        inpName.id="inpName"
        Add.appendChild(inpName);


        let optTotalYield = document.createElement("select"),
            optionempty = document.createElement("option"),
            optionHous = document.createElement("option"),
            optionStorRes = document.createElement("option"),
            optionStorFood = document.createElement("option");
        optionempty.value = 0;
        optionempty.innerText = "---"
        optionempty.selected ="selected";
        optionHous.innerText = "Housings";
        optionStorRes.innerText = "Storage Resources";
        optionStorRes.value ="StorRes";
        optionStorFood.innerText = "Storage Food";
        optionStorFood.value = "StorFood";
        optTotalYield.appendChild(optionempty);
        optTotalYield.appendChild(optionHous);
        optTotalYield.appendChild(optionStorRes);
        optTotalYield.appendChild(optionStorFood);
        Add.appendChild(optTotalYield)

        let inpTotalYieldNumber = document.createElement("input");
        inpTotalYieldNumber.placeholder="Constant Yield - Number"
        inpTotalYieldNumber.type = "number"
        inpTotalYieldNumber.id="inpTotalYieldNumber"
        Add.appendChild(inpTotalYieldNumber);


        let optWeeklyYield = document.createElement("select"),
        optionemptyWeekly = document.createElement("option");
        optionemptyWeekly.value = 0;
        optionemptyWeekly.innerText = "---";
        optionemptyWeekly.selected ="selected";
        let goods = await this.getAllGoods();
        Object.keys(goods).forEach(name => {
            let optGood = document.createElement("option");
            optGood.innerText = name;
            optGood.value = name;
            optWeeklyYield.appendChild(optGood);
        });
        optWeeklyYield.appendChild(optionemptyWeekly);
        Add.appendChild(optWeeklyYield)


        let inpWeeklyYieldNumber = document.createElement("input");
        inpWeeklyYieldNumber.placeholder="Weekly Income - Number"
        inpWeeklyYieldNumber.type = "number"
        inpWeeklyYieldNumber.id="inpWeeklyYieldNumber"
        Add.appendChild(inpWeeklyYieldNumber);

        let op = document.createElement("select"),
            option1 = document.createElement("option"),
            option2 = document.createElement("option");
        option1.innerText = "Number fixed to 1"
        option1.value = false
        option2.innerText = "Number variable";
        option2.value = true
        option2.selected = "selected";
        op.appendChild(option1);
        op.appendChild(option2);
        op.id ="optionsVary";
        Add.appendChild(op)

        let btn = document.createElement("button");
        btn.innerHTML="▶"
        Add.appendChild(btn)

        container.appendChild(Add);
    };

    //Create necessary HTML in settings page
    async createItemsAdd() {
        let container = document.getElementById("settings");
        container.innerHTML="";
        let head = document.createElement("h1"), Add = document.createElement("div");
        Add.id = "AddingGoods"
        head.innerHTML = "Add additional existing or completely new items";
        container.appendChild(head);

        let inpName = document.createElement("input");
        let datalist = document.createElement("datalist");
        let goods = await this.getAllGoods();
        Object.keys(goods).forEach( name => {
            let opt = document.createElement("option");
            opt.value = name;
            datalist.appendChild(opt);
        })
        datalist.id = "goodlist"
        inpName.setAttribute('list', "goodlist");
        inpName.placeholder="Add new item's name"
        inpName.type = "text"
        inpName.required = true
        inpName.id="inpName"
        Add.appendChild(datalist);
        Add.appendChild(inpName);

        let op = document.createElement("select"),
            option1 = document.createElement("option"),
            option2 = document.createElement("option");
        option1.value = 0;
        option1.innerText = "Add";
        op.appendChild(option1);
        option2.value = 1;
        option2.innerText = "Remove";
        op.appendChild(option2);
        op.id ="opt";
        Add.appendChild(op)

        let inpTotal = document.createElement("input");
        inpTotal.placeholder="Stored units"
        inpTotal.type = "number"
        inpTotal.id="inpTotal"
        Add.appendChild(inpTotal);

        let inpVal = document.createElement("input");
        inpVal.placeholder="Value p.U."
        inpVal.type = "number"
        inpVal.id="inpVal"
        Add.appendChild(inpVal);

        let btn = document.createElement("button");
        btn.innerHTML="▶"
        Add.appendChild(btn)
        container.appendChild(Add)
    };
    
    //Takes care of correct year/month
    async timeManager() {
        let time = await this.db.time.get("Time");
        if (time.week === 41) {time.year +=1; time.week = 1} else {time.week += 1}
        await this.db.time.put(time)
        return time
    };

    //Adds the necessary calculations to the weekPassed function
    weekPassedComputations() {
        return this.db.transaction("rw",this.db.population,this.db.diplomacy,this.db.goods,this.db.capacity, async ()=>{
            let goods = await this.getAllGoods();
            let diplDB = await this.db.diplomacy.get("Diplomacy"), popsDB = await this.db.population.get("Population"),
                capDB = await this.db.capacity.get("Capacity");
            const food = ["Fish","Beef","Bread"];
            const unstoredGoods = ["Spiritual Food"]
            Object.keys(goods).forEach(res =>{
                if (unstoredGoods.includes(res)) {
                    goods[res].total = 0;
                    return true;
                }
                else if (food.includes(res)) {
                    if (goods[res].income > capDB.food - capDB.actfood ) {
                        goods[res].total += - capDB.actfood + capDB.food ;
                    }
                    else if (goods[res].total < goods[res].income){
                        goods[res].total = 0;
                    }
                    else {
                        goods[res].total += goods[res].income;
                    };
                }
                else {
                    if (goods[res].income > capDB.resources - capDB.actres ) {
                        goods[res].total += - capDB.actres + capDB.resources ;
                    }
                    else if (goods[res].total < goods[res].income){
                        goods[res].total = 0;
                    }
                    else {
                        goods[res].total += goods[res].income;
                    };
                };
            });
            
            await this.db.goods.bulkPut(Object.values(goods));
            popsDB.adult += 0.75*diplDB.fame;
            popsDB.infant+= 0.25*diplDB.fame;
            popsDB.total = popsDB.adult + popsDB.infant;
            await this.db.population.put(popsDB);
        })
    }

    //Gathers information from subfunctions and executes them
    async weekPassed() {
        let time = await this.timeManager(),
            snd = document.getElementById("roostersound");
        snd.play();
        this.weekPassedComputations();
        this.update();
    };

    //Creates default page and computes current value of several assets and in total
    async createStatTot() {
        let container = document.getElementById("stat-tot");
        container.innerHTML="";
        let cell1 = document.createElement("div"),
                head = document.createElement("h1");
        head.innerHTML = "Assignan"
        head.align = "center"
        let img = document.createElement("img");
        img.src = "/DnD_Economy/src/images/Wappen_Assignan.PNG"
        img.style.height = '200px'; img.style.width = '200px';
        img.align="right"
        img.margin = "3vh"
        cell1.appendChild(img)
        container.appendChild(head)
        container.appendChild(cell1)
        
        let     pop = document.createElement("div"), 
                cap = document.createElement("div"),
                dipl = document.createElement("div"),
                val = document.createElement("div");

        let pop_aux  = await this.db.population.get("Population"),
            cap_aux  = await this.db.capacity.get("Capacity"),
            dipl_aux = await this.db.diplomacy.get("Diplomacy"),
            val_aux  = await this.db.value.get("Value");

        val_aux.total = val_aux.buildings + val_aux.resources
        await this.db.value.put(val_aux);
        //Creating strings for cells with correct formatting
        pop.style = "white-space: pre"; pop.innerHTML="&#127968;\t-\t"+pop_aux.housings+"\t\t\t\t👪\t-\t"+pop_aux.total+"\n🧑\t-\t"+pop_aux.adult+"  \t\t\t🧒\t-\t"+pop_aux.infant;container.appendChild(pop); 
        cap.style = "white-space: pre"; cap.innerHTML = "Storage"+"\t\t&#129717;\tused\t"+cap_aux.actres+"\tof\t"+cap_aux.resources+"\n\t\t\t&#127828;\tused\t"+cap_aux.actfood+"\tof\t"+cap_aux.food; container.appendChild(cap);
        dipl.style = "white-space: pre"; dipl.innerHTML="☆\t-\t"+dipl_aux.fame+"\n🗲\t-\t"+dipl_aux.arcane; container.appendChild(dipl);
        val.style = "white-space: pre"; val.innerHTML = "\&#129689; \tin \ttotal\t" + val_aux.total.toFixed(2) + "\n\tin\t&#127828;&#129717\t" + val_aux.resources.toFixed(2) + "\n\tin\t&#127968;&#127970;\t" + val_aux.buildings; container.appendChild(val);
        
        let prod = document.getElementById("prodmod");
        prod.innerHTML = "&#9881; "+cap_aux.prodmod+" %"
    };

    //Save the databases as file
    async saveDB() {
        let file = new Blob( [JSON.stringify({
            goods:      await this.db.goods.toArray(),
            buildings:  await this.db.buildings.toArray(),
            time:       await this.db.time.toArray(),
            population: await this.db.population.toArray(),
            capacity:   await this.db.capacity.toArray(),
            diplomacy:  await this.db.diplomacy.toArray(),
            value:      await this.db.value.toArray()
        },null,4)],{type: "application/json"});
        const a= document.createElement("a");

        a.href = URL.createObjectURL(file);
        a.download = "Assignan_databases_"+ (new Date()).toDateString().replaceAll(" ", "_")+".json";
        a.click();

        URL.revokeObjectURL(a.href);
    };

    //Loads databases via uploaded file
    loadDB(file) {
        const data = JSON.parse(file);
        this.db.transaction("rw",this.db.goods,this.db.buildings,this.db.time,this.db.population, this.db.capacity, this.db.diplomacy, this.db.value, async() => {
            await this.db.goods.clear();
            await this.db.buildings.clear();
            await this.db.time.clear();
            await this.db.population.clear();
            await this.db.capacity.clear();
            await this.db.diplomacy.clear();
            await this.db.value.clear();
            await Promise.all(Object.entries(data).map(([key, val]) => {
                return this.db[key].bulkPut(val);
            }));
        }).then(()=> this.update());
        
    };

    //Creates Statistic page for goods and computes total value of goods for default page
    async createStatGoods() {
        let container = document.getElementById("stat-goods");
        container.innerHTML="";

        //Create header of table "goods" by subfunction
        this.createCells(container, ["Goods", "Total Number", "Income per Week", "Value per Unit in GP", "Total value of this asset"]);
        this.createLine(container,5);

        //Fill the table with values from database
        let valueGoods = 0,
            storGoods = 0,
            storFood = 0;
        let goods = await this.getAllGoods();
        const cap_aux = await this.db.capacity.get("Capacity");
        let col = "";
        if (cap_aux.prodmod < 100) {
            col = "red";
        }
        else if (cap_aux.prodmod > 100) {
            col = green;
        }
        for (let good of Object.values(goods)) {
            valueGoods+=good.total*good.valPU;
            storGoods += good.total
            this.createCells(container,[good.name,good.total.toFixed(2),good.income.toFixed(2),good.valPU,(good.total*good.valPU).toFixed(2)],col);
        };
        const food = ["Fish","Beef","Bread"];
        food.forEach(fd => {
            storFood += goods[fd].total
        });
        storGoods -= storFood;
        storGoods -= goods["GP"].total;
        let aux_val = await this.db.value.get("Value");
        aux_val.resources = valueGoods;
        await this.db.value.put(aux_val)
        let aux_cap = await this.db.capacity.get("Capacity");
        aux_cap.actres = storGoods;
        aux_cap.actfood = storFood;
        await this.db.capacity.put(aux_cap)
    };

    //Extract the cell creation in the tables
    createCells(cont,list, color) {
        for (let i =0; i<list.length;i++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.innerHTML = list[i];
            if (color != undefined && i === 2) {
                cell.style.color = color;
            };
            cont.appendChild(cell);
        };
    };

    //Extract empty line creation
    createLine(cont,numb){
        for (let i=0;i<numb;i++){
            let hr = document.createElement("hr");
            hr.style = "color: transparent";
            cont.appendChild(hr);
        };
    };

    //Creates the statisticspage for buildings and computes their total value
    async createStatBuild() {
        let container = document.getElementById("build");
        container.innerHTML="";
        
        this.createCells(container, ["Building","Cost","Number","Yield","Build"]);
        this.createLine(container,5);

        let valueBuildings = 0;
        let builds = await this.getAllBuildings();
        let goods = await this.getAllGoods();
        for (let build of builds ) {
            let cell3 = document.createElement("div"),
                cell5 = document.createElement("div"),
                btn = document.createElement("button"),
                slct = document.createElement("select");
            let aux = build
            valueBuildings += aux.value*aux.number
             
            let txt_cost ="";
            for (let x in aux.cost) {
                txt_cost += x+": "+aux.cost[x] +" ";
            };
            this.createCells(container,[aux.name,txt_cost]);
            
            if (aux.variable) {
                for (let i = 0;i<=100;i++) {
                    let opt = document.createElement("option");
                    opt.value = i;
                    opt.innerText = i;
                    if(i === aux.number) {opt.selected = "selected"};
                    slct.appendChild(opt);
                };
                slct.addEventListener("change", async (e)=> {
                    aux.number = slct.value*1;
                    await this.db.buildings.put(aux);
                    await this.update();
                });
                container.appendChild(slct);
            }
            else {
                cell3.className = "cell" 
                cell3.innerHTML = aux.number
                container.appendChild(cell3)
            };

            cell5.className = "cell"
            let txt_yield = "";
            //Create strings in subfunctions
            txt_yield += this.iterateYields(aux.yield_weekly,"Weekly: ");
            txt_yield += this.iterateYields(aux.yield_const,"Const: ");
            cell5.innerHTML = txt_yield
            container.appendChild(cell5)

            if (aux.buildable === true) {
                btn.innerHTML   = "Build"
                btn.id          = "btn-build-"+aux.name
                const buildable = Object.keys(aux.cost).every(resName => goods[resName].total >= aux.cost[resName]);
                btn.className = buildable ? "build buildable" : "build nonbuildable";
                btn.addEventListener("click", ()=>this.buildBuilding(aux.name,1))
                container.appendChild(btn)
            }
            else{
                let btncell = document.createElement("div");
                btncell.innerHTML="";
                container.appendChild(btncell);
            };
            };
        let aux_val = await this.db.value.get("Value");
        aux_val.buildings = valueBuildings;
        await this.db.value.put(aux_val)
    };

    //Subfunction to shorten createStatBuild function
    iterateYields(obj,str) {
        if (Object.keys(obj) != 0) {
            let txt ="";
            for (let x in obj) {
                txt += x+": "+obj[x] +" ";
            };
            return str+txt
        }
        else {
            return ""
        };
    };

    //Computes the yield per week writes them into the goods database
    computeWeeklyYield() {
        return this.db.transaction("rw",this.db.population,this.db.goods,this.db.buildings,this.db.capacity, async()=>{
            let incomes = {},
                number = {};
            (await this.getAllBuildings()).forEach(building => {incomes[building.name] = building.yield_weekly, number[building.name]=building.number});
            let goods = await this.getAllGoods();
            let cap_aux = await this.db.capacity.get("Capacity");
            const pops = await this.db.population.get("Population");
            let cons = 8*(pops.adult+0.5*pops.infant);
            let goods_aux = {...goods};
            
            Object.keys(goods_aux).forEach(resource => {goods_aux[resource].income = 0});
            Object.keys(incomes).forEach(building => {Object.keys(incomes[building]).forEach((resource,i) => {
                goods_aux[resource].income += Object.values(incomes[building])[i]*number[building];
                if (goods_aux[resource].total < 0 ) {
                    goods_aux[resource].total = 0
                };
            })});
            
            //Managing food consumption
            cons -= goods_aux["Spiritual Food"].income
            goods_aux["Fish"].income -= cons*0.25;
            goods_aux["Beef"].income -= cons*0.25;
            goods_aux["Bread"].income -= cons*0.5;

            let prodmod = 100
            for (let item of ["Fish","Beef","Bread"]) {
                if (goods_aux[item].total + goods_aux[item].income < 0) {
                    console.log(item)
                    prodmod -= 25;
                };
            };
            cap_aux.prodmod = prodmod;
            await this.db.capacity.put(cap_aux);
            //Since the food for this week is already consumed, we dont recompute the food income based on the total, but on the left income AFTER the village has eaten
            if (cap_aux.prodmod != 100) {
                Object.keys(goods_aux).forEach(item => goods_aux[item].income *= cap_aux.prodmod / 100);
                //Lancellins Food production isnt affected by this
                goods_aux["Spiritual Food"].income /= cap_aux.prodmod / 100;
            };
            
            
            
            goods = {...goods_aux} 
            await this.db.goods.bulkPut(Object.values(goods));
        }).catch(err => {
            console.error(err.stack);
        });
    };

    //Computes the constant yields and writes them into the stat overall databases
    computeConstantYield() {
        return this.db.transaction("rw",this.db.capacity,this.db.population,this.db.buildings, async()=>{
            let incomes = {},
                number = {},
                auxYield = {"food":0,"resources":0,"housings":0},
                aux_stor = await this.db.capacity.get("Capacity"),
                aux_pop = await this.db.population.get("Population");
            (await this.getAllBuildings()).forEach(building => {incomes[building.name] = building.yield_const, number[building.name]=building.number});
            Object.keys(incomes).forEach( building =>{
                let names = ["StorFood","StorRes","Housings"];
                let m = 0;
                for (let key of Object.keys(auxYield)) {
                    if (incomes[building][names[m]] != undefined) {
                        auxYield[key]+=incomes[building][names[m]]*number[building]
                    };
                    m++;
                };
            });
            
            aux_stor.food = auxYield.food;
            aux_stor.resources = auxYield.resources;
            await this.db.capacity.put(aux_stor);
            aux_pop.housings = auxYield.housings;
            await this.db.population.put(aux_pop);
        }).catch(err => {
            console.error(err.stack);
        });
    };
 
    //Builds a certain building "number" times and removes the necessary goods from the database
    async buildBuilding (name, number){
        let snd = document.getElementById("buildingsound");
        snd.play();
        this.db.transaction("rw",this.db.goods,this.db.buildings, async()=>{
            const building = await this.db.buildings.get(name),
                requiredGoods = Object.keys(building.cost),
                goods = {};
            (await this.db.goods.bulkGet(requiredGoods)).forEach((resource, i) => goods[requiredGoods[i]] = resource)
            const buildable = requiredGoods.every(resourceName => goods[resourceName].total >= building.cost[resourceName])
            if(!buildable) {
                return
            }
            requiredGoods.forEach(resourceName => goods[resourceName].total -= building.cost[resourceName])
            await this.db.goods.bulkPut(Object.values(goods))
            building.number += number
            await this.db.buildings.put(building)
        }).then( () => { 
            this.update();
        }).catch(err => {
            console.error(err.stack)
        })
        
    };

    //Resets the properties of a certain good !!!CAUTION!!! Former information will be overwritten
    async putGood (Name,newInc,newTot){
        await this.db.goods.put({name: Name, income: newInc, total: newTot});
        this.update();
    };

    //Adds a particular income or total to a certain (possibly new) good
    async addGood (Name,addInc,addTot,valPU){
        this.db.transaction("rw",this.db.goods,this.db.capacity, async () => {
            let aux = await this.db.goods.get(Name),
                cap = await this.db.capacity.get("Capacity");
            const food = ["Beef","Fish","Bread"];
            if (aux ===undefined) {
                if (addTot > cap.resources - cap.actres ) {
                    addTot = 0;
                }
                await this.db.goods.put({name: Name, income: addInc, total: addTot,valPU:valPU});
            }
            else{
                let sum = aux.total + addTot;
                if (sum < 0) {
                    aux.total = 0;
                }
                else if (addTot > cap.resources - cap.actres && !food.includes(Name)) {
                    aux.total += cap.resources - cap.actres;
                }
                else if (addTot > cap.food - cap.actfood && food.includes(Name)) {
                    aux.total += cap.food - cap.actfood;
                }
                else {
                    aux.total += addTot;
                };
                await this.db.goods.put(aux);
            }
        }).then(this.update())
    };

    //Gives information about all goods - mainly for debugging purposes
    async getAllGoods () {
        let aux = await this.db.goods.toArray(),
            goods = {};
        aux.forEach((res)=> {goods[res.name] = res});
        return goods;
    };

    //Gives information about a specific good - mainly for debugging purposes
    async getGood (Name) {
        let aux = await this.db.goods.get(Name);
        return aux;
    };

    //Gives information about all buildings - mainly for debugging purposes
    async getAllBuildings () {
        return await this.db.buildings.toArray();
    };

    //Gives information about a specific building - mainly for debugging purposes
    async getBuilding (Name) {
        let aux = await this.db.buildings.get(Name);
        return aux;
        }
}