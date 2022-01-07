let minNumber, maxNumber, movesTotal, movesLeft, desiredNumber, desiredNumberLength; 


document.getElementById("start-game-1").onclick = () => {
	let moves = +document.getElementById("moves").value;
	let numberLength = +document.getElementById("word-len").value;

	let sign = isNaN(moves) || isNaN(numberLength) || moves < 1 || 
		numberLength < 3 || numberLength > 6;

	if (sign)
		showError("error-input-1");
	else
		startGame(moves, numberLength);
}


document.getElementById("check-game-1").onclick = () => {
	let inputedValue = +document.getElementById("suggestion").value;

	let sign = isNaN(inputedValue) || inputedValue < minNumber || inputedValue > maxNumber;

	if (sign)
		showError("error-check-1");
	else 
		gameIteration(inputedValue);
}


function startGame(moves, numberLength) {
	desiredNumberLength = numberLength;
	minNumber = Math.pow(10, numberLength-1);
	maxNumber = minNumber * 10 - 1;

	desiredNumber = getRandomInt(minNumber, maxNumber);
	movesTotal = moves;
	movesLeft = moves;

	document.getElementById("params-1").classList.add("hidden");
	document.getElementById("game-field-1").classList.remove("hidden");
	document.getElementById("moves-left-1").innerHTML = movesLeft;
}


function showError(idElement) {
	let errorAnswer = document.getElementById(idElement);
	errorAnswer.classList.remove("hidden");

	setTimeout(() => {
		let errorAnswer = document.getElementById(idElement);
		errorAnswer.classList.add("hidden");
	}, 3000);
}


function gameIteration(inputedValue) {
	movesLeft -= 1;

	let answer;
	let result = compareNumbers(inputedValue);

	if (result.right.length == desiredNumberLength) {
		endGame("Поздравляю, вы угадали!");
		return;
	}
	else if (movesLeft == 0) {
		document.getElementById("moves-left-1").innerHTML = movesLeft;
		endGame("К сожалению, вы проиграли! Верный ответ - " + String(desiredNumber));
		return;
	}
	
	if (result.exist.length != 0)
		answer = "Cовпавших цифр не на своих местах - " + String(result.exist.length) +
			"(" + result.exist.toString() + ")";
	else
		answer = "Cовпавших цифр не на своих местах - 0";

	if (result.right.length != 0)
		answer += ", цифр на своих местах - " + String(result.right.length) +
			"(" + result.right.toString() + ")";
	else
		answer += ", цифр на своих местах - 0"; 
	
	document.getElementById("answer-1").innerHTML = answer;
	document.getElementById("moves-left-1").innerHTML = movesLeft;
}


function compareNumbers(inputedValue) {
	let desired = String(desiredNumber);
	let inputed = String(inputedValue);

	let signPositions = [], rightNumbers = [], existNumbers = [];

	for (let i = 0; i < desired.length; i++)
		if (desired[i] == inputed[i]) {
			rightNumbers.push(inputed[i]);
			signPositions[i] = true;
		}
	
	for (let i = 0; i < inputed.length; i++)
		for (let k = 0; k < desired.length; k++)
			if (inputed[i] == desired[k] && signPositions[k] != true) {
				existNumbers.push(inputed[i]);
				signPositions[k] = true;
			}


	return {
		right: rightNumbers,
		exist: existNumbers
	}
}


function endGame(gameResult) {
	document.getElementById("answer-1").innerHTML = gameResult;

	setTimeout(() => {
		document.getElementById("params-1").classList.remove("hidden");
		document.getElementById("game-field-1").classList.add("hidden");
		document.getElementById("answer-1").innerHTML = "";
		document.getElementById("suggestion").value = "";
	}, 7000);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}