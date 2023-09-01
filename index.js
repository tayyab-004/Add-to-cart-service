import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://shoppingapp333-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldElement = document.getElementById("input-field");
const addButtonElement = document.getElementById("add-button");
const shoppingListElement = document.getElementById("shopping-list");

addButtonElement.addEventListener("click", function () {
  let inputValue = inputFieldElement.value;

  push(shoppingListInDB, inputValue);
  clearInputElement();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingListElement();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToShoppingListElement(currentItem);
    }
  } else {
    shoppingListElement.innerHTML = "No items to show in shopping list yet..!"
  }
});

function clearInputElement() {
  inputFieldElement.value = "";
}

function appendItemToShoppingListElement(item) {
  let newElement = document.createElement("li");
  let itemID = item[0];
  let itemValue = item[1];

  newElement.textContent = itemValue;
  shoppingListElement.append(newElement);

  newElement.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
}

function clearShoppingListElement() {
  shoppingListElement.innerHTML = "";
}
