import Products from "./components//products-list/products";
import AddEditWidget from "./components/add-edit-widget/add-edit-widget";
import Tooltip from "./components/tooltip/tooltip";

document.addEventListener("DOMContentLoaded", () => {
  const productsList = document.querySelector(".products__list");
  const product = new Products(productsList);

  const tooltipFactory = new Tooltip();

  new AddEditWidget(tooltipFactory, product.onAddProduct);

  product.reloadProducts();
});
