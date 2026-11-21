"use strict";

// Only logged-in users can see this page
if (DataStore.get(STORAGE_KEYS.SESSION) === null) {
    window.location.href = "login.html";
}

// Load saved items
let items = DataStore.get(STORAGE_KEYS.ITEMS, []);

// Page elements
const itemForm   = $("itemForm");
const nameInput  = $("item_name");
const qtyInput   = $("item_qty");
const listEl     = $("groceryList");
const emptyEl    = $("emptyMessage");
const summaryEl  = $("summary");
const listMsg    = $("listMessage");

/* -- Events --*/
itemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addItem();
});
$("clearBtn").addEventListener("click", clearList);
$("logoutBtn").addEventListener("click", logout);

// One listener for all checkboxes and remove buttons
listEl.addEventListener("click", (event) => {
    const row = event.target.closest("li");
    if (!row) return;
    const index = Number(row.dataset.index);

    if (event.target.matches(".remove")) {
        items.splice(index, 1);                    // remove item
        saveAndRender();
    } else if (event.target.matches("input[type='checkbox']")) {
        items[index].done = event.target.checked;  // check or uncheck
        saveAndRender();
    }
});

/* -- Functions -- */

// Add an item
function addItem() {
    const name = nameInput.value.trim();
    const qty  = Number(qtyInput.value);

    // Check blank or invalid fields
    if (name === "" || qtyInput.value === "" || qty < 1) {
        setInvalid(nameInput, name === "");
        setInvalid(qtyInput, qtyInput.value === "" || qty < 1);
        showMessage(listMsg, "Please enter an item name and a quantity of 1 or more.", "error");
        return;
    }

    setInvalid(nameInput, false);
    setInvalid(qtyInput, false);
    showMessage(listMsg, "");

    items.push({ name: name, qty: qty, done: false });   // add item
    saveAndRender();

    // Clear the form
    itemForm.reset();
    nameInput.focus();
}

// Clear the list after confirming
function clearList() {
    if (items.length === 0) return;
    if (!confirm("Remove all items from the list?")) return;
    items = [];
    saveAndRender();
}

// Log out (account is kept)
function logout() {
    DataStore.remove(STORAGE_KEYS.SESSION);
    window.location.href = "login.html";
}

// Save, then redraw
function saveAndRender() {
    DataStore.set(STORAGE_KEYS.ITEMS, items);
    renderList();
}

// Draw the list
function renderList() {
    listEl.innerHTML = "";   // clear old rows

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "grocery-item" + (item.done ? " done" : "");
        li.dataset.index = index;   // row position

        // Checkbox + name
        const label = document.createElement("label");
        label.className = "check";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.done;

        const name = document.createElement("span");
        name.className = "name";
        name.textContent = item.name;

        label.append(checkbox, name);

        // Dotted line + quantity
        const leader = document.createElement("span");
        leader.className = "leader";
        leader.setAttribute("aria-hidden", "true");

        const qty = document.createElement("span");
        qty.className = "qty";
        qty.textContent = "Qty: " + item.qty;

        // Remove button
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove";
        remove.textContent = "\u00D7";         // the × symbol
        remove.setAttribute("aria-label", "Remove " + item.name);

        li.append(label, leader, qty, remove);
        listEl.appendChild(li);
    });

    // Summary and empty message
    const doneCount = items.filter((item) => item.done).length;
    summaryEl.textContent = items.length === 0
        ? ""
        : doneCount + " of " + items.length + " in the basket";
    emptyEl.hidden = items.length > 0;
}

// Show the list on load
renderList();
