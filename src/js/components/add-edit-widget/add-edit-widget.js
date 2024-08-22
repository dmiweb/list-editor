import "./add-edit-widget.css";

export default class AddEditWidget {
  constructor(tooltipFactory, onAddProduct) {
    this._tooltipFactory = tooltipFactory;
    this._saveForm = onAddProduct;

    this.errors = {
      "product-name": {
        valueMissing: "Введите название продукта",
      },
      "product-price": {
        valueMissing: "Введите стоимость продукта",
        patternMismatch: "Стоимость должна быть числом",
      },
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

    [...form.elements].forEach((el) =>
      el.addEventListener("focus", () => {
        el.addEventListener("blur", this.elementOnBlur);
      })
    );
  }

  showTooltip(message, el) {
    this.actualMessages.push({
      name: el.name,
      id: this._tooltipFactory.showTooltip(message, el),
    });
  }

  removeTooltips() {
    this.actualMessages.forEach((message) => {
      this._tooltipFactory.removeTooltip(message.id);
    });

    this.actualMessages = [];
  }

  getError(el) {
    const errorKey = Object.keys(ValidityState.prototype).find((key) => {
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

    const currentErrorMessage = this.actualMessages.find(
      (item) => item.name === el.name
    );

    if (error) {
      if (currentErrorMessage) {
        this._tooltipFactory.removeTooltip(currentErrorMessage.id);
        this.actualMessages = this.actualMessages.filter(
          (t) => t.id !== currentErrorMessage.id
        );
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

    const invalid = [...widgetElements].some((elem) => {
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
