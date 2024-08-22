export default class Tooltip {
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
      element: tooltipElement,
    });

    document.querySelector(".form").appendChild(tooltipElement);

    const { top } = element.getBoundingClientRect();

    tooltipElement.style.right = tooltipElement.offsetLeft + 10 + "px";
    tooltipElement.style.top = top + 5 + "px";

    return id;
  }

  removeTooltip(id) {
    const tooltip = this._tooltips.find((t) => t.id === id);

    if (tooltip) {
      tooltip.element.remove();
    }

    this._tooltips = this._tooltips.filter((t) => t.id !== id);
  }
}
