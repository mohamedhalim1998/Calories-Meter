class StorageController {
  saveItem(item) {
    let items = [];
    if (localStorage.getItem("items") != null) {
      items = JSON.parse(localStorage.getItem("items"));
    }
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
  }
  getItems() {
    let items = [];
    const data = JSON.parse(localStorage.getItem("items"));
    if (data != null) {
      data.forEach((i) => {
        items.push(new Item(i.id, i.name, parseInt(i.calorie)));
      });
    }
    return items;
  }
  editItem(item) {
    let items = JSON.parse(localStorage.getItem("items"));
    this.items.forEach((i) => {
      console.log(i.id);
      if (item.id == i.id) {
        i.name = item.name;
        i.calorie = item.calorie;
      }
    });

    localStorage.setItem("items", JSON.stringify(items));
  }

  deleteItem(item) {
    let items = JSON.parse(localStorage.getItem("items"));
    items.forEach((i, index) => {
      console.log(i.id);
      if (item.id == i.id) {
         
        items.splice(index, 1);
      }
    });

    localStorage.setItem("items", JSON.stringify(items));
  }
}

class Item {
  constructor(id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  }
}

class ItemController {
  items = storageController.getItems();
  totalCalories = 0;
  editItemId = -1;
  constructor() {
    this.items.forEach((item) => {
      this.totalCalories += item.calorie;
    });
  }
  addItem(name, calorie) {
    let id = 0;
    if (this.items.length != 0) {
      id = this.items[this.items.length - 1].id + 1;
    }

    let item = new Item(id, name, parseInt(calorie));
    this.items.push(item);
    this.totalCalories += parseInt(calorie);
    storageController.saveItem(item);
    return item;
  }
  getItemByID(id) {
    let item = null;
    this.items.forEach((i) => {
      if (i.id == id) {
        item = i;
      }
    });
    return item;
  }
  editItem(name, calorie) {
    let item = null;
    this.items.forEach((i) => {
      if (i.id == this.editItemId) {
        i.name = name;
        this.totalCalories -= i.calorie;
        i.calorie = parseInt(calorie);
        this.totalCalories += i.calorie;
        item = i;
      }
    });
    storageController.editItem(item);
    return item;
  }
  deleteItem() {
    let item = null;
    this.items.forEach(( i, index) => {
      if (i.id == this.editItemId) {
        this.totalCalories -= i.calorie;
        item = i;
        this.items.splice(index, 1);
      }
    });
    storageController.deleteItem(item);
    return item;
  }
}

class UiController {
  selectors = {
    itemsList: "#item-list",
    addButton: ".add-btn",
    updateButton: ".update-btn",
    deleteButton: ".delete-btn",
    backButton: ".back-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalCalories: ".total-calories",
    itemElement: ".collection-item",
  };

  constructor() {
    this.hideEdit();
  }

  populateItemList(items) {
    items.forEach((item) => {
      this.addItem(item);
    });
  }

  addItem(item) {
    let s = ` <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
    document.querySelector(this.selectors.itemsList).innerHTML += s;
  }
  setTotalCalories(calories) {
    console.log(calories);
    document.querySelector(this.selectors.totalCalories).textContent = calories;
  }
  clearFields() {
    document.querySelector(this.selectors.itemName).value = "";
    document.querySelector(this.selectors.itemCalories).value = "";
  }

  hideEdit() {
    document.querySelector(this.selectors.updateButton).style.display = "none";
    document.querySelector(this.selectors.backButton).style.display = "none";
    document.querySelector(this.selectors.deleteButton).style.display = "none";
    document.querySelector(this.selectors.addButton).style.display = "inline";
  }
  showEdit(item) {
    document.querySelector(this.selectors.updateButton).style.display =
      "inline";
    document.querySelector(this.selectors.deleteButton).style.display =
      "inline";
    document.querySelector(this.selectors.backButton).style.display = "inline";
    document.querySelector(this.selectors.addButton).style.display = "none";
    document.querySelector(this.selectors.itemName).value = item.name;
    document.querySelector(this.selectors.itemCalories).value = item.calorie;
  }

  editItem(item) {
    let items = document.querySelectorAll(this.selectors.itemElement);
    items = Array.from(items);
    items.forEach(function (listItem) {
      const itemID = listItem.getAttribute("id");
      console.log(itemID);
      if (itemID == `item-${item.id}`) {
        document.querySelector(
          `#${itemID}`
        ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
       <a href="#" class="secondary-content">
         <i class="edit-item fa fa-pencil"></i>
       </a>`;
      }
    });
  }
  deleteItem(item) {
    const itemID = `#item-${item.id}`;
    document.querySelector(itemID).remove();
  }
}
const storageController = new StorageController();
const itemController = new ItemController();
const uiController = new UiController();
class AppController {
  constructor() {
    uiController.populateItemList(itemController.items);
    uiController.setTotalCalories(itemController.totalCalories);
    document
      .querySelector(uiController.selectors.addButton)
      .addEventListener("click", this.addItem);

    document
      .querySelector(uiController.selectors.itemsList)
      .addEventListener("click", this.showEditItem);
    document
      .querySelector(uiController.selectors.updateButton)
      .addEventListener("click", this.editItem);
    document
      .querySelector(uiController.selectors.deleteButton)
      .addEventListener("click", this.deleteItem);
    document
      .querySelector(uiController.selectors.backButton)
      .addEventListener("click", this.back);
  }
  addItem(e) {
    e.preventDefault();
    const n = document.querySelector(uiController.selectors.itemName).value;
    const c = document.querySelector(uiController.selectors.itemCalories).value;
    if (n !== "" && c != "") {
      let item = itemController.addItem(n, c);
      uiController.addItem(item);
      storageController.saveItem(item);
      uiController.setTotalCalories(itemController.totalCalories);
      uiController.clearFields();
    }
  }

  showEditItem(e) {
    e.preventDefault();
    console.log("edit click");
    if (e.target.classList.contains("edit-item")) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split("-");
      const id = parseInt(listIdArr[1]);
      itemController.editItemId = id;

      console.log(itemController.getItemByID(id));
      uiController.showEdit(itemController.getItemByID(id));
    }
  }

  editItem(e) {
    e.preventDefault();
    const n = document.querySelector(uiController.selectors.itemName).value;
    const c = document.querySelector(uiController.selectors.itemCalories).value;
    if (n !== "" && c != "") {
      let item = itemController.editItem(n, c);
      uiController.editItem(item);
      console.log(item);
      uiController.setTotalCalories(itemController.totalCalories);
      uiController.clearFields();
      uiController.hideEdit();
    }
  }
  deleteItem(e) {
    e.preventDefault();
    let item = itemController.deleteItem();
    uiController.deleteItem(item);
    uiController.setTotalCalories(itemController.totalCalories);
    uiController.clearFields();
    uiController.hideEdit();
  }
  back(e) {
    e.preventDefault();
    uiController.clearFields();
    uiController.hideEdit();
  }
}
new AppController();
