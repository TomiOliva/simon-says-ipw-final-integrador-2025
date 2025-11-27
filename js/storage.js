'use strict';

var STORAGE_PLAYER_NAME_KEY = 'simonSaysPlayerName';

function savePlayerName(name) {
    var value;
    try {
        value = name || '';
        localStorage.setItem(STORAGE_PLAYER_NAME_KEY, value);
    } catch (error) {
        return;
    }
}

function loadPlayerName() {
    var stored;
    try {
        stored = localStorage.getItem(STORAGE_PLAYER_NAME_KEY);
        if (!stored) {
            return '';
        }
        return stored;
    } catch (error) {
        return '';
    }
}

function clearPlayerName() {
    try {
        localStorage.removeItem(STORAGE_PLAYER_NAME_KEY);
    } catch (error) {
        return;
    }
}
