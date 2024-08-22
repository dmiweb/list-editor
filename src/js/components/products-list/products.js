import "./products.css";

export default class Products {
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

      this.productsBuffer.forEach((product) => {
        const productElement = this.renderProduct(
          product.id,
          product.name,
          product.price
        );

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
      this.productsBuffer.map((product) => {
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
        price: priceProduct.value,
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

      const editElement = this.productsBuffer.find(
        (product) => product.id === +element.id
      );

      nameProduct.value = editElement.name;
      priceProduct.value = editElement.price;

      widgetAddEdit.insertAdjacentHTML(
        "beforeEnd",
        `<div id="${editElement.id}" class="edit-mark">Редактирование</div>`
      );
    }
  }

  removeProduct(e) {
    if (document.querySelector(".widget-confirm")) return;

    const currentElement = e.target;

    if (currentElement.classList.contains("product__option_delete")) {
      const widgetConfirmCloseElement = this.renderWidgetConfirmClose();

      document
        .querySelector("body")
        .insertAdjacentHTML("beforeEnd", widgetConfirmCloseElement);

      const widgetConfirmClose = document.querySelector(".widget-confirm");
      const btnClose = widgetConfirmClose.querySelector(
        ".widget-confirm__btn_close"
      );
      const btnCancel = widgetConfirmClose.querySelector(
        ".widget-confirm__btn_cancel"
      );

      btnClose.addEventListener("click", () => {
        widgetConfirmClose.remove();

        this.productsBuffer = JSON.parse(localStorage.getItem("saveProducts"));

        const productElement = currentElement.closest(".product-list__item");

        this.productsBuffer = this.productsBuffer.filter(
          (product) => product.id !== +productElement.id
        );

        localStorage.setItem(
          "saveProducts",
          JSON.stringify(this.productsBuffer)
        );

        this.reloadProducts();
      });

      btnCancel.addEventListener("click", () => {
        widgetConfirmClose.remove();
      });
    }
  }
}
