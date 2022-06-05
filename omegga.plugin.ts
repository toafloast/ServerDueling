import OmeggaPlugin, { OL, PS, PC } from 'omegga';
import {Requests, DuelHandler} from 'src/dueling.ts';
import fs from 'fs';

type Config = { foo: string };
type Storage = { bar: string };

export default class DuelingPlugin{
	omegga : OL;
	config : PC<Config>;
	store : PS<Storage>;
	constructor(omegga: OL, config: PC<Config>, store: PS<Storage>){
		this.omegga = omegga;
   		this.config = config;
   		this.store = store;
	}
  
  async init() {
	DuelHandler.initialize(this.omegga, this.store, this.config);
	Requests.initialize(this.omegga, this.store, this.config);
	//console.log(await this.omegga.listMinigames());
	if (!fs.existsSync("data/Saved/Builds/Dueling/stages/")){
		fs.mkdirSync("data/Saved/Builds/Dueling/stages/", {recursive : true});
	}
	if (!fs.existsSync("data/Saved/Presets/Minigame/")){
		fs.mkdirSync("data/Saved/Presets/Minigame/", {recursive : true});
	}
	if(!fs.existsSync("data/Saved/Presets/Minigame/dueling_150_135_100.bp")){
		fs.writeFileSync("data/Saved/Presets/Minigame/dueling_150_135_100.bp", JSON.stringify({
			"formatVersion": "1",
			"presetVersion": "1",
			"type": "Minigame",
			"data":
			{
				"gameTypeDescriptor": "GM_Deathmatch",
				"rulesetSettings":
				{
					"rulesetName": "crazey's Minigame",
					"rulesetDescription": "",
					"rulesetColor":
					{
						"r": 66,
						"g": 255,
						"b": 0,
						"a": 255
					},
					"rulesetType": "Minigame",
					"rulesetEntryPolicy": "Private",
					"relevantBricks": "OwnerOnly"
				},
				"gamemodeSettings":
				{
					"roundTime": 60,
					"roundRestartDelay": 3,
					"bShowPointsInHud": true,
					"bShowLivesInHud": false,
					"pointsRequiredToWin": 2147483647,
					"timeUpWinPolicy": "HighestScoreWins",
					"lastManStandingPolicy": "AutomaticWin",
					"nameOfSpecificTeam": "",
					"bShowScoreColumn": false,
					"bShowKillsColumn": true,
					"bShowDeathsColumn": true,
					"autoSortMode": "Off",
					"teamSwitchPolicy": "NotAllowed",
					"extraLives": 0,
					"bAutoBalance": false
				},
				"unaffiliatedTeamSettings":
				{
					"teamName": "",
					"teamColor":
					{
						"r": 0,
						"g": 0,
						"b": 0,
						"a": 0
					},
					"playerRespawnTime": 1,
					"teamSpawnMode": "UseTeamColoredSpawnBricks",
					"teamHealthMultiplier": 1,
					"teamSpeedMultiplier": 1,
					"teamJumpHeightMultiplier": 1,
					"bTeamCollision": true,
					"bTeamCanStack": false,
					"controlModeOverride": "UserChoice",
					"bEnableCameraBlockedEffects": true,
					"teamAllies": "",
					"bFriendlyDamage": false,
					"bSelfDamageMode": true,
					"bPhysicsDamageMode": true,
					"bWeaponDamageMode": true,
					"bEnvironmentDamageMode": true,
					"waterDamagePerSecond": 0,
					"respawnInvincibilityTime": 1,
					"respawnSelfDestructPreventionTime": 1,
					"maxItemSlots": 10,
					"startingItem0": "None",
					"startingItem1": "None",
					"startingItem2": "None",
					"startingItem3": "None",
					"startingItem4": "None",
					"startingItem5": "None",
					"startingItem6": "None",
					"startingItem7": "None",
					"startingItem8": "None",
					"startingItem9": "None",
					"specialBrickUsePolicy": "TeamColoredOrUnaffiliated",
					"bCanReachGoalPoints": true,
					"bCanUseCheckPoints": true,
					"bRememberCheckPointBetweenJoins": true,
					"teamNameDistance": 60000,
					"enemyNameDistanceMultiplier": 1,
					"bEnableTeamHealthRegeneration": false,
					"teamHealthRegenStartTime": 3,
					"teamHealthRegenPerSecond": 10,
					"playersSpectatorsCanView": "All",
					"bForceSpectatorMode": true,
					"bAllowSpectatorFreeCamera": true,
					"spectatorChat": "ToAll",
					"bLimitChatRange": false,
					"chatRange": 128,
					"bDeathNotifications": true,
					"visibility": "VisibleToAll",
					"fakeTeamWhenHidden": "[Unassigned]",
					"pointsForKilling": 1,
					"pointsForDying": 0,
					"pointsForSelfDestruct": 0,
					"pointsForDealingDamage": 0,
					"pointsForTakingDamage": 0,
					"playerLives": 0,
					"teamLives": 0,
					"teamWeight": 1,
					"bLimitTeamCapacity": false,
					"teamCapacity": 8,
					"teamToMoveDeadTo": "",
					"p_Tools.Applicator.Use": true,
					"p_Bricks.ClearOwn": true,
					"p_Bricks.Delete": true,
					"p_Bricks.Paint": true,
					"p_Bricks.Place": true,
					"p_Server.Chat": true,
					"p_Self.Fly": true,
					"p_Tools.Circler.Use": true,
					"p_Prefabs.Load": true,
					"p_Tools.Resizer.Use": true,
					"p_Tools.Selector.Use": true,
					"p_Self.SelfDestruct": true,
					"p_Items.Spawn": true,
					"p_Self.Sprint": false,
					"p_Self.Flashlight": true
				},
				"customTeamSettings": [
					{
						"teamName": "red",
						"teamColor":
						{
							"r": 235,
							"g": 6,
							"b": 6,
							"a": 255
						},
						"playerRespawnTime": 1,
						"teamSpawnMode": "UseTeamColoredSpawnBricks",
						"teamHealthMultiplier": 1.5,
						"teamSpeedMultiplier": 1.3500000238418579,
						"teamJumpHeightMultiplier": 1,
						"bTeamCollision": true,
						"bTeamCanStack": false,
						"controlModeOverride": "UserChoice",
						"bEnableCameraBlockedEffects": false,
						"teamAllies": "",
						"bFriendlyDamage": false,
						"bSelfDamageMode": true,
						"bPhysicsDamageMode": false,
						"bWeaponDamageMode": true,
						"bEnvironmentDamageMode": true,
						"waterDamagePerSecond": 5555,
						"respawnInvincibilityTime": 0.5,
						"respawnSelfDestructPreventionTime": 0.5,
						"maxItemSlots": 3,
						"startingItem0": "None",
						"startingItem1": "None",
						"startingItem2": "None",
						"startingItem3": "None",
						"startingItem4": "None",
						"startingItem5": "None",
						"startingItem6": "None",
						"startingItem7": "None",
						"startingItem8": "None",
						"startingItem9": "None",
						"specialBrickUsePolicy": "TeamColoredOrUnaffiliated",
						"bCanReachGoalPoints": true,
						"bCanUseCheckPoints": true,
						"bRememberCheckPointBetweenJoins": true,
						"teamNameDistance": 60000,
						"enemyNameDistanceMultiplier": 1,
						"bEnableTeamHealthRegeneration": true,
						"teamHealthRegenStartTime": 5,
						"teamHealthRegenPerSecond": 25,
						"playersSpectatorsCanView": "OwnTeam",
						"bForceSpectatorMode": false,
						"bAllowSpectatorFreeCamera": true,
						"spectatorChat": "ToAll",
						"bLimitChatRange": false,
						"chatRange": 128,
						"bDeathNotifications": true,
						"visibility": "VisibleToAll",
						"fakeTeamWhenHidden": "[Unassigned]",
						"pointsForKilling": 1,
						"pointsForDying": 0,
						"pointsForSelfDestruct": 0,
						"pointsForDealingDamage": 0,
						"pointsForTakingDamage": -1,
						"playerLives": 1,
						"teamLives": 0,
						"teamWeight": 1,
						"bLimitTeamCapacity": true,
						"teamCapacity": 1,
						"teamToMoveDeadTo": "",
						"p_Tools.Applicator.Use": false,
						"p_Bricks.ClearOwn": false,
						"p_Bricks.Delete": false,
						"p_Bricks.Paint": false,
						"p_Bricks.Place": false,
						"p_Server.Chat": true,
						"p_Self.Fly": false,
						"p_Tools.Circler.Use": false,
						"p_Prefabs.Load": false,
						"p_Tools.Resizer.Use": false,
						"p_Tools.Selector.Use": false,
						"p_Self.SelfDestruct": true,
						"p_Items.Spawn": false,
						"p_Self.Sprint": false,
						"p_Self.Flashlight": true
					},
					{
						"teamName": "blue",
						"teamColor":
						{
							"r": 3,
							"g": 16,
							"b": 255,
							"a": 255
						},
						"playerRespawnTime": 1,
						"teamSpawnMode": "UseTeamColoredSpawnBricks",
						"teamHealthMultiplier": 1.5,
						"teamSpeedMultiplier": 1.3500000238418579,
						"teamJumpHeightMultiplier": 1,
						"bTeamCollision": true,
						"bTeamCanStack": false,
						"controlModeOverride": "UserChoice",
						"bEnableCameraBlockedEffects": false,
						"teamAllies": "",
						"bFriendlyDamage": false,
						"bSelfDamageMode": true,
						"bPhysicsDamageMode": false,
						"bWeaponDamageMode": true,
						"bEnvironmentDamageMode": true,
						"waterDamagePerSecond": 5555,
						"respawnInvincibilityTime": 0.5,
						"respawnSelfDestructPreventionTime": 0.5,
						"maxItemSlots": 3,
						"startingItem0": "None",
						"startingItem1": "None",
						"startingItem2": "None",
						"startingItem3": "None",
						"startingItem4": "None",
						"startingItem5": "None",
						"startingItem6": "None",
						"startingItem7": "None",
						"startingItem8": "None",
						"startingItem9": "None",
						"specialBrickUsePolicy": "TeamColoredOrUnaffiliated",
						"bCanReachGoalPoints": true,
						"bCanUseCheckPoints": true,
						"bRememberCheckPointBetweenJoins": true,
						"teamNameDistance": 60000,
						"enemyNameDistanceMultiplier": 1,
						"bEnableTeamHealthRegeneration": true,
						"teamHealthRegenStartTime": 5,
						"teamHealthRegenPerSecond": 25,
						"playersSpectatorsCanView": "OwnTeam",
						"bForceSpectatorMode": false,
						"bAllowSpectatorFreeCamera": true,
						"spectatorChat": "ToAll",
						"bLimitChatRange": false,
						"chatRange": 128,
						"bDeathNotifications": true,
						"visibility": "VisibleToAll",
						"fakeTeamWhenHidden": "[Unassigned]",
						"pointsForKilling": 1,
						"pointsForDying": 0,
						"pointsForSelfDestruct": 0,
						"pointsForDealingDamage": 0,
						"pointsForTakingDamage": -1,
						"playerLives": 1,
						"teamLives": 0,
						"teamWeight": 1,
						"bLimitTeamCapacity": true,
						"teamCapacity": 1,
						"teamToMoveDeadTo": "",
						"p_Tools.Applicator.Use": false,
						"p_Bricks.ClearOwn": false,
						"p_Bricks.Delete": false,
						"p_Bricks.Paint": false,
						"p_Bricks.Place": false,
						"p_Server.Chat": true,
						"p_Self.Fly": false,
						"p_Tools.Circler.Use": false,
						"p_Prefabs.Load": false,
						"p_Tools.Resizer.Use": false,
						"p_Tools.Selector.Use": false,
						"p_Self.SelfDestruct": true,
						"p_Items.Spawn": false,
						"p_Self.Sprint": false,
						"p_Self.Flashlight": true
					}
				]
			}
		}))
	}
	// ^Does all of the necessary stuff to set up dueling
	//await this.store.wipe();
	this.omegga
		.on('leave', async(player) =>{
			console.log(player);
			if(Requests.hasRequest(player.name)){
				Requests.remove(Requests.ongoing.find(a => a.reciever === player.name || a.sender === player.name),"disconnect");
			}
		})
		.on('cmd:testwa', async(name) =>{
			var chosen = [];
			for(var i = 0; i < 10000; i+=1){
				var pick = Requests.pickstageWeighted(DuelHandler.StagePool);
				chosen.push(pick.name);
			}
			var counter = {};
			chosen.forEach(a => {counter[a] = (counter[a] || 0) + 1;});
			Omegga.broadcast("STAGE BIAS TEST RESULT");
			this.omegga.broadcast(JSON.stringify(counter));
			this.omegga.broadcast(this.config["Rating-Power"]);
		})
		.on('cmd:duel', async (name, target, weapon, stage) => {
			if(this.config["Duel-Blacklist"].find(a => a.id ===this.omegga.findPlayerByName(name).id)){
				this.omegga.whisper(name, `<color="ff3333">You have been blacklisted from dueling.</>`);
				return;
			}
			if(!await Requests.checkAvailability(name)){
				this.omegga.whisper(name, "You can't send a request right now.");
				return
			}
			Requests.sendRequest(name, target, weapon, stage);
		})
		.on(`cmd:ratestage`, async (name, stage, rating) =>{
			if(!stage){
				this.omegga.whisper(name, `<code>Usage : /ratestage [stage_name] [0-5]</>`);
				return;
			}
			var realStage = DuelHandler.StagePool.find(a => a.name.toLowerCase() === stage.toLowerCase());
			var pl = this.omegga.findPlayerByName(name);
			if(!realStage){
				this.omegga.whisper(name, `<color="ff3333">Stage not found. Type <code>/liststages</> to see a list of stages.</>`);
				return
			}
			rating = parseInt(rating,10);
			if(typeof rating != "number" || isNaN(rating)){
				this.omegga.whisper(name, `<color="ff3333">Input a rating of 0-5.</>`);
				return
			}
			if(rating > 5 || rating < 0){
				rating = Math.min(Math.max(rating, 0),5);
				this.omegga.whisper(name, `<color="ffff33">Rating can't be greater than 5 or less than 0. Clamping to ${rating}.</>`)
			}
			var data = await this.store.get(realStage.name);
			if(!data){
				data = {'ratings':{}, 'avgrating':0, 'timesPlayed':0, 'favoriteWeapon':null};
			}
			if(!data.ratings[`'${pl.id}'`]){
				this.omegga.whisper(name, `<color="ffff33">You rated ${realStage.name} ${rating} out of 5.</>`);
			}
			else{
				this.omegga.whisper(name, `<color="ffff33">Changed rating of ${realStage.name} to ${rating}.</>`);
			}
			data.ratings[`'${pl.id}'`] = rating;
			var avg = 0;
			Object.keys(data.ratings).forEach(id => {
				avg += data.ratings[id];
			});
			avg /= Object.keys(data.ratings).length;
			data.avgrating = avg;
			await this.store.set(realStage.name, data);
			DuelHandler.scanStages();
			
		})
		.on('cmd:topstages', async(name, page) =>{
			var keys = await this.store.keys();
			var alldicts : any = [];
			for(var idx in keys){
				var data = await this.store.get(keys[idx]);
				var newstored : any = [keys[idx], data.avgrating, Object.keys(data.ratings).length];
				alldicts.push(newstored);
			}
			alldicts = alldicts.sort((a, z) => z[1] - a[1]);
			page = parseInt(page, 10);
			var sizeOfPage = 6;
			if(page <= 0 || isNaN(page)){
				page = 1;
			}
			if(typeof page != "number"){
				return;
			}
			var maxPage = Math.ceil(alldicts.length / sizeOfPage);
			page = Math.min(page, maxPage);
			this.omegga.whisper(name, `<color="ffaa88">--- TOP RATED STAGES PAGE ${page} OF ${maxPage} ---</>`);
			alldicts = alldicts.slice((page*sizeOfPage)-sizeOfPage, page*sizeOfPage);
			for(var idx in alldicts){
				var score = alldicts[idx][1];
				this.omegga.whisper(name, `<code>(</>${parseFloat(score).toFixed(1)}<code> - ${alldicts[idx][2]})</> <color="ffff00">${alldicts[idx][0]}</>`);
			}
		})
		.on('cmd:stageinfo', async(name, stagename) =>{
			//more info about a stage
		})
		.on('cmd:accept', async (name) =>{
			if(Requests.ongoing.find(a => a.sender === name)){
				this.omegga.whisper(name, `You can't accept your own request.`);
				return
			}
			if(Requests.hasRequest(name)){
				this.omegga.whisper(name, `<color="33ff33">Request accepted.</>`);
				Requests.acceptRequest(name);
				return
			}
			this.omegga.whisper(name, "You don't seem to have any requests at the moment.");
			return
		})
		.on('cmd:testload', async (name, stagename) =>{
		 DuelHandler.loadStageByName(stagename, this.omegga.findPlayerByName(name), true);
		})
		.on('cmd:savestage', async (name, stagename) =>{
			var pl = this.omegga.findPlayerByName(name);
			if(pl.isHost() || pl.getRoles().includes(this.config["Role-Can-Save-Stages"])){
				if(!stagename){
					this.omegga.whisper(name, `<code>Usage : /savestage [stage_name]</>`);
					return;
				}
				var selected = await pl.getTemplateBoundsData();
				var description;
				var author;
				var weaponlist : any = [];
				if(!selected){
					this.omegga.whisper(name, `<color="ff3333">[DUELING] Error - No bricks found in region.</>`);
					return;
				}
				// console.log(selected.components);
				if(selected.components.BCD_Interact){
					var index = selected.components.BCD_Interact.brick_indices[0];
					description = selected.bricks[index].components.BCD_Interact.Message;
					author = selected.bricks[index].components.BCD_Interact.ConsoleTag;
					if(!description){
						this.omegga.whisper(name, `<color="ff3333">[DUELING] Error - No Description found.</>`);
						this.omegga.whisper(name, `<color="ff3333">- Guide -</>`);
					this.omegga.whisper(name, `<code>Please put an Interact component with a Message and a Console Message.</>`);
						this.omegga.whisper(name, `<code>Message : (description)</>`);
						this.omegga.whisper(name, `<code>Console : (author & author...)</>`);
						this.omegga.whisper(name, `<code>Note : You can't have more than 1 interact component.</>`);
					}
					if(!author){
						this.omegga.whisper(name, `<color="ff3333">[DUELING] Error - No Author found.</>`);
						this.omegga.whisper(name, `<color="ff3333">- Guide -</>`);
						this.omegga.whisper(name, `<code>Please put an Interact component with a Message and a Console Message.</>`);
						this.omegga.whisper(name, `<code>Message : (description)</>`);
						this.omegga.whisper(name, `<code>Console : (author & author...)</>`);
					}
					this.omegga.whisper(name, `<color="33ff33">Interact Component Found!</>`);
					this.omegga.whisper(name, `<code>Description : ${description}</>`);
					this.omegga.whisper(name, `<code>Author(s) : ${author}</>`);
				}
				else{
					this.omegga.whisper(name, `<color="ff3333">[DUELING] Error - No Interact Component found. (Need 1 Interact Component)</>`);
					this.omegga.whisper(name, `<color="ff3333">- Guide -</>`);
					this.omegga.whisper(name, `<code>Please put an Interact component with a Message and a Console Message.</>`);
					this.omegga.whisper(name, `<code>Message : (description)</>`);
					this.omegga.whisper(name, `<code>Console : (author & author...)</>`);
					this.omegga.whisper(name, `<code>Note : You can't have more than 1 interact component.</>`);
					return;
				}
				const PickupToWeapon = {
					"Weapon_SniperRifle" : "Weapon_Sniper",
					"Weapon_ImpactGrenadeLauncher1" : "Weapon_ImpactGrenadeLauncher"
				};
				if(selected.components.BCD_ItemSpawn){
					var spawners = selected.components.BCD_ItemSpawn.brick_indices;
					var weaponlist : any = [];
					spawners.forEach(element => {
						var brickweapon = selected.bricks[element].components.BCD_ItemSpawn.PickupClass.replace("BP_ItemPickup_","Weapon_");
						if(PickupToWeapon[brickweapon]){
							brickweapon = PickupToWeapon[brickweapon];
						}
						if(!weaponlist.includes(brickweapon)){
							weaponlist.push(brickweapon);
						}});
					weaponlist.forEach(element => {this.omegga.whisper(name, `<color="33ff33">Weapon Component Found - ${element}</>`);});
				}
				else{
					this.omegga.whisper(name, `<color="ff3333">[DUELING] Error - No weapons found on the map to retrieve weapon list from.</>`);
				}
				//One last thing, set each brick's owner index to index 1.
				selected.bricks.forEach(element => element.owner_index = 1);
				
				//Now that we have a decent list of map information, let's create a Stage save file, with a Stage object in its description.
				//Our current working directory is blahblah/serverDueling/ . To get to the Builds folder, we go to data/Saved/Builds/
				const builddir = "data/Saved/Builds/Dueling/stages/";
				//The first thing we want to do, is create a folder with the Author's name. Then, save the selected bricks in there.
				//We can then either write a .JSON file, or put the necessary JSON in the build's 'description'
				const savePath = builddir + author;
				
				var descriptionObject = {"name" : stagename, "savePath" : "Dueling/stages/" + author + "/" + stagename, "author" : author, "description" : description, "date" : new Date().toDateString(), "weaponlist" : weaponlist};
				selected.description = JSON.stringify(descriptionObject);
				console.log(selected.description);
				fs.mkdir(builddir + author, (err, files) => {
				if(err)
					if(err.code === 'EEXIST'){
						console.log("[Dueling] - Directory "+savePath+" already exists. Shouldn't be an issue.");
					}
				else{
					console.log("\Author Directory Created!");
					//Created the directory, time to save selected bricks in it. Name the brs file the stagename.
					}
				try{
					this.omegga.writeSaveData("Dueling/stages/"+author+"/"+stagename, selected);
				}
				catch(error){
					console.error(error);
				}
				setTimeout(()=>{DuelHandler.scanStages();}, 500);
				});
			}
			else{
				this.omegga.whisper("You cannot save stages. You do not have the following role : " + this.config["Role-Can-Save-Stages"]);
			}
		})
		.on('cmd:liststages', async (name, page) => {
			page = parseInt(page, 10);
			var sizeOfPage = 3;
			if(page <= 0 || isNaN(page)){
				page = 1;
			}
			if(typeof page != "number"){
				return;
			}
			var all :any= await DuelHandler.StagePool;
			var maxPage = Math.ceil(all.length / sizeOfPage);
			page = Math.min(page, maxPage);
			this.omegga.whisper(name, `<color="ffaa88">--- ALL STAGES PAGE ${page} OF ${maxPage} ---</>`);
			all = all.slice((page*sizeOfPage)-sizeOfPage, page*sizeOfPage);
			for(var idx in all){
				var extraInfo = await this.store.get(all[idx].name);
				var score = "";
				if(extraInfo){
					for(var i = 0; i < 5; i++){
						score += i < extraInfo.avgrating ? "<emoji>brick</>" : "<emoji>microbrick</>";
					}
				}
				else{	
					score = "<emoji>microbrick</><emoji>microbrick</><emoji>microbrick</><emoji>microbrick</><emoji>microbrick</>";
				}
				this.omegga.whisper(name, `<color="ffff00">${all[idx].name}</> by ${all[idx].author} <code>(</>${score}<code>)</></>`);
				this.omegga.whisper(name, `<code>${all[idx].description}</>`);
			}
		})
		.on('cmd:listweapons', async (name)=>{
			var info = Object.keys(DuelHandler.gun_names);
			const chunkSize = 3;
			for (let i = 0; i < info.length; i += chunkSize) {
				const chunk = info.slice(i, i + chunkSize);
				this.omegga.whisper(name,`<code>${chunk.toString().replaceAll(" ", "_").replaceAll("," , " || ")}</>`);
			}
			this.omegga.whisper(name, `<code>Page Up</> to see the full list.`)
		})
		.on('cmd:weaponsearch', async (name, weaponname)=>{
			var pl = this.omegga.findPlayerByName(name);
			if(weaponname){
				var classname = DuelHandler.findWeapon(name, weaponname);
				if(!classname){
					return
				}
				var list = await DuelHandler.findStagesWithWeapon(classname);
				this.omegga.whisper(name, `<color="ffff33">The following stages allow the ${weaponname.replace("_"," ")}</>`);
				list.forEach(element => this.omegga.whisper(name, `${element.name.replace("_", " ")} <code> by ${element.author}</>`));
			}
			else{
				//No weapon specified. Get all stages' and list their weapons.
				var list = DuelHandler.StagePool;
				this.omegga.whisper(name, `<color="ffff33">All stages and their allowed weapons.</>`);
				list.forEach(element => this.omegga.whisper(name, `${element.name} <code>${element.weaponlist}</>`));
			}
		})
		.on('cmd:decline', async (name) => {
			if(Requests.ongoing.find(a => a.sender === name)){
				this.omegga.whisper(name, "You can't deny your own request.");
				return
			}
			if(Requests.hasRequest(name)){
				this.omegga.whisper(name, "Request declined.");
				Requests.remove(Requests.ongoing.find(a => a.reciever === name), 'declined');
				return
			}
			this.omegga.whisper(name, "You don't seem to have any requests at the moment.");
			return
		})
    const minigameEvents = await this.omegga.getPlugin('minigameevents')
    if (minigameEvents) {
      console.log('subscribing to minigameevents')
      minigameEvents.emitPlugin('subscribe')
    } else {
      throw Error("minigameevents plugin is required for this to plugin")
    }
	return { registeredCommands: ['duel', 'accept', 'decline', 'savestage', 'liststages', 'weaponsearch', 'listweapons', 'ratestage', 'topstages']};
  }
  
  async stop() {
	this.omegga.broadcast("DUELING - Clearing ongoing duels...");
	for(var idx in DuelHandler.ongoingBattles){
		DuelHandler.ongoingBattles.End();
	}
	this.omegga
		.removeAllListeners('cmd:duel')
		.removeAllListeners('cmd:accept')
		.removeAllListeners('cmd:decline')
		.removeAllListeners('cmd:savestage')
		.removeAllListeners('cmd:liststages');
    // Unsubscribe to the minigame events plugin
    const minigameEvents = await this.omegga.getPlugin('minigameevents')
    if (minigameEvents) {
      console.log('unsubscribing from minigameevents')
      minigameEvents.emitPlugin('unsubscribe')
    } else {
      throw Error("minigameevents plugin is required for this to plugin")
    }
  }
  
  

  async pluginEvent(event: string, from: string, ...args: any[]) {
	//Omegga.broadcast(event);
	if(event === 'roundchange'){
		const mg = args[0];
		if(mg){
			var theduel :DuelHandler.Battle = DuelHandler.ongoingBattles.find(a => a.minigamename === mg.name);
			if(theduel){
				theduel.changingRound = false;
				theduel.displayScore();	
			}
		}
	}
	if(event === 'leaveminigame'){
		const [{player, minigame}] = args;
		if(minigame.name !== "GLOBAL"){
			var theduel :DuelHandler.Battle = DuelHandler.ongoingBattles.find(a => a.minigamename === minigame.name);
			if(theduel){
				if(DuelHandler.isInDuel(player.name)){
					theduel.End();
					return;
				}
			}
		}
	}
	if(event === 'roundend'){
		const mg = args[0];
		if(mg.name != "LOBBY" || mg.name != "GLOBAL"){
			var theduel :DuelHandler.Battle = DuelHandler.ongoingBattles.find(a => a.minigamename === mg.name);
			if(theduel){
				setTimeout(async ()=>{theduel.changingRound = true;
					var deadcheck = await this.omegga.getAllPlayerPositions();
					var p1 = deadcheck.find(Player => Player.player.name === theduel.fighterAttacking.Player.name);
					var p2 = deadcheck.find(Player => Player.player.name === theduel.fighterDefending.Player.name);
					if(p1 && p2){
						if(!p1.isDead && !p2.isDead){
							theduel.givePointsByScore();
						}
					}	
				},100);
			}
		}
	}
	if(event === 'death'){
		const [{player, minigame, leaderboard, oldLeaderboard}] = args;
		var theduel :DuelHandler.Battle = DuelHandler.ongoingBattles.find(a => a.minigamename === minigame.name);
		console.log(minigame);
		if(theduel){
			//Give the other fighter a point, since ya died.
			if(!theduel.changingRound){
				theduel.givePoints(theduel.getEnemyOf(player.name), this.config["Points-On-Kill"]);
			}
			var enemyfighter = theduel.getEnemyOf(player.name);
			if(await enemyfighter.Player.getScore(0) > 0){
				Omegga.middlePrint(theduel.fighterAttacking.Player.name, `<bold><size="50"><color="ffffff">Perfect!</></></>`);
				Omegga.middlePrint(theduel.fighterDefending.Player.name, `<bold><size="50"><color="ffffff">Perfect!</></></>`);
				setTimeout(()=>{
					Omegga.middlePrint(theduel.fighterAttacking.Player.name, `<bold><size="50"><color="ffff33">Perfect!</></></>`);
					Omegga.middlePrint(theduel.fighterDefending.Player.name, `<bold><size="50"><color="ffff33">Perfect!</></></>`);
				}, 150)
				setTimeout(()=>{
					Omegga.middlePrint(theduel.fighterAttacking.Player.name, `<bold><size="50"><color="ffffff">Perfect!</></></>`);
					Omegga.middlePrint(theduel.fighterDefending.Player.name, `<bold><size="50"><color="ffffff">Perfect!</></></>`);
				}, 300)
				setTimeout(()=>{
					Omegga.middlePrint(theduel.fighterAttacking.Player.name, `<bold><size="50"><color="ffff33">Perfect!</></></>`);
					Omegga.middlePrint(theduel.fighterDefending.Player.name, `<bold><size="50"><color="ffff33">Perfect!</></></>`);
				}, 450)
				}
			}
		}
	}
}