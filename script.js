window.createCustomSelector = function (
  selector,
  { label = null, multiple = false, input = false }
) {
  const select = document.querySelector(selector);
  const labelitem = foundLabel(selector);

  if (labelitem !== undefined && label !== null) {
    labelitem.innerHTML = label;
  } else if (labelitem === undefined && label !== null) {
    const item = document.createElement("label");
    item.innerHTML = label;
    select.before(item);
  }
};

function foundLabel(selector) {
  const labels = document.querySelectorAll("label");
  if (labels === undefined) {
    return undefined;
  }
  let label;
  labels.forEach((element) => {
    if (element.getAttribute("for") === selector) label = element;
  });
  return label;
}
