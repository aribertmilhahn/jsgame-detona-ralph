const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        startButton: document.querySelector("#start-button"),
        rank: document.querySelector("#rank-table"),
    },
    values: {
        rank: [],
        hitPosition: 0,
        squareIndex: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        gameover: false,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    }
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        gameover();
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    state.values.squareIndex = randomNumber;
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (state.values.gameover) {
                return;
            }
            else if(square.id === state.values.hitPosition) {
                playSound("hit");
                state.view.squares[state.values.squareIndex].classList.remove("enemy");
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
            }
            else {
                state.values.lives--;
                if (state.values.lives < 0) {
                    gameover();
                }
                else {
                    state.view.lives.textContent = `x${state.values.lives}`;
                }
            }
        });
    });
}

addListenerHitBox();

function reset() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    state.view.squares[state.values.squareIndex].classList.remove("enemy");
    state.values.gameover = true;
    state.values.hitPosition = 0;
    state.values.squareIndex = 0;
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = `x${state.values.lives}`;
}

function gameover() {
    state.view.startButton.disabled = false;
    let name = prompt("Game Over! O seu resultado foi: " + state.values.result + "\nPor favor digite seu nome(máximo de 10 caracteres)");
    state.values.rank.push({name: name, score: state.values.result});
    reset();
    updateRank();
}

function convertPlayerToTR(player, index) {
    return `<tr class="rank-position"><td>${index + 1}.</td><td class="rank-name">${player.name}</td><td class="table-score">${player.score}</td></tr>`;
}

function updateRank() {
    state.values.rank.sort(function (player1, player2) {
        if (player1.score >= player2.score) {
            return -1;
        }
        else {
            return 1;
        }
    });
    
    const tableRows = [];
    const emptyRank = {name: "AAA", score: 0};
    for (let index = 0; index < 9; index++){
        if(state.values.rank[index]) {
            tableRows.push(convertPlayerToTR(state.values.rank[index], index));
        }
        else {
            tableRows.push(convertPlayerToTR(emptyRank, index + 1));
        }
    }
    console.log(tableRows.join(''));
    state.view.rank.innerHTML = tableRows.join('');
}

function initialize() {
    reset();
    state.actions.timerId = setInterval(randomSquare, 1000),
    state.actions.countDownTimerId = setInterval(countDown, 1000),
    state.values.gameover = false;
    state.view.startButton.disabled = true;
}

state.view.startButton.addEventListener("click", initialize);