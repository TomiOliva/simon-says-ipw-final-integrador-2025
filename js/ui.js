'use strict';

var nameModal;
var inputName;
var btnConfirmName;
var nameError;
var gameArea;
var playerNameLabel;
var btnChangePlayer;
var playerName = '';

function cacheDom() {
    nameModal = document.getElementById('name-modal');
    inputName = document.getElementById('input-name');
    btnConfirmName = document.getElementById('btn-confirm-name');
    nameError = document.getElementById('name-error');
    gameArea = document.getElementById('game-area');
    playerNameLabel = document.getElementById('player-name');
    btnChangePlayer = document.getElementById('btn-change-player');
}

function showElement(element) {
    if (!element) {
        return;
    }
    element.classList.remove('hidden');
}

function hideElement(element) {
    if (!element) {
        return;
    }
    element.classList.add('hidden');
}

function setText(element, text) {
    if (!element) {
        return;
    }
    element.textContent = text;
}

function isNameValid(value) {
    var cleaned;
    var lettersOnly;
    if (!value) {
        return false;
    }
    cleaned = value.replace(/^\s+|\s+$/g, '');
    lettersOnly = cleaned.replace(/[^a-zA-Z]/g, '');
    if (lettersOnly.length < 3) {
        return false;
    }
    return true;
}

function showNameError() {
    showElement(nameError);
}

function hideNameError() {
    hideElement(nameError);
}

function persistPlayerName() {
    if (typeof savePlayerName !== 'function') {
        return;
    }
    savePlayerName(playerName);
}

function restoreSavedName() {
    var savedName;
    if (typeof loadPlayerName !== 'function') {
        return;
    }
    savedName = loadPlayerName();
    if (!isNameValid(savedName)) {
        return;
    }
    playerName = savedName;
    hideNameError();
    hideElement(nameModal);
    showElement(gameArea);
    setText(playerNameLabel, playerName);
}

function onNameInput() {
    hideNameError();
}

function onChangePlayerClick(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    playerName = '';
    if (typeof clearPlayerName === 'function') {
        clearPlayerName();
    }
    if (inputName) {
        inputName.value = '';
        inputName.focus();
    }
    hideNameError();
    showElement(nameModal);
    hideElement(gameArea);
}

function onConfirmNameClick(event) {
    var rawName;
    var trimmedName;
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    rawName = inputName.value;
    trimmedName = rawName.replace(/^\s+|\s+$/g, '');
    if (!isNameValid(trimmedName)) {
        showNameError();
        return;
    }
    playerName = trimmedName;
    hideNameError();
    hideElement(nameModal);
    showElement(gameArea);
    setText(playerNameLabel, playerName);
    persistPlayerName();
}

function attachEvents() {
    if (btnConfirmName) {
        btnConfirmName.addEventListener('click', onConfirmNameClick);
    }
    if (inputName) {
        inputName.addEventListener('input', onNameInput);
    }
    if (btnChangePlayer) {
        btnChangePlayer.addEventListener('click', onChangePlayerClick);
    }
}

function initializeUI() {
    cacheDom();
    restoreSavedName();
    attachEvents();
}

initializeUI();
