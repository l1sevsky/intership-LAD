const monster = {
	maxHealth: 10,
	name: "Лютый",
	moves: [
		{
			id: 1,
			"name": "Удар когтистой лапой",
			"physicalDmg": 3, // физический урон
			"magicDmg": 0,    // магический урон
			"physicArmorPercents": 20, // физическая броня
			"magicArmorPercents": 20,  // магическая броня
			"cooldown": 0     // ходов на восстановление
		},
		{
			id: 2,
			"name": "Огненное дыхание",
			"physicalDmg": 0,
			"magicDmg": 4,
			"physicArmorPercents": 0,
			"magicArmorPercents": 0,
			"cooldown": 3
		},
		{
			id: 3,
			"name": "Удар хвостом",
			"physicalDmg": 2,
			"magicDmg": 0,
			"physicArmorPercents": 50,
			"magicArmorPercents": 0,
			"cooldown": 2
		},
	]
}

const wizard = {
	name: "Евстафий",
	moves: [
		{
			id: 1,
			"name": "Удар боевым кадилом",
			"physicalDmg": 2,
			"magicDmg": 0,
			"physicArmorPercents": 0,
			"magicArmorPercents": 50,
			"cooldown": 0
		},
		{
			id: 2,
			"name": "Вертушка левой пяткой",
			"physicalDmg": 4,
			"magicDmg": 0,
			"physicArmorPercents": 0,
			"magicArmorPercents": 0,
			"cooldown": 4
		},
		{
			id: 3,
			"name": "Каноничный фаербол",
			"physicalDmg": 0,
			"magicDmg": 5,
			"physicArmorPercents": 0,
			"magicArmorPercents": 0,
			"cooldown": 3
		},
		{
			id: 4,
			"name": "Магический блок",
			"physicalDmg": 0,
			"magicDmg": 0,
			"physicArmorPercents": 100,
			"magicArmorPercents": 100,
			"cooldown": 4
		},
	]
}


let wizardState = {}, monsterState = {}, currentRound;


document.getElementById("start-game-2").onclick = () => {
	let difficultyRadios = document.querySelectorAll("input[name=difficulty]");

	for (let radio of difficultyRadios)
		if (radio.checked == true) {
			wizardState.health = +radio.value;
			break;
		}

	monsterState.health = monster.maxHealth;
	monsterState.name = monster.name;
	wizardState.name = wizard.name;

	monsterState.cooldowns = [];
	for (let move of monster.moves)
		monsterState.cooldowns.push(0);

	wizardState.cooldowns = [];
	for (let move of wizard.moves) 
		wizardState.cooldowns.push(0);

	currentRound = 1;

	startGameRPG();
}


function startGameRPG() {
	document.getElementById("params-2").classList.add("hidden");
	document.getElementById("game-field-2").classList.remove("hidden");

	document.getElementById("round-number").innerHTML = currentRound;
	document.getElementById("monster-health").innerHTML = monsterState.health;
	document.getElementById("wizard-health").innerHTML = wizardState.health;
	document.getElementById("monster-name").innerHTML = monsterState.name;
	document.getElementById("wizard-name").innerHTML = wizardState.name;

	createAttackButtonsRPG();
	getMonsterMoveRPG();
}


function createAttackButtonsRPG() {
	for (let move of wizard.moves) {
		let btn = document.createElement("button");
		btn.dataset.moveId = move.id;
		btn.classList.add("attack-btn");

		insertMoveDescriptionRPG(move, btn);

		document.getElementById("attack-buttons").append(btn);
	}

	let buttonsBlock = document.getElementById("attack-buttons");
	buttonsBlock.onclick = event => {
		if (event.target.tagName == "BUTTON")
			blowStrikeRPG(Number(event.target.dataset.moveId) - 1);
	}
}


function getMonsterMoveRPG() {
	let monsterMoveId;

	while(true) {
		monsterMoveId = getRandomInt(0, monster.moves.length); // getRandomInt в файле game1.js
		if (monsterState.cooldowns[monsterMoveId] == 0)
			break;
	}

	let move = monster.moves[monsterMoveId];
	let place = document.getElementById("monster-attack-info");

	monsterState.currentMove = move;
	monsterState.cooldowns[move.id - 1] = move.cooldown;
	insertMoveDescriptionRPG(move, place);
}


function blowStrikeRPG(moveId) {
	let move = wizard.moves[moveId];

	wizardState.currentMove = move;
	insertMoveDescriptionRPG(move, document.getElementById("wizard-attack-info"));

	wizardState.cooldowns[moveId] = move.cooldown;

	startFightRPG();
}


function startFightRPG() {
	document.getElementById("attack-buttons").classList.add("hidden");
	document.getElementById("fight-title").classList.remove("hidden");

	damageCalculationRPG();

	setTimeout(() => {
		document.getElementById("monster-attack-info").innerHTML = "";
		document.getElementById("monster-health").innerHTML = monsterState.health;
		document.getElementById("monster-health").classList.add("update");

		document.getElementById("wizard-attack-info").innerHTML = "";
		document.getElementById("wizard-health").innerHTML = wizardState.health;
		document.getElementById("wizard-health").classList.add("update");
	}, 1000);

	setTimeout(() => {
		document.getElementById("monster-health").classList.remove("update");
		document.getElementById("wizard-health").classList.remove("update");
	
		newIterationBattleRPG();
	}, 3000);
}


function damageCalculationRPG() {
	let newWizardHealth = Math.floor(wizardState.health - 
		(monsterState.currentMove.physicalDmg - monsterState.currentMove.physicalDmg / 
			100 * wizardState.currentMove.physicArmorPercents) -
		(monsterState.currentMove.magicDmg - monsterState.currentMove.magicDmg /
			100 * wizardState.currentMove.magicArmorPercents));

	let newMonsterHealth = Math.floor(monsterState.health - 
		(wizardState.currentMove.physicalDmg - wizardState.currentMove.physicalDmg / 
			100 * monsterState.currentMove.physicArmorPercents) -
		(wizardState.currentMove.magicDmg - wizardState.currentMove.magicDmg /
			100 * monsterState.currentMove.magicArmorPercents));

	(newMonsterHealth < 0) ? (monsterState.health = 0) : (monsterState.health = newMonsterHealth);
	(newWizardHealth < 0) ? (wizardState.health = 0) : (wizardState.health = newWizardHealth);
}


function newIterationBattleRPG() {
	if (monsterState.health == 0 || wizardState.health == 0) {
		gameOverRPG();
		return;
	}

	updateAttackButtonsRPG();
	getMonsterMoveRPG();
	updateCooldownsRPG();

	currentRound++;
	document.getElementById("round-number").innerHTML = currentRound;

	document.getElementById("attack-buttons").classList.remove("hidden");
	document.getElementById("fight-title").classList.add("hidden");
}


function updateCooldownsRPG() {
	for (let i = 0; i < monsterState.cooldowns.length; i++)
		if (monsterState.cooldowns[i] != 0)
			monsterState.cooldowns[i] -= 1;

	for (let i = 0; i < wizardState.cooldowns.length; i++)
		if (wizardState.cooldowns[i] != 0)
			wizardState.cooldowns[i] -= 1;
}


function updateAttackButtonsRPG() {
	let buttons = document.querySelectorAll(".attack-btn");

	for (let i = 0; i < buttons.length; i++) {
		let moveId = Number(buttons[i].dataset.moveId) - 1;
		if (wizardState.cooldowns[moveId] != 0)
			buttons[i].disabled = true;
		else
			buttons[i].disabled = false;
	}
}


function gameOverRPG() {
	document.getElementById("attack-info").classList.add("hidden");
	document.getElementById("attack-buttons").classList.add("hidden");
	document.getElementById("fight-title").classList.add("hidden");
	document.getElementById("fight-result").classList.remove("hidden");

	if (monsterState.health == 0 && wizardState.health == 0) {
		document.getElementById("fight-result").innerHTML = "Ничья!";
		document.querySelector("#monster-block img").classList.add("defeat");
		document.querySelector("#wizard-block img").classList.add("defeat");
	}
	else if (monsterState.health == 0) {
		document.getElementById("fight-result").innerHTML = "Вы победили!";
		document.querySelector("#monster-block img").classList.add("defeat");
		document.querySelector("#wizard-block img").classList.add("win");
	}
	else if (wizardState.health == 0) {
		document.getElementById("fight-result").innerHTML = "Вы проиграли!";
		document.querySelector("#monster-block img").classList.add("win");
		document.querySelector("#wizard-block img").classList.add("defeat");
	}

	setTimeout(reloadGameFieldRPG, 5000);
}


function reloadGameFieldRPG() {
	document.getElementById("attack-info").classList.remove("hidden");
	document.getElementById("attack-buttons").classList.remove("hidden");
	document.getElementById("attack-buttons").innerHTML = "";
	document.getElementById("fight-result").classList.add("hidden");

	let images = document.querySelectorAll(".player-block img");
	for (let img of images) {
		img.classList.remove("defeat");
		img.classList.remove("win");
	}

	document.getElementById("params-2").classList.remove("hidden");
	document.getElementById("game-field-2").classList.add("hidden");

	wizardState = {}, monsterState = {}, currentRound;
}


function insertMoveDescriptionRPG(move, element) {
	let description = `${move.name}<br>
		Урон: 💪${move.physicalDmg} / 🔮${move.magicDmg}<br>
		Защита: 🛡${move.physicArmorPercents}% / 🌀${move.magicArmorPercents}%<br>
		Перезарядка: ${move.cooldown}х.`;

	element.insertAdjacentHTML("beforeend", description);
}