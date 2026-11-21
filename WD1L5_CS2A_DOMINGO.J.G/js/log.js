"use strict";

const loginForm    = $("loginForm");
const loginMessage = $("loginMessage");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginUser();
});

// Check the saved user
function loginUser() {
    const savedUser = DataStore.get(STORAGE_KEYS.USER);

    if (savedUser === null) {
        showMessage(loginMessage, "No user record found. Kindly register first.", "error");
        return;
    }

    // Get typed values
    const typedUsername = $("login_uname").value.trim();
    const typedPassword = $("login_pword").value;

    // Compare saved and typed data
    if (typedUsername === savedUser.username && typedPassword === savedUser.password) {
        // Save the login
        DataStore.set(STORAGE_KEYS.SESSION, savedUser.username);

        showMessage(loginMessage,
            "Welcome " + savedUser.firstName + "! You may now add an item.", "success");

        // Go to the list page
        goTo("list.html", 900);
    } else {
        showMessage(loginMessage, "Invalid user credentials!", "error");
    }
}
