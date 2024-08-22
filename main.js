/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/components/products-list/products.js

class Products {
  constructor(element) {
    this.element = element;
    this.productsBuffer = [];
    this.reloadProducts = this.reloadProducts.bind(this);
    this.onAddProduct = this.onAddProduct.bind(this);
    this.onEditProduct = this.onEditProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }
  renderProduct(id, name, price) {
    return `
            <tr id="${id}" class="product-list__item">
              <td name="product-name" class="product-list__item-name products__cell">${name}</td>
              <td name="product-price" class="product-list__item-price products__cell">${price}</td>
              <td class="cell product__options">
                <div class="product__option_edit"></div>
                <div class="product__option_delete"></div>
              </td>
            </tr>
          `;
  }
  renderNoProductMessage() {
    return `
            <tr class="no-products"><td colspan="3">Нет продуктов</td></tr>
          `;
  }
  renderWidgetConfirmClose() {
    return `
            <div class="widget-confirm">
              <span class="widget-confirm__message">Удалить товар?</span>
              <div class="widget-confirm__btn-box">
                <button class="widget-confirm__btn widget-confirm__btn_close">Удалить</button>
                <button class="widget-confirm__btn widget-confirm__btn_cancel">Отмена</button>
              </div>
            </div>
          `;
  }
  reloadProducts() {
    this.productsBuffer = JSON.parse(localStorage.getItem("saveProducts"));
    if (this.productsBuffer) {
      this.element.innerHTML = "";
      this.productsBuffer.forEach(product => {
        const productElement = this.renderProduct(product.id, product.name, product.price);
        this.element.insertAdjacentHTML("beforeEnd", productElement);
      });
      this.element.addEventListener("click", this.onEditProduct);
      this.element.addEventListener("click", this.removeProduct);
    }
    if (!this.productsBuffer || !this.productsBuffer.length) {
      this.element.innerHTML = this.renderNoProductMessage();
      this.productsBuffer = [];
    }
  }
  onAddProduct() {
    const widgetAddEdit = document.querySelector(".form");
    const nameProduct = widgetAddEdit.querySelector(".form__name-input");
    const priceProduct = widgetAddEdit.querySelector(".form__price-input");
    const id = performance.now();
    const editMark = document.querySelector(".edit-mark");
    if (editMark) {
      this.productsBuffer.map(product => {
        if (product.id === +editMark.id) {
          product.name = nameProduct.value;
          product.price = priceProduct.value;
        }
      });
      editMark.remove();
    } else {
      this.productsBuffer.push({
        id,
        name: nameProduct.value,
        price: priceProduct.value
      });
    }
    localStorage.setItem("saveProducts", JSON.stringify(this.productsBuffer));
    widgetAddEdit.remove();
    this.reloadProducts();
  }
  onEditProduct(e) {
    const currentElement = e.target;
    if (currentElement.classList.contains("product__option_edit")) {
      document.querySelector(".products__add-btn").click();
      const widgetAddEdit = document.querySelector(".form");
      const nameProduct = widgetAddEdit.querySelector(".form__name-input");
      const priceProduct = widgetAddEdit.querySelector(".form__price-input");
      const element = e.target.closest(".product-list__item");
      const editElement = this.productsBuffer.find(product => product.id === +element.id);
      nameProduct.value = editElement.name;
      priceProduct.value = editElement.price;
      widgetAddEdit.insertAdjacentHTML("beforeEnd", `<div id="${editElement.id}" class="edit-mark">Редактирование</div>`);
    }
  }
  removeProduct(e) {
    if (document.querySelector(".widget-confirm")) return;
    const currentElement = e.target;
    if (currentElement.classList.contains("product__option_delete")) {
      const widgetConfirmCloseElement = this.renderWidgetConfirmClose();
      document.querySelector("body").insertAdjacentHTML("beforeEnd", widgetConfirmCloseElement);
      const widgetConfirmClose = document.querySelector(".widget-confirm");
      const btnClose = widgetConfirmClose.querySelector(".widget-confirm__btn_close");
      const btnCancel = widgetConfirmClose.querySelector(".widget-confirm__btn_cancel");
      btnClose.addEventListener("click", () => {
        widgetConfirmClose.remove();
        this.productsBuffer = JSON.parse(localStorage.getItem("saveProducts"));
        const productElement = currentElement.closest(".product-list__item");
        this.productsBuffer = this.productsBuffer.filter(product => product.id !== +productElement.id);
        localStorage.setItem("saveProducts", JSON.stringify(this.productsBuffer));
        this.reloadProducts();
      });
      btnCancel.addEventListener("click", () => {
        widgetConfirmClose.remove();
      });
    }
  }
}
;// CONCATENATED MODULE: ./src/js/components/add-edit-widget/add-edit-widget.js

class AddEditWidget {
  constructor(tooltipFactory, onAddProduct) {
    this._tooltipFactory = tooltipFactory;
    this._saveForm = onAddProduct;
    this.errors = {
      "product-name": {
        valueMissing: "Введите название продукта"
      },
      "product-price": {
        valueMissing: "Введите стоимость продукта",
        patternMismatch: "Стоимость должна быть числом"
      }
    };
    this.actualMessages = [];
    this.viewWidget = this.viewWidget.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.getError = this.getError.bind(this);
    this.elementOnBlur = this.elementOnBlur.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.removeWidget = this.removeWidget.bind(this);
    this.addEditBtn = document.querySelector(".products__add-btn");
    this.addEditBtn.addEventListener("click", this.viewWidget);
  }
  renderWidget() {
    return `
            <form class="form" novalidate>
              <label for="name" class="form__input-container">
                <span>Название</span>
                <input type="text" name="product-name" class="form__input form__name-input" id="name" required>
              </label>
              <label for="price" class="form__input-container">
                <span>Стоимость</span>
                <input type="text" name="product-price" class="form__input form__price-input" id="price" pattern="^[1-9][0-9]*$" required>
              </label>
              <div class="form__btn-box">
                <button type="submit" class="form__btn form__btn_save">Сохранить</button>
                <button class="form__btn form__btn_cancel">Отмена</button>
              </div>
            </form>
    `;
  }
  viewWidget() {
    if (document.querySelector(".form")) return;
    const widget = this.renderWidget();
    document.querySelector("body").insertAdjacentHTML("beforeEnd", widget);
    const form = document.querySelector(".form");
    const btnCancel = form.querySelector(".form__btn_cancel");
    form.addEventListener("submit", this.isValidForm);
    btnCancel.addEventListener("click", this.removeWidget);
    [...form.elements].forEach(el => el.addEventListener("focus", () => {
      el.addEventListener("blur", this.elementOnBlur);
    }));
  }
  showTooltip(message, el) {
    this.actualMessages.push({
      name: el.name,
      id: this._tooltipFactory.showTooltip(message, el)
    });
  }
  removeTooltips() {
    this.actualMessages.forEach(message => {
      this._tooltipFactory.removeTooltip(message.id);
    });
    this.actualMessages = [];
  }
  getError(el) {
    const errorKey = Object.keys(ValidityState.prototype).find(key => {
      if (!el.name) return;
      if (key === "valid") return;
      return el.validity[key];
    });
    if (!errorKey) return;
    return this.errors[el.name][errorKey];
  }
  elementOnBlur(e) {
    const el = e.target;
    const error = this.getError(el);
    const currentErrorMessage = this.actualMessages.find(item => item.name === el.name);
    if (error) {
      if (currentErrorMessage) {
        this._tooltipFactory.removeTooltip(currentErrorMessage.id);
        this.actualMessages = this.actualMessages.filter(t => t.id !== currentErrorMessage.id);
      }
      this.showTooltip(error, el);
    } else {
      if (currentErrorMessage) {
        this.removeTooltips();
        this.actualMessages = [];
      }
    }
    el.removeEventListener("blur", this.elementOnBlur);
  }
  isValidForm(e) {
    e.preventDefault();
    const form = document.querySelector(".form");
    const widgetElements = form.elements;
    this.removeTooltips();
    const invalid = [...widgetElements].some(elem => {
      const error = this.getError(elem);
      if (error) {
        this.showTooltip(error, elem);
        elem.classList.add("invalid");
        return true;
      } else {
        elem.classList.remove("invalid");
      }
    });
    if (!invalid) {
      this._saveForm();
    }
  }
  removeWidget(e) {
    e.preventDefault();
    const widgetAddEdit = document.querySelector(".form");
    const editMark = document.querySelector(".edit-mark");
    widgetAddEdit.remove();
    if (editMark) editMark.remove();
    widgetAddEdit.reset();
    this.removeTooltips();
  }
}
;// CONCATENATED MODULE: ./src/js/components/tooltip/tooltip.js
class Tooltip {
  constructor() {
    this._tooltips = [];
  }
  showTooltip(message, element) {
    const tooltipElement = document.createElement("div");
    tooltipElement.classList.add("form-error");
    tooltipElement.textContent = message;
    const id = performance.now();
    this._tooltips.push({
      id,
      element: tooltipElement
    });
    document.querySelector(".form").appendChild(tooltipElement);
    const {
      top
    } = element.getBoundingClientRect();
    tooltipElement.style.right = tooltipElement.offsetLeft + 10 + "px";
    tooltipElement.style.top = top + 5 + "px";
    return id;
  }
  removeTooltip(id) {
    const tooltip = this._tooltips.find(t => t.id === id);
    if (tooltip) {
      tooltip.element.remove();
    }
    this._tooltips = this._tooltips.filter(t => t.id !== id);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



document.addEventListener("DOMContentLoaded", () => {
  const productsList = document.querySelector(".products__list");
  const product = new Products(productsList);
  const tooltipFactory = new Tooltip();
  new AddEditWidget(tooltipFactory, product.onAddProduct);
  product.reloadProducts();
});
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;