import OmeggaPlugin, { OL, PS, PC } from '../omegga';
import fs from 'fs';

function fuzzyCheck(check:string, search:string[]){
    //Return the string closest to the strings we are checking. If none, return false.
    var scores :Object= {};
    //First just check exact-match.
    if(search.find(a=>a===check)){
      return search.find(a=>a===check);
    }
    for(var a in search){
      for(var b = 0; b < search[a].length; b++){
        //First, match characters. Case-dependant.
        scores[search[a]] = (scores[search[a]] || 0) + (search[a][b] === check[b] ? 4 : (search[a][b]).toLowerCase() === (check[b] || "").toLowerCase() ? 2 : 0);
        //Second, subtract points of characters based on distance.
        if(check.indexOf(check[b],b) >= 0){
          scores[search[a]] = (scores[search[a]] || 0) - Math.min(Math.abs(check.indexOf(check[b], b) - search[a].indexOf(search[a][b], b)),3) + 1;
        }
      }
    }
    //Finally, sort and return the greater value.
    if(scores){
      //Now we have a bunch of keys. {"a":0, "b":6, "c":-2}.
      //Put all of them into an array, then sort that array.
      var arrayified : any = [];
      Object.entries(scores).forEach(e => arrayified.push([e[0], e[1]]));
      arrayified.sort((a, z) => z[1] - a[1]);
      //Return the matching string.
      if(arrayified[0][1] > arrayified[0][0].length*0.25){
        return arrayified[0][0];
      }
      else{
        return false;
      }
    }
    //Couldn't find a match. Return false.
    return false;
  }


class DuelRequest{
	sender : string;
	reciever : string;
	weapon : string;
	stage : string;
	constructor(sender, reciever, weapon, stage){
		this.sender = sender;
		this.reciever = reciever;
		this.weapon = weapon;
		this.stage = stage;
	}
}

class Stage{
	//What is the most essential information of a Stage?
	//Credit the author, ofcourse
	//The weapons list
	//The rating of a stage, if people like it or not.
	//The "Stage" Object will be stored inside of the server's map pool, allowing for quick access to stage information.
	name : string;
	savePath : string;
	weaponlist : string[];
	author : string;
	description : string;
	date : string;
	rating : number;
	constructor(name : string, savePath: string, author: string, description: string, date: string, weaponlist: string[], rating){
		//Essential
		this.name = name;
		this.savePath = savePath;
		this.weaponlist = weaponlist;
		//Non-essential
		this.author = author;
		this.description = description;
		this.date = date;
		this.rating = rating;
	}
}

export class Requests{
	static omegga : OL;
	static config : PC<Config>;
	static store;
	static initialize(omegga: OL, store, config : PC<Config>){
		this.omegga = omegga;
		this.store = store;
		this.config = config;
	}
	//ongoing is an array of DuelRequest objects, which are created using the information given to the function.
	static ongoing : any = [];
	
	//this is after you've verified everything, so make sure the information here is correct.
	static add(sender, reciever, weapon, stage){
		const newRequest = new DuelRequest(sender, reciever, weapon, stage);
		this.ongoing.push(newRequest);
		// console.log("Request Sent " + JSON.stringify(this.ongoing));
		Omegga.whisper(reciever, `[<color="ff00ff">DUEL</>] Challenged by <color="ff00ff">${sender}</>`);
		Omegga.whisper(reciever, `[<color="ff00ff">DUEL</>] <color="ffff33">Weapon </> - ${weapon}`);
		Omegga.whisper(reciever, `[<color="ff00ff">DUEL</>] <color="ffff33">Stage </> - ${stage}`);
		Omegga.whisper(reciever, `<code>/accept /decline</>`);
		setTimeout(() => this.remove(newRequest, "Timeout"), 20000);
	}
	static remove(request, reason){
		var found = this.ongoing.find(a => a === request);
		if(found){
			console.log("Removing Request : " + JSON.stringify(request) + " , Reason : " + reason);
			switch(reason){
				case "Timeout":
					Omegga.whisper(request.sender, `<color="ffff00"><b>${request.reciever}</></> <color="ff3333">didn't accept in time. Request cancelled.</>`);
					Omegga.whisper(request.reciever, `<color="ff3333">You didn't accept the duel request in time. Request cancelled.</>`);
					break;
				case "accepted":
					Omegga.whisper(request.sender, `<color="ff00ff"><b>${request.reciever}</></> <color="33ff33">accepted your request!</>`);
					break;
				case "declined":
					Omegga.whisper(request.sender, `<color="ff00ff"><b>${request.reciever}</></> <color="ff3333">declined your request...</>`);
					break;
				case "disconnect":
					if(Omegga.findPlayerByName(request.sender)){
						Omegga.whisper(request.sender, `<color="ff00ff"><b>${request.reciever}</></> <color="ff3333">disconnected. Request removed.</>`);
					}
					if(Omegga.findPlayerByName(request.reciever)){
						Omegga.whisper(request.reciever, `<color="ff00ff"><b>${request.sender}</></> <color="ff3333">disconnected. Request removed.</>`);
					}
					break;
			}
			this.ongoing.splice(this.ongoing.indexOf(found), 1);
		}
	}
	
	static hasRequest(player):boolean{
		//Check if they are either sending or recieving a request in ongoing.
		if(this.ongoing.find(a => a.sender === player)){
			return true;
		}
		if(this.ongoing.find(a => a.reciever === player)){
			return true;
		}
		return false;
	}
	static checkAvailability(targetname, asker): boolean{
		//First, make sure they aren't currently in a duel.
		if(DuelHandler.isInDuel(targetname)){
			if(asker){
				Omegga.whisper(asker, `<color="ff3333">That user is currently in a duel.</>`);
			}
			return false;
		}
		//Second, make sure they don't have any pending requests.
		if(this.hasRequest(targetname)){
			if(asker){
				Omegga.whisper(asker, `<color="ff3333">That user already has an active request.</>`);
			}
			return false;
		}
		//No issues. They're available/
		return true;
	}
	
	static pickstageWeighted(pool : Stage[]) : Stage{
		//Picks staged weighted on rating.
		var ratingsum = 0;
		pool.forEach(element => {
			ratingsum += Math.pow(element.rating, this.config["Rating-Power"]);
		});
		var n = Math.random()*(ratingsum)
		//console.log(n);
		let i;
		for(i = 0; i < pool.length && n > Math.pow(pool[i].rating, this.config["Rating-Power"]); i++){
			n -= Math.pow(pool[i].rating, this.config["Rating-Power"]);
		}
		return pool[i];
	}

	//painful
	static async sendRequest(name, target, weapon : string, stage : string, isOpen){
		var aliases = {
			"1911": "high_power_pistol",
			"hpp":"high_power_pistol",
			"amr": "anti_materiel_rifle",
			"ar": "assault_rifle",
			"classic": "classic_assault_rifle",
			"sniper":"sniper_rifle",
			"rocket":"rocket_launcher",
			"bz":"bazooka",
			"zook":"bazooka",
			"zookie":"bazooka",
			"sword":"arming_sword",
			"glowstick":"charged_longsword",
			"holo":"holo_blade",
			"service":"service_rifle",
			"sr":"service_rifle",
			"grenade":"impact_grenade"
		}
		if(DuelHandler.StagePool.length < 1){
			Omegga.whisper(name, `<color="ff3333">No stages found! Ask the host to <code>/savestage</> some stages.</>`);
			return;
		}
		//Make sure they specified a target.
		if(!target){
			Omegga.whisper(name, `<code>Usage : /duel [target] [weapon / *] [stage (optional)]</>`);
			return;
		}
		target = await Omegga.findPlayerByName(target);
		//Is the target available?
		if(!target){
			Omegga.whisper(name, `<color="ff3333">Target not found.</>`);
			return;
		}
		if(target.name === name){
			Omegga.whisper(name, `<color="ff3333">You can't duel yourself.</>`);
			return;
		}
		if(!await this.checkAvailability(target.name, name)){
			return;
		}
		//The first thing we'll have to check before anything else is if the weapon / stage chosen are valid.
		if(weapon === "*"){
			weapon = "";
		}
		if(stage === "*"){
			stage = "";
		}
		if(weapon){
			var weaponchoices :string[]= [];
			Object.keys(DuelHandler.gun_names).forEach(a => weaponchoices.push(a));
			Object.keys(aliases).forEach(a => weaponchoices.push(a));
			weapon = fuzzyCheck(weapon || "", weaponchoices);
			if(!weapon){
				Omegga.whisper(name, `<color="ff3333">Couldn't find the desired weapon.</>`);
				return
			}
			if(aliases[weapon.toLowerCase()]){
				weapon = aliases[weapon.toLowerCase()];
			}
			if(!DuelHandler.findWeapon(name, weapon)){
				//Can't find the weapon, but it was specified. Exit out.
				Omegga.whisper(name, `<code>Type /listweapons to see all weapons, or /weaponsearch [weapon_name] to find stages that support your desired weapon.`);
				return;
			}
		}
		if(stage){
			var stagechoices : string[] = [];
			DuelHandler.StagePool.forEach(a => stagechoices.push(a.name));
			stage = fuzzyCheck(stage || "", stagechoices);
			if(!stage){
				Omegga.whisper(name, `<color="ff3333">Couldn't find the desired stage.</>`);
				return
			}
			if(!DuelHandler.StagePool.find(a => a.name.toLowerCase() === stage.toLowerCase())){
				//Couldn't find the stage, but it was specified. Exit out.
				Omegga.whisper(name, `<color="ff3333">Invalid stage. Type <code>/liststages</> for a list of stages.</>`);
				return;
			}
		}
		//For /openduel , we'll have the user select a weapon and a stage, but the target won't be selected. It'll be open.
		//We'll need to probably just use 4 if statements. It's the easiest way.
		//Condition 1 : No weapon, No stage.
		//Condition 2 : Ye weapon, No stage.
		//Condition 3 : No weapon, Ye stage.
		//Condition 4 : Ye weapon, Ye stage.
		if(!weapon && !stage){
			//Pick random stage
			// Omegga.broadcast("No weapon, no stage.");
			//Create a weighted stage pool by duplicating items by rating and pick a random index from the whole
			stage = this.pickstageWeighted(DuelHandler.StagePool);

			Omegga.whisper(name, `<code>Automatically selected ${stage.name}</>`);
			//Pick random weapon for that stage
			weapon = stage.weaponlist[Math.floor(Math.random()*stage.weaponlist.length)];
			weapon = Object.keys(DuelHandler.gun_names).find(key => DuelHandler.gun_names[key] === weapon);
			Omegga.whisper(name, `<code>Automatically selected the ${weapon}</>`);
			stage = stage.name;
		}
		if(weapon && !stage){
			// Omegga.broadcast("Yes weapon, no stage.");
			//No stage. Pick a random stage that has the weapon.
			var valid = await DuelHandler.findStagesWithWeapon(DuelHandler.findWeapon(name, weapon)); // Returns an array of Stages
			if(valid.length <= 0){
				Omegga.whisper(name, `<color="ff3333">That weapon has no stages. Type <code>/weaponsearch</> to see what weapons the stages support.</>`);
				return;
			}
			stage = this.pickstageWeighted(valid);
			stage = stage.name;
			Omegga.whisper(name, `<code>Automatically selected ${stage}</>`);
		}
		if(!weapon && stage){
			// Omegga.broadcast("No weapon, yes stage.");
			//No weapon, but a stage was chosen. Pick a random gun from the stage's gun list.
			var stg = await DuelHandler.StagePool.find(a => a.name.toLowerCase() === stage.toLowerCase());
			weapon = stg.weaponlist[Math.floor(Math.random()*stg.weaponlist.length)];
			weapon = Object.keys(DuelHandler.gun_names).find(key => DuelHandler.gun_names[key] === weapon);
			Omegga.whisper(name, `<code>Automatically selected the ${weapon}</>`);
		}
		if(weapon && stage){
			// Omegga.broadcast("Weapon and stage.");
			var stg = await DuelHandler.StagePool.find(a => a.name.toLowerCase() === stage.toLowerCase());
			if(stg.weaponlist.find(element => element === DuelHandler.findWeapon(name, weapon))){
				Omegga.whisper(name, `<color="ffff33">Sending ${target.name} a request...</>`);
				this.add(name, target.name, weapon, stage)
				return;
			}
			else{
				Omegga.whisper(name, `<color="ff3333">That stage doesn't have that weapon on its whitelist. Type <code>/weaponsearch [weapon_name]</> to find stages which allow your weapon.</>`);
				return;
			}
		}
		Omegga.whisper(name, `<color="ff3333">Error sending request. Failed to set weapon and stage.</>`);
		return;
	}
	
	
	static async acceptRequest(name){
		var request = this.ongoing.find(a => a.reciever === name);
		DuelHandler.StartDuel(request);
		this.remove(request, 'accepted');
	}
}

class Fighter{
	Player;
	points : number;
	constructor(Player, points){
		this.Player = Player;
		this.points = points;
	}
}

class Battle{
	static specialWeapons : string[] = ["stick grenade", "impact grenade", "jumper grenade", "tomahawk", "handaxe"];
	fighterAttacking : Fighter;
	fighterDefending : Fighter;	
	request : DuelRequest;
	stagepos;
	minigameIndex : number;
	minigamename : string;
	weaponInterval : ReturnType<setInterval>;
	deathInterval : ReturnType<setInterval>;
	isEnding : boolean = false;
	changingRound : boolean = false;
	config;
	constructor(fighterAttacking : Fighter, fighterDefending : Fighter, request : DuelRequest, minigameIndex : number, minigamename : string, stagepos : any, config){
		this.fighterAttacking = fighterAttacking;
		this.fighterDefending = fighterDefending;
		this.request = request;
		this.minigameIndex = minigameIndex;
		this.stagepos = stagepos;
		this.minigamename = minigamename;
		this.config = config;
		//Omegga.broadcast("Weaponnn " + request.weapon);
		//Omegga.broadcast("Classsss " + DuelHandler.findWeapon(this.fighterAttacking.name, this.request.weapon));
		//We need to do some things for one-time use weapons, such as stick grenades, impact grenades, and jumper grenades.
		//First idea is to repeatedly give them a new one every two seconds or so. 
		//We can do this using an interval.
		this.deathInterval = setInterval(async ()=>{
			var ATTpos;
			var DEFpos;
			try{
				var ATTpos = await fighterAttacking.Player.getPosition()
				var DEFpos = await fighterDefending.Player.getPosition()
			}
			catch(err){
				console.error(err);
				return;
			}
			if(!this.changingRound){
				if(ATTpos[2]  < this.stagepos.offZ - (this.stagepos.stagebounds.center[2] - this.stagepos.stagebounds.minBound[2])){
				this.fighterAttacking.Player.damage(500000000000);
				}
				if(DEFpos[2] < this.stagepos.offZ - (this.stagepos.stagebounds.center[2] - this.stagepos.stagebounds.minBound[2])){
					this.fighterDefending.Player.damage(500000000000);
				}
			}
		}, 1000);
		if(Battle.specialWeapons.find(special => special === this.request.weapon.toLowerCase().replace("_", " "))){
			//Omegga.broadcast("Special weapon identified! " + this.request.weapon);
			this.weaponInterval = setInterval(()=>{
				//Omegga.broadcast("givin weapons..");
				var weapon = DuelHandler.findWeapon("crazey", this.request.weapon);
				Omegga.writeln(`Server.Players.GiveItem "${this.fighterAttacking.Player.name}" "${weapon}"`);
				Omegga.writeln(`Server.Players.GiveItem "${this.fighterDefending.Player.name}" "${weapon}"`);
				//fighterAttacking.Player.giveItem(DuelHandler.findWeapon(this.fighterAttacking.name, this.request.weapon));
				//fighterDefending.Player.giveItem(DuelHandler.findWeapon(this.fighterAttacking.name, this.request.weapon));
			}, 2500);
		}
	}
	async givePointsByScore(){
		var attscore;
		var defscore;
		try{
			attscore = (await this.fighterAttacking.Player.getScore(0));
			defscore = (await this.fighterDefending.Player.getScore(0));
			if(attscore === defscore){
				//tie
				this.givePoints("TIE", this.config["Points-On-Tie"]);
				return;
			}
			if(attscore > defscore){
				this.givePoints(this.fighterAttacking, this.config["Points-On-Timeout"]);
				return;
			}
			else{
				this.givePoints(this.fighterDefending, this.config["Points-On-Timeout"]);
				return;
			}
		}
		catch(err)
		{
			console.log("in givePointsByScore " + err);
			return;
		}
	}
	getEnemyOf(name){
		if(this.getFighterByName(name) === this.fighterAttacking){
			return this.fighterDefending;
		}
		else{
			return this.fighterAttacking;
		}
	}
	getAllFighters(){
		//returns the attacker and the defender
		return {"att":this.fighterAttacking, "def":this.fighterDefending};
	}
	getFighterByName(fname){
		//returns a specific fighter or null
		if(this.fighterAttacking.Player.name === fname){
			return this.fighterAttacking;
		}
		if(this.fighterDefending.Player.name === fname){
			return this.fighterDefending;
		}
		return null;
	}
	//Gives points to a Fighter.
	givePoints(fighter, amount:number){
		if(fighter === "TIE"){
			this.fighterAttacking.points += amount;
			this.fighterDefending.points += amount;
		}
		else{
			fighter.points += amount;
		}
		this.checkWinner();
	}
	//Displays current score in large text to both fighters.
	displayScore(){
		Omegga.middlePrint(this.fighterAttacking.Player.name, `<bold><size="50"><color="ff3333">${this.fighterAttacking.points}</> - <color="3333ff">${this.fighterDefending.points}</></></>`);
		Omegga.middlePrint(this.fighterDefending.Player.name, `<bold><size="50"><color="ff3333">${this.fighterAttacking.points}</> - <color="3333ff">${this.fighterDefending.points}</></></>`);
		if(this.fighterAttacking.points > this.fighterDefending.points){
			Omegga.middlePrint(this.fighterAttacking.Player.name, `<bold><size="50"><color="ffff33">${this.fighterAttacking.points}</> - <color="3333ff">${this.fighterDefending.points}</></></>`);
			Omegga.middlePrint(this.fighterDefending.Player.name, `<bold><size="50"><color="ffff33">${this.fighterAttacking.points}</> - <color="3333ff">${this.fighterDefending.points}</></></>`);
		}
		else if(this.fighterDefending.points > this.fighterAttacking.points){
			Omegga.middlePrint(this.fighterAttacking.Player.name, `<bold><size="50"><color="ff3333">${this.fighterAttacking.points}</> - <color="33ffff">${this.fighterDefending.points}</></></>`);
			Omegga.middlePrint(this.fighterDefending.Player.name, `<bold><size="50"><color="ff3333">${this.fighterAttacking.points}</> - <color="33ffff">${this.fighterDefending.points}</></></>`);
		}
	}
	checkWinner(){
		var pointlimit = this.config["First-To-X"];
		if(this.fighterAttacking.points >= pointlimit && this.fighterDefending.points >= pointlimit){
			//tie condition
			this.grantWin("TIE");
			return;
		}
		if(this.fighterAttacking.points >= pointlimit){
			this.grantWin(this.fighterAttacking);
			return;
		}
		if(this.fighterDefending.points >= pointlimit){
			this.grantWin(this.fighterDefending);
			return;
		}
	}
	grantWin(winner){
		if(!this.isEnding){
			this.isEnding = true;
			if(winner != "TIE"){
				if(this.config["Announce-Winner"]){
				setTimeout(()=>{
				if(this.fighterAttacking.Player.name === winner.Player.name){
					Omegga.broadcast(`<color="ff33ff"><bold>${this.fighterAttacking.Player.name.toUpperCase()}</></> BEAT <color="ff33ff"><bold>${this.fighterDefending.Player.name.toUpperCase()}</></> IN A DUEL! <code>(${this.fighterAttacking.points}-${this.fighterDefending.points})</>`);
					Omegga.broadcast(`<code>Weapon - ${this.request.weapon.toUpperCase()}, Stage - ${this.request.stage.toUpperCase()}</>`);
				}
				else{
					Omegga.broadcast(`<color="ff33ff"><bold>${this.fighterDefending.Player.name.toUpperCase()}</></> BEAT <color="ff33ff"><bold>${this.fighterAttacking.Player.name.toUpperCase()}</></> IN A DUEL! <code>(${this.fighterDefending.points}-${this.fighterAttacking.points})</>`);
					Omegga.broadcast(`<code>Weapon - ${this.request.weapon.toUpperCase()}, Stage - ${this.request.stage.toUpperCase()}</>`);
				}
			}, 300);
			}
			}
			else{
				if(this.config["Announce-Winner"]){
				Omegga.broadcast(`<color="ff33ff"><bold>${this.fighterAttacking.Player.name}</></> and <color="ff33ff"><bold>${this.fighterDefending.Player.name}</></> tied in a duel. <code>(${this.fighterAttacking.points}-${this.fighterDefending.points})</>`)
		  	 	Omegga.broadcast(`<code>Weapon - ${this.request.weapon.toUpperCase()}, Stage - ${this.request.stage.toUpperCase()}</>`);
				}
			}
			setTimeout(() => {
				this.End()
			}, 2000);
		}
	}
	End(){
		clearInterval(this.deathInterval);
		if(this.weaponInterval){
			clearInterval(this.weaponInterval);
		}
		console.log("ending duel " + JSON.stringify(this));
		DuelHandler.EndDuel(this);
	}
}

export class DuelHandler{

	static omegga;
	static store;
	static config;
	//StagePool is a collection of stages.
	static StagePool : Stage[] = [];
	
	static async initialize(omegga, store, config){
		// console.log(fs);
		this.omegga = omegga;
		this.store = store;
		this.config = config;
		this.omegga.broadcast("Plugin Server_Dueling initializing...");
		this.omegga.broadcast(`[<color="ff00ff">DUELING</>] Reading Level Data...`);
		//Scan the stages on startup.
		await this.scanStages();
		if(this.StagePool.length > 0){
			this.omegga.broadcast(`<color="33ff33">Found [ ${this.StagePool.length} ] stages! They have been added to the map pool.</>`);
		}
		else{
			this.omegga.broadcast(`<color="ff3333">Didn't find any stages in Builds/Dueling/stages/...</>`);
		}
	}
	static async scanStages(){
		this.StagePool = [];
		var DuelingSaveFiles = this.omegga.getSaves().filter(s=>s.includes('Builds/Dueling/stages/'));
		//^Returns an array of strings, only saves in the Dueling folder.
		//Remove unwanted garbo from the file path and store the stages
		//When starting, we should get all of the stored maps, and put them in the current map pool.
		for(var idx in DuelingSaveFiles){
			var filepath = DuelingSaveFiles[idx].match(/(?<filepath>\/Dueling\/.*)/gi);
			console.log(filepath);
			//Get the header information of the save.
			var data = JSON.parse(await this.omegga.readSaveData(filepath[0], true).description);
			var ratingdata;
			ratingdata = await this.store.get(data.name);
			if(ratingdata){
				ratingdata = ratingdata.avgrating;
			}
			else{
				ratingdata = 3.0;
			}
			//Description keys :
			//name, savePath, author, description, date, weaponlist[]
			this.StagePool.push(new Stage(data.name, data.savePath, data.author, data.description, data.date, data.weaponlist, ratingdata));
		}
		console.info(`[DUELING] stage scan pool result : ${this.StagePool}`);
	}
	
	//Will need for the /duel command.
	static gun_names = {                     
	"anti materiel rifle": "Weapon_AntiMaterielRifle",
    "arming sword": "Weapon_ArmingSword",                      
    "assault rifle": "Weapon_AssaultRifle",                    
    "auto shotgun": "Weapon_AutoShotgun",                        
    "battleaxe": "Weapon_Battleaxe",                             
    "bazooka": "Weapon_Bazooka",                                 
    "bow": "Weapon_Bow",                                         
    "bullpup rifle": "Weapon_BullpupRifle",                      
    "bullpup smg": "Weapon_BullpupSMG",                          
    "charged longsword": "Weapon_ChargedLongsword",              
    "crystal kalis": "Weapon_CrystalKalis",                      
    "derringer": "Weapon_Derringer",                             
    "flintlock pistol": "Weapon_FlintlockPistol",                
    "grenade launcher": "Weapon_GrenadeLauncher",                
    "handaxe": "Weapon_Handaxe",                                 
    "health potion": "Weapon_HealthPotion",                      
    "classic assault rifle": "Weapon_HeavyAssaultRifle",         
    "heavy smg": "Weapon_HeavySMG",                              
    "hero sword": "Weapon_HeroSword",                            
    "high power pistol": "Weapon_HighPowerPistol",             
    "holo blade": "Weapon_HoloBlade",                            
    "hunting shotgun": "Weapon_HuntingShotgun",                  
    "ikakalaka": "Weapon_Ikakalaka",                             
    "impact grenade": "Weapon_ImpactGrenade",                    
    "impact grenade launcher": "Weapon_ImpactGrenadeLauncher",   
    "jumper grenade": "Weapon_ImpulseGrenade",                  
    "khopesh": "Weapon_Khopesh",                                 
    "knife": "Weapon_Knife",                                     
    "lever action rifle": "Weapon_LeverActionRifle",             
    "light machine gun": "Weapon_LightMachineGun",               
    "long sword": "Weapon_LongSword",                            
    "magnum pistol": "Weapon_MagnumPistol",                      
    "micro smg": "Weapon_MicroSMG",                              
    "minigun": "Weapon_Minigun",                                 
    "pistol": "Weapon_Pistol",                                   
    "pulse carbine": "Weapon_PulseCarbine",                      
    "barrage launcher": "Weapon_QuadLauncher",  
	"barrage": "Weapon_QuadLauncher",                 
    "revolver": "Weapon_Revolver",                               
    "rocket jumper": "Weapon_RocketJumper",                      
    "rocket launcher": "Weapon_RocketLauncher",
    "sabre": "Weapon_Sabre",
    "semi auto rifle": "Weapon_SemiAutoRifle",
    "service rifle": "Weapon_ServiceRifle",
    "shotgun": "Weapon_Shotgun",
    "slug shotgun": "Weapon_SlugShotgun",
    "sniper rifle": "Weapon_Sniper",
    "spatha": "Weapon_Spatha",
    "smg": "Weapon_Standardsubmachinegun",
    "stick grenade": "Weapon_StickGrenade",
    "suppressed smg": "Weapon_Submachinegun",
    "super shotgun": "Weapon_SuperShotgun",
    "suppressed assault rifle": "Weapon_SuppressedAssaultRifle",
    "suppressed bullpup smg": "Weapon_SuppressedBullpupSMG",
    "suppressed pistol": "Weapon_SuppressedPistol",
    "suppressed service rifle": "Weapon_SuppressedServiceRifle",
    "tactical shotgun": "Weapon_TacticalShotgun",
    "tactical smg": "Weapon_TacticalSMG",
    "tomahawk": "Weapon_Tomahawk",
    "twin cannon": "Weapon_TwinCannon",
    "typewriter smg": "Weapon_TypewriterSMG",
    "zweihander": "Weapon_Zweihander"
	};
	static findWeapon(cmdsender, weaponname){
		//find the weapon based on the given name
		//Meant to be used within a for loop to check the validity of each weapon rather than passing in an entire array.
		weaponname = weaponname.replaceAll("_", " ").toLowerCase();	
		// console.log(weaponname);
		// console.log(this.gun_names[weaponname]);
		if(this.gun_names[weaponname]){
			return this.gun_names[weaponname];
		}
		Omegga.whisper(cmdsender, `<color="ff3333">[DUELING] Error - ${weaponname} not found as a weapon.</>`);
		return false;
	}
	
	//Duel stopping and starting functions
	static ongoingBattles : Battle[] = [];
	static async StartDuel(request){
		//request structure:
		//sender, reciever, weapon name, stage name
		// console.log(request);
		var DuelStarter = await this.omegga.findPlayerByName(request.sender);
		var stagepos = await this.loadStageByName(request.stage, DuelStarter, false);
		//stagepos has {duelnum, stagebounds, offX, offY, offZ};
		
		//Let's start that minigame
		var temporaryfilename = `temp_${Date.now()}`;
		console.log("Writing temporary file " + temporaryfilename);
		var raw = fs.readFileSync("data/Saved/Presets/Minigame/dueling_150_135_100.bp");
		var existing = JSON.parse(raw);
		var mgname = `${request.sender} VS. ${request.reciever}`;
		existing.data.rulesetSettings.rulesetName = mgname;
		existing.data.customTeamSettings[0].teamName = `${request.sender}`;
		existing.data.customTeamSettings[0].startingItem0 = this.findWeapon(`${request.sender}`, request.weapon);
		existing.data.customTeamSettings[1].teamName = `${request.reciever}`;
		existing.data.customTeamSettings[1].startingItem0 = this.findWeapon(`${request.sender}`, request.weapon);
		fs.writeFileSync(`data/Saved/Presets/Minigame/${temporaryfilename}.bp`, JSON.stringify(existing));
		
		this.omegga.loadMinigame(temporaryfilename, DuelStarter.id);
		var indexget = await this.omegga.listMinigames();
		//Setting players to index -1 because it should be the most recent minigame.
		//Only send the reciever in, the creator gets put in it when the minigame is made.
		var recieverplayer = this.omegga.findPlayerByName(request.reciever);
		recieverplayer.setMinigame(indexget.length-1);
		setTimeout(()=>{DuelStarter.setTeam(0);recieverplayer.setTeam(1);}, 300);
		//We're just gonna store minigame index in here
		var thisBattle = new Battle(new Fighter(DuelStarter, 0), new Fighter(recieverplayer, 0), request, indexget.length, mgname,stagepos, this.config);
		this.ongoingBattles.push(thisBattle);
		setTimeout(()=>{fs.unlinkSync(`data/Saved/Presets/Minigame/${temporaryfilename}.bp`);console.log("removing temporary file " + temporaryfilename);},3000);
	}
	static async EndDuel(battle:Battle){
		//index 0 : level stuff
		//index 1 : minigame stuff
		var data = await this.store.get(battle.request.stage);
		if(data){
			if(!data.ratings[`'${battle.fighterAttacking.Player.id}'`]){
				if(battle.fighterAttacking.Player.name){
				this.omegga.whisper(battle.fighterAttacking.Player.name, `<color="ff0000">You haven't rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to rate it!</>`);
				this.omegga.whisper(battle.fighterAttacking.Player.name, `<color="ff0000">You haven't rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to rate it!</>`);
				this.omegga.whisper(battle.fighterAttacking.Player.name, `<color="ff0000">You haven't rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to rate it!</>`);
				}
			}
			if(!data.ratings[`'${battle.fighterDefending.Player.id}'`]){
				if(battle.fighterDefending.Player.name){
				this.omegga.whisper(battle.fighterDefending.Player.name, `<color="ff0000">You haven't rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to rate it!</>`);
				this.omegga.whisper(battle.fighterDefending.Player.name, `<color="ff0000">You haven't rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to rate it!</>`);
				this.omegga.whisper(battle.fighterDefending.Player.name, `<color="ff0000">You haven't rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to rate it!</>`);
				}
			}
		}
		else{
			if(battle.fighterAttacking.Player.name){
				this.omegga.whisper(battle.fighterAttacking.Player.name, `<color="ff0000">No one has rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to be the first!</>`);
				this.omegga.whisper(battle.fighterAttacking.Player.name, `<color="ff0000">No one has rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to be the first!</>`);
				this.omegga.whisper(battle.fighterAttacking.Player.name, `<color="ff0000">No one has rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to be the first!</>`);
			}
			if(battle.fighterDefending.Player.name){
				this.omegga.whisper(battle.fighterDefending.Player.name, `<color="ff0000">No one has rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to be the first!</>`);
				this.omegga.whisper(battle.fighterDefending.Player.name, `<color="ff0000">No one has rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to be the first!</>`);
				this.omegga.whisper(battle.fighterDefending.Player.name, `<color="ff0000">No one has rated ${battle.request.stage} yet! Type <code>/ratestage ${battle.request.stage} (rating)</> to be the first!</>`);

			}}
		if(battle){
			//clear the level
			var clearX = battle.stagepos.stagebounds.maxBound[0]-battle.stagepos.stagebounds.minBound[0];
			var clearY = battle.stagepos.stagebounds.maxBound[1]-battle.stagepos.stagebounds.minBound[1];
			var clearZ = battle.stagepos.stagebounds.maxBound[2]-battle.stagepos.stagebounds.minBound[2];
			this.omegga.clearRegion({center:[battle.stagepos.offX, battle.stagepos.offY, battle.stagepos.offZ], extent:[clearX*0.52, clearY*0.52, clearZ*0.52]});
			//end the minigame, subtract 1 to fix
			//this.omegga.deleteMinigame(battle.minigameIndex -1);
			//remove it from the array of ongoing
			this.ongoingBattles.splice(this.ongoingBattles.indexOf(battle), 1);
			var games = await this.omegga.listMinigames();
			//do config stuff to this later
			games = games.find(a => a.name === this.config["Intermission-Minigame"]);
			if(games){
				//if it finds the minigame send them there
				battle.fighterDefending.Player.setMinigame(games.index);
				battle.fighterAttacking.Player.setMinigame(games.index);
			}
			else{
				//didnt find the minigame so send them to GLOBAL
				this.omegga.writeln(`Server.Players.SetMinigame "${battle.fighterDefending.Player.name}" -1`);
				this.omegga.writeln(`Server.Players.SetMinigame "${battle.fighterAttacking.Player.name}" -1`);
			}
		}
		else{
			console.error("[DUELING] Error ending duel - Duel info empty. " + battle);
			//Maybe default to the minigame at index 0 for now.
			// this.omegga.deleteMinigame(0);
		}
	}
	
	static async findStagesWithWeapon(weaponclass){
		return this.StagePool.filter(s=>s.weaponlist.includes(weaponclass));
	}
	
	static Counter = 0;
	static async loadStageByName(stagename, Player, debug){
		var check = DuelHandler.StagePool.find(a => a.name.toLowerCase() === stagename.toLowerCase());
		if(check){
			try{
				var stage = await this.omegga.readSaveData(check.savePath, false);
			}catch(err){
				if(err){
					Omegga.broadcast(`<color="ff3333">Error reading stage save file. Re-scanning stage pool.`);
					this.scanStages();
					return
				}
			}
			if(Player){
				stage.brick_owners[0].id = Player.id;
				stage.brick_owners[0].name = Player.name;
			}
			var spawnassetIdx = stage.brick_assets.indexOf("B_SpawnPoint");
			var spawns = stage.bricks.filter(brick => brick.asset_name_index === spawnassetIdx);
			if(spawns.length > 1){
				spawns[0].color = 13;
				spawns[1].color = 19;
			}
			// console.log(stage);
			var stagebounds = await OMEGGA_UTIL.brick.getBounds(stage);
			// console.log(stage);
			//Is this the right way to account for the center of the stage?
			if(debug){
				this.omegga.broadcast(JSON.stringify(stagebounds));
				return;
			}
			var offyX = ((DuelHandler.StagePool.indexOf(check)) * this.config["Stage-Horizontal-Offset"]);
			var offyY = ((this.Counter % this.config["Stage-Loop"]) * this.config["Stage-Horizontal-Offset"]);
			var offyZ = (this.config["Stage-Vertical-Offset"]);
			await this.omegga.loadSaveData(stage, 
			{offX: offyX - stagebounds.center[0]
			,offY: offyY - stagebounds.center[1]
			,offZ: offyZ - stagebounds.center[2]
			,quiet: true});
			this.Counter += 1;
			return {"duelnum":this.Counter, "stagebounds":stagebounds, "offX":offyX,"offY":offyY,"offZ":offyZ};
		}
		else{
			this.omegga.broadcast("Save not found. Rescanning stage folder.");
			this.scanStages();
		}
	}
	
	static isInDuel(playername): boolean{
		return this.ongoingBattles.some(b => playername === b.fighterAttacking.Player.name || playername === b.fighterDefending.Player.name);
	}
}