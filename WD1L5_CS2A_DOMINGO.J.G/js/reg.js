"use strict";

const REG_FIELDS = [
    { id: "fname",   key: "firstName", label: "First name" },
    { id: "lname",   key: "lastName",  label: "Last name" },
    { id: "address", key: "address",   label: "Address" },
    { id: "uname",   key: "username",  label: "Username" },
    { id: "email",   key: "email",     label: "Email address" },
    { id: "pword",   key: "password",  label: "Password", trim: false }
];

const regForm    = $("registerForm");
const regMessage = $("regMessage");

// Run on submit
regForm.addEventListener("submit", (event) => {
    event.preventDefault();   // stop page reload
    saveUserDetails();
});

// Validate and save the user
function saveUserDetails() {
    const user = {};
    const missing = [];       // blank fields

    // Check every field
    REG_FIELDS.forEach((field) => {
        const input = $(field.id);
        const value = field.trim === false ? input.value : input.value.trim();

        user[field.key] = value;

        const isBlank = value === "";
        setInvalid(input, isBlank);
        if (isBlank) missing.push(field.label);
    });

    // Check if any field is blank
    if (missing.length > 0) {
        showMessage(regMessage, "Please complete: " + missing.join(", ") + ".", "error");
        return;
    }

    // Check email format
    const emailInput = $("email");
    if (!emailInput.checkValidity()) {
        setInvalid(emailInput, true);
        showMessage(regMessage, "Please enter a valid email address.", "error");
        return;
    }

    // Save the user
    DataStore.set(STORAGE_KEYS.USER, user);

    showMessage(regMessage, "Registration successful! Taking you to log in...", "success");

    // Go to login
    goTo("login.html", 900);
}
