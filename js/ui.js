'use strict';

var nameModal;
var inputName;
var btnConfirmName;
var nameError;
var gameArea;
var playerNameLabel;
var btnChangePlayer;
var btnCloseName;
var playerName = '';

function cacheDom() {
    nameModal = document.getElementById('name-modal');
    inputName = document.getElementById('input-name');
    btnConfirmName = document.getElementById('btn-confirm-name');
    nameError = document.getElementById('name-error');
    gameArea = document.getElementById('game-area');
    playerNameLabel = document.getElementById('player-name');
    btnChangePlayer = document.getElementById('btn-change-player');
    btnCloseName = document.getElementById('btn-close-name');
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

function getNameValidationError(value) {
    var cleaned;
    var hasInvalidChars;
    var lettersOnly;
    if (!value) {
        return 'El nombre debe tener al menos 3 letras';
    }
    cleaned = value.replace(/^\s+|\s+$/g, '');
    hasInvalidChars = /[^a-zA-Z\u00f1\u00d1\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\s]/.test(cleaned);
    if (hasInvalidChars) {
        return 'Solo se permiten caracteres alfabeticos';
    }
    lettersOnly = cleaned.replace(/[^a-zA-Z\u00f1\u00d1\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da]/g, '');
    if (lettersOnly.length < 3) {
        return 'El nombre debe tener al menos 3 letras';
    }
    return '';
}

function isNameValid(value) {
    return getNameValidationError(value) === '';
}

function showNameError(message) {
    if (nameError) {
        nameError.textContent = message || 'El nombre debe tener al menos 3 letras';
    }
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
    var validationMessage;
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    rawName = inputName.value;
    trimmedName = rawName.replace(/^\s+|\s+$/g, '');
    validationMessage = getNameValidationError(trimmedName);
    if (validationMessage) {
        showNameError(validationMessage);
        return;
    }
    playerName = trimmedName;
    hideNameError();
    hideElement(nameModal);
    showElement(gameArea);
    setText(playerNameLabel, playerName);
    persistPlayerName();
    if (typeof startGame === 'function') {
        startGame();
    }
}

function onCloseNameClick(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    hideNameError();
    hideElement(nameModal);
    showElement(gameArea);
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
    if (btnCloseName) {
        btnCloseName.addEventListener('click', onCloseNameClick);
    }
}

function initializeUI() {
    cacheDom();
    restoreSavedName();
    attachEvents();
}

initializeUI();
