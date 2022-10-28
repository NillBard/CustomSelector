window.createCustomSelector = function (
  selector,
  { label = null, multiple = false, input = false }
) {
  const select = document.querySelectorAll(selector);
  select.forEach((el) => {
    const options = el.querySelectorAll("option");
    const selectorWrapper = createElement("div", "selectorWrapper");
    const listWrapper = createElement("div", "listWrapper");
    const customClass = `MyClass-${Math.floor(Math.random() * 1000)}`;
    selectorWrapper.classList.add(customClass);

    const [optionList, list] = renderList(options);
    listWrapper.append(list);

    if (input) {
      const inputField = createElement("input", "selectSearch");
      inputField.addEventListener("input", (e) => {
        const target = e.target;
        optionList.forEach((el) => {
          el.classList.remove("hidden");
          if (!el.textContent.toLowerCase().includes(target.value))
            el.classList.add("hidden");
        });
      });
      listWrapper.prepend(inputField);
    }

    const selectBlock = createElement("div", "selectBlock");
    const selectHeader = createElement("div", "selectHeader");
    const btn = createElement("button", "chevron");
    const selectorContent = createElement(
      "div",
      "selectContent",
      "Выберите элемент"
    );
    selectHeader.append(selectorContent, btn);

    const $label = findLabel(el.getAttribute("id"));
    const actualLabel = label ?? $label?.textContent;
    if (actualLabel) {
      const selectLabel = createElement("label", null, actualLabel);
      if ($label) $label.style.display = "none";
      selectBlock.append(selectLabel);
    }

    selectorWrapper.append(selectHeader, listWrapper);
    selectBlock.append(selectorWrapper);
    el.after(selectBlock);
    el.style = `display:none`;

    selectHeader.addEventListener("click", (e) => {
      selectBlock.classList.toggle("My-custom-select");
      const offset =
        document.documentElement.scrollHeight -
          selectBlock.getBoundingClientRect().bottom <
        300
          ? listWrapper.clientHeight + selectBlock.clientHeight
          : 0;

      listWrapper.style.transform = `translateY(-${offset}px)`;
    });

    let selectOption = [];
    listWrapper.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("option")) {
        if (multiple) {
          target.classList.toggle("select");

          selectOption.includes(target.textContent)
            ? (selectOption = selectOption.filter(
                (el) => el !== target.textContent
              ))
            : selectOption.push(target.textContent);

          selectorContent.innerHTML =
            selectOption.length === 0
              ? "Выберите элемент"
              : selectOption.join(" ");
        } else {
          optionList.forEach((el) => el.classList.remove("select"));
          target.classList.add("select");
          selectorContent.innerHTML = target.textContent;
          selectBlock.classList.remove("My-custom-select");
        }
      }
    });

    window.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.closest(`.${customClass}`)) {
        selectBlock.classList.remove("My-custom-select");
      }
    });
  });
};

function findLabel(id) {
  return document.querySelector(`label[for = "${id}"]`);
}

function createElement(tag, className = "", content = "") {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  element.innerHTML += content;
  return element;
}

function renderList(nodeList) {
  const list = createElement("ul");
  const optionList = Array.from(nodeList).map((elem) => {
    const item = createElement("li", "option");
    item.setAttribute("value", elem.value);
    item.innerHTML = elem.textContent;
    list.append(item);
    return item;
  });
  return [optionList, list];
}
