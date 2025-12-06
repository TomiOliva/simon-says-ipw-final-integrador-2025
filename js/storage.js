'use strict';

var STORAGE_PLAYER_NAME_KEY = 'simonSaysPlayerName';
var STORAGE_RESULTS_KEY = 'simonSaysResults';

function savePlayerName(name) {
    try {
        localStorage.setItem(STORAGE_PLAYER_NAME_KEY, name || '');
    } catch (error) {
        return;
    }
}

function loadPlayerName() {
    try {
        return localStorage.getItem(STORAGE_PLAYER_NAME_KEY) || '';
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

function loadGameResults() {
    var raw;
    var parsed;
    try {
        raw = localStorage.getItem(STORAGE_RESULTS_KEY);
        if (!raw) {
            return [];
        }
        parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.length === 'undefined') {
            return [];
        }
        return parsed;
    } catch (error) {
        return [];
    }
}

function saveGameResults(results) {
    if (!results) {
        return;
    }
    try {
        localStorage.setItem(STORAGE_RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
        return;
    }
}

function addGameResult(result) {
    var results;
    if (!result) {
        return;
    }
    results = loadGameResults();
    results.push(result);
    saveGameResults(results);
}
