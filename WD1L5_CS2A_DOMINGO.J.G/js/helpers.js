"use strict";
const STORAGE_KEYS = {
    USER:    "userRecord",    // registered user
    SESSION: "loggedInUser",  // current login
    ITEMS:   "groceryItems"   // grocery list
};


const DataStore = {
    // Read a value
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (error) {
            return fallback;
        }
    },

    // Save a value
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Delete a value
    remove(key) {
        localStorage.removeItem(key);
    }
};



// Shortcut for getElementById
const $ = (id) => document.getElementById(id);

// Show a message
function showMessage(element, text, type = "") {
    element.textContent = text;
    element.className = ("message " + type).trim();
}

// Mark an input as invalid or valid
function setInvalid(input, isInvalid) {
    input.classList.toggle("invalid", isInvalid);
    input.setAttribute("aria-invalid", String(isInvalid));
}

// Go to another page after a delay
function goTo(page, delay = 0) {
    setTimeout(() => { window.location.href = page; }, delay);
}
