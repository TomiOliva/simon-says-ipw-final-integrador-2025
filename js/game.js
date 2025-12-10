'use strict';

var SIMON_COLORS = ['green', 'red', 'yellow', 'blue'];
var simonSequence = [];
var playerIndex = 0;
var currentLevel = 1;
var currentScore = 0;
var elapsedSeconds = 0;
var timerId = null;
var startTimestamp = null;
var isPlayerTurn = false;
var sortMode = 'score';

var simonButtons = {};
var navLinks;
var btnStart;
var btnRestart;
var btnResetGame;
var btnExitGame;
var btnShowRanking;
var btnCloseRanking;
var btnSortScore;
var btnSortDate;
var levelLabel;
var scoreLabel;
var timeLabel;
var gameOverModal;
var rankingModal;
var rankingContainer;
var finalLevelLabel;
var initialScoreLabel;
var finalScoreLabel;
var finalTimeLabel;
var finalMessage;
var finalPenaltyLabel;
var boardCenter;
var SEQUENCE_DELAY = 700;
var PLAYER_HIGHLIGHT_MS = 320;
var timePenalty = 0;

function getElement(id) {
    return document.getElementById(id);
}

function cacheGameDom() {
    
    simonButtons.green = getElement('btn-green');
    simonButtons.red = getElement('btn-red');
    simonButtons.yellow = getElement('btn-yellow');
    simonButtons.blue = getElement('btn-blue');
    boardCenter = document.querySelector('.board-center');
    navLinks = document.querySelectorAll('.nav-link');

    btnStart = getElement('btn-start');
    btnRestart = getElement('btn-restart');
    btnResetGame = getElement('btn-reset-game');
    btnExitGame = getElement('btn-exit');
    btnShowRanking = getElement('btn-show-ranking');
    btnCloseRanking = getElement('btn-close-ranking');
    btnSortScore = getElement('btn-sort-score');
    btnSortDate = getElement('btn-sort-date');

    levelLabel = getElement('current-level');
    scoreLabel = getElement('current-score');
    timeLabel = getElement('elapsed-time');

    gameOverModal = getElement('game-over-modal');
    rankingModal = getElement('ranking-modal');
    rankingContainer = getElement('ranking-container');
    finalLevelLabel = getElement('final-level');
    initialScoreLabel = getElement('initial-score');
    finalScoreLabel = getElement('final-score');
    finalTimeLabel = getElement('final-time');
    finalMessage = document.querySelector('.final-message');
    finalPenaltyLabel = getElement('final-penalty');
}

function useHidden(element, shouldHide) {
    if (!element) {
        return;
    }
    if (shouldHide) {
        if (typeof hideElement === 'function') {
            hideElement(element);
        } else {
            element.classList.add('hidden');
        }
        return;
    }
    if (typeof showElement === 'function') {
        showElement(element);
    } else {
        element.classList.remove('hidden');
    }
}

function updateLevelLabel() {
    if (levelLabel) {
        levelLabel.textContent = currentLevel;
    }
}

function updateScoreLabel() {
    if (scoreLabel) {
        scoreLabel.textContent = currentScore;
    }
}

function updateTimeLabel() {
    if (timeLabel) {
        timeLabel.textContent = elapsedSeconds + 's';
    }
}

function setButtonsEnabled(enabled) {
    var color;
    for (color in simonButtons) {
        if (simonButtons.hasOwnProperty(color) && simonButtons[color]) {
            simonButtons[color].disabled = !enabled;
        }
    }
}

function preventNavClick(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
    }
}

function setNavLinksDisabled(disabled) {
    var i;
    if (!navLinks || !navLinks.length) {
        return;
    }
    for (i = 0; i < navLinks.length; i++) {
        if (!navLinks[i]) {
            continue;
        }
        if (disabled) {
            navLinks[i].classList.add('nav-link-disabled');
            navLinks[i].setAttribute('aria-disabled', 'true');
            navLinks[i].setAttribute('tabindex', '-1');
            navLinks[i].addEventListener('click', preventNavClick);
        } else {
            navLinks[i].classList.remove('nav-link-disabled');
            navLinks[i].removeAttribute('aria-disabled');
            navLinks[i].removeAttribute('tabindex');
            navLinks[i].removeEventListener('click', preventNavClick);
        }
    }
}

function flashButton(color) {
    var button = simonButtons[color];
    if (!button) {
        return;
    }
    button.classList.add('active');
    setTimeout(function () {
        button.classList.remove('active');
    }, PLAYER_HIGHLIGHT_MS);
}

function getRandomColor() {
    var index;
    index = Math.floor(Math.random() * SIMON_COLORS.length);
    return SIMON_COLORS[index];
}

function addStepToSequence() {
    simonSequence.push(getRandomColor());
    currentLevel = simonSequence.length;
    updateLevelLabel();
}

function playSequence() {
    var i;
    isPlayerTurn = false;
    setButtonsEnabled(false);
    playerIndex = 0;

    for (i = 0; i < simonSequence.length; i++) {
        (function (color, index) {
            setTimeout(function () {
                flashButton(color);
            }, SEQUENCE_DELAY * (index + 1));
        })(simonSequence[i], i);
    }

    setTimeout(function () {
        isPlayerTurn = true;
        setButtonsEnabled(true);
    }, SEQUENCE_DELAY * simonSequence.length + 200);
}

function resetGameState() {
    simonSequence = [];
    playerIndex = 0;
    currentLevel = 1;
    currentScore = 0;
    elapsedSeconds = 0;
    timePenalty = 0;
    stopTimer();
    updateLevelLabel();
    updateScoreLabel();
    updateTimeLabel();
    setButtonsEnabled(false);
    useHidden(gameOverModal, true);
}

function startTimer() {
    stopTimer();
    startTimestamp = Date.now();
    elapsedSeconds = 0;
    updateTimeLabel();
    timerId = setInterval(function () {
        var now = Date.now();
        elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
        updateTimeLabel();
    }, 500);
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (startTimestamp !== null) {
        elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
        startTimestamp = null;
        updateTimeLabel();
    }
}

function isPlayerNameValid() {
    if (typeof isNameValid === 'function') {
        return isNameValid(playerName);
    }
    return !!playerName && playerName.length >= 3;
}

function requestPlayerName() {
    if (typeof showElement === 'function' && typeof hideElement === 'function') {
        showElement(nameModal);
        hideElement(gameArea);
    } else if (nameModal) {
        nameModal.classList.remove('hidden');
    }
    if (inputName && inputName.focus) {
        inputName.focus();
    }
}

function startGame(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    if (!isPlayerNameValid()) {
        requestPlayerName();
        return;
    }
    setNavLinksDisabled(true);
    useHidden(boardCenter, true);
    useHidden(gameOverModal, true);
    resetGameState();
    startTimer();
    addStepToSequence();
    setTimeout(playSequence, 400);
}

function goToNextRound() {
    isPlayerTurn = false;
    setTimeout(function () {
        setButtonsEnabled(false);
    }, PLAYER_HIGHLIGHT_MS);
    setTimeout(function () {
        addStepToSequence();
        playSequence();
    }, 600);
}

function onSimonButtonClick(event) {
    var target;
    var color;
    var expectedColor;
    target = event ? event.currentTarget : null;
    if (!target || !isPlayerTurn) {
        return;
    }
    color = target.getAttribute('data-color');
    flashButton(color);
    expectedColor = simonSequence[playerIndex];
    if (color !== expectedColor) {
        handleGameOver('Secuencia incorrecta');
        return;
    }
    currentScore += 1;
    updateScoreLabel();
    playerIndex += 1;

    if (playerIndex === simonSequence.length) {
        goToNextRound();
    }
}

function calculateFinalScore() {
    var baseScore = currentScore || 0;
    var seconds = elapsedSeconds || 0;
    timePenalty = Math.floor(seconds / 5);
    return Math.max(baseScore - timePenalty, 0);
}

function formatDate(isoString) {
    var date;
    var day;
    var month;
    var year;
    var hours;
    var minutes;
    if (!isoString) {
        return '';
    }
    date = new Date(isoString);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    hours = date.getHours();
    minutes = date.getMinutes();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

function saveResult(finalScore) {
    var result;
    if (typeof addGameResult !== 'function') {
        return;
    }
    result = {
        nombre: playerName || 'Jugador',
        puntaje: finalScore,
        nivel: currentLevel,
        fecha: new Date().toISOString(),
        tiempo: elapsedSeconds
    };
    addGameResult(result);
}

function updateFinalModal(finalScore, reason) {
    if (finalLevelLabel) {
        finalLevelLabel.textContent = currentLevel;
    }
    if (initialScoreLabel) {
        initialScoreLabel.textContent = currentScore;
    }
    if (finalScoreLabel) {
        finalScoreLabel.textContent = finalScore;
    }
    if (finalTimeLabel) {
        finalTimeLabel.textContent = elapsedSeconds + 's';
    }
    if (finalPenaltyLabel) {
        finalPenaltyLabel.textContent = timePenalty;
    }
    if (finalMessage) {
        finalMessage.textContent = reason || 'Secuencia incorrecta';
    }
}

function handleGameOver(reason) {
    var finalScore;
    stopTimer();
    setButtonsEnabled(false);
    isPlayerTurn = false;
    setNavLinksDisabled(false);
    finalScore = calculateFinalScore();
    updateFinalModal(finalScore, reason);
    saveResult(finalScore);
    renderRanking();
    useHidden(gameOverModal, false);
}

function clearRankingActive() {
    if (btnSortScore) {
        btnSortScore.classList.remove('active');
    }
    if (btnSortDate) {
        btnSortDate.classList.remove('active');
    }
}

function renderRanking() {
    var results;
    var list;
    var i;
    var row;
    var nameSpan;
    var scoreSpan;
    var infoSpan;
    if (!rankingContainer) {
        return;
    }
    while (rankingContainer.firstChild) {
        rankingContainer.removeChild(rankingContainer.firstChild);
    }
    if (typeof loadGameResults === 'function') {
        results = loadGameResults();
    } else {
        results = [];
    }
    if (!results || !results.length) {
        row = document.createElement('p');
        row.className = 'empty-message';
        row.textContent = 'No hay partidas registradas aun';
        rankingContainer.appendChild(row);
        return;
    }
    list = results.slice(0);
    list.sort(function (a, b) {
        if (sortMode === 'date') {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        }
        return (b.puntaje || 0) - (a.puntaje || 0);
    });
    for (i = 0; i < list.length; i++) {
        row = document.createElement('div');
        row.className = 'ranking-row';

        nameSpan = document.createElement('span');
        nameSpan.className = 'ranking-player';
        nameSpan.textContent = list[i].nombre || 'Jugador';

        scoreSpan = document.createElement('span');
        scoreSpan.className = 'ranking-score';
        scoreSpan.textContent = 'Puntaje: ' + (list[i].puntaje || 0);

        infoSpan = document.createElement('span');
        infoSpan.className = 'ranking-info';
        infoSpan.textContent = 'Nivel ' + (list[i].nivel || 1) + ' - ' + formatDate(list[i].fecha);

        row.appendChild(nameSpan);
        row.appendChild(scoreSpan);
        row.appendChild(infoSpan);
        rankingContainer.appendChild(row);
    }
}

function onSortScore(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    sortMode = 'score';
    clearRankingActive();
    if (btnSortScore) {
        btnSortScore.classList.add('active');
    }
    renderRanking();
}

function onSortDate(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    sortMode = 'date';
    clearRankingActive();
    if (btnSortDate) {
        btnSortDate.classList.add('active');
    }
    renderRanking();
}

function onShowRanking(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    renderRanking();
    useHidden(rankingModal, false);
}

function onCloseRanking(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    useHidden(rankingModal, true);
}

function exitGame(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    stopTimer();
    resetGameState();
    setNavLinksDisabled(false);
    useHidden(boardCenter, false);
    useHidden(gameOverModal, true);
    setButtonsEnabled(false);
}

function attachGameEvents() {
    var color;
    for (color in simonButtons) {
        if (simonButtons.hasOwnProperty(color) && simonButtons[color]) {
            simonButtons[color].addEventListener('click', onSimonButtonClick);
        }
    }
    if (btnStart) {
        btnStart.addEventListener('click', startGame);
    }
    if (btnRestart) {
        btnRestart.addEventListener('click', startGame);
    }
    if (btnShowRanking) {
        btnShowRanking.addEventListener('click', onShowRanking);
    }
    if (btnCloseRanking) {
        btnCloseRanking.addEventListener('click', onCloseRanking);
    }
    if (btnSortScore) {
        btnSortScore.addEventListener('click', onSortScore);
    }
    if (btnSortDate) {
        btnSortDate.addEventListener('click', onSortDate);
    }
    if (btnResetGame) {
        btnResetGame.addEventListener('click', startGame);
    }
    if (btnExitGame) {
        btnExitGame.addEventListener('click', exitGame);
    }
}

function initializeGame() {
    cacheGameDom();
    updateLevelLabel();
    updateScoreLabel();
    updateTimeLabel();
    setButtonsEnabled(false);
    attachGameEvents();
    renderRanking();
}

document.addEventListener('DOMContentLoaded', initializeGame);
