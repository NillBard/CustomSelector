window.createCustomSelector = function (
  selector,
  { label = null, multiple = false, input = false }
) {
  const select = document.querySelector(selector);
  const options = select.querySelectorAll("option");
  const selectorWrapper = createElement("div", "selectorWrapper");
  selectorWrapper.classList.add(`${selector.slice(1)}`);
  const listWrapper = createElement("div", "listWrapper");

  const inputField = createElement("input", "selectSearch");
  if (input) {
    listWrapper.append(inputField);
  }

  const [optionList, list] = renderList(options);
  listWrapper.append(list);

  inputField.addEventListener("input", (e) => {
    const target = e.target;
    optionList.forEach((el) => {
      el.classList.remove("hidden");
      el.textContent.toLowerCase().includes(target.value)
        ? el.classList.remove("hidden")
        : el.classList.add("hidden");
    });
  });
  const selectBlock = createElement("div", "selectBlock");
  const selectHeader = createElement("div", "selectHeader");
  const btn = createElement("button", "chevron");
  const selectorContent = createElement(
    "div",
    "selectContent",
    "Выберите элемент"
  );
  selectHeader.append(selectorContent, btn);

  const $label = findLabel(selector);
  const actualLabel = label ?? $label?.textContent;
  if (actualLabel) {
    const selectLabel = createElement("label", null, actualLabel);
    if ($label) $label.style.display = "none";
    selectBlock.append(selectLabel);
  }

  selectorWrapper.append(selectHeader, listWrapper);
  selectBlock.append(selectorWrapper);
  select.after(selectBlock);
  select.style = `display:none`;

  selectHeader.addEventListener("click", (e) => {
    selectBlock.classList.toggle("isActive");
    const offset =
      document.documentElement.scrollHeight -
        selectBlock.getBoundingClientRect().bottom <
      300
        ? listWrapper.clientHeight + selectBlock.clientHeight
        : 0;

    listWrapper.style.transform = `translateY(-${offset}px)`;
  });

  let arr = [];
  listWrapper.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("option")) {
      if (multiple) {
        target.classList.toggle("select");

        arr.includes(target.textContent)
          ? (arr = arr.filter((el) => el !== target.textContent))
          : arr.push(target.textContent);

        selectorContent.innerHTML =
          arr.length === 0 ? "Выберите элемент" : arr.join(" ");
      } else {
        optionList.forEach((el) => el.classList.remove("select"));
        target.classList.add("select");
        selectorContent.innerHTML = target.textContent;
        selectBlock.classList.remove("isActive");
      }
    }
  });

  window.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.closest(`.${selector.slice(1)}`)) {
      selectBlock.classList.remove("isActive");
    }
  });
};

function findLabel(selector) {
  return document.querySelector(`label[for = "${selector.slice(1)}"]`);
}

function createElement(tag, className = "", content = "") {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  element.innerHTML += content;
  return element;
}

function renderList(arr) {
  const list = createElement("ul");
  arr.forEach((elem) => {
    const item = createElement("li", "option");
    item.setAttribute("value", elem.value);
    item.innerHTML = elem.textContent;
    list.append(item);
  });
  return [list.querySelectorAll(".option"), list];
}
