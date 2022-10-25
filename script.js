window.createCustomSelector = function (
  selector,
  { label = null, multiple = false, input = false }
) {
  const select = document.querySelector(selector);
  const labelItem = foundLabel(selector);
  const options = select.querySelectorAll("option");
  let arr = [];
  const inputField = createElement("input", "selectSearch");

  const selectorWrapper = createElement("div", "selectorWrapper");
  const listWrapper = createElement("div", "listWrapper");
  const list = createElement("ul");

  if (input) {
    listWrapper.append(inputField);
  }

  renderList(options, list, "123");
  listWrapper.append(list);

  let optionList = listWrapper.querySelectorAll(".option");

  inputField.addEventListener("input", (e) => {
    const target = e.target;
    optionList.forEach((el) => {
      if (!el.textContent.toLowerCase().includes(target.value)) {
        el.classList.add("hidden");
      } else {
        el.classList.remove("hidden");
      }
    });
  });

  const selectBlock = createElement("div", "selectBlock");
  const selectHeader = createElement("div", "selectHeader");
  const btn = createElement("button", "chevron");
  selectorWrapper.setAttribute("id", selector.replace("#", ""));

  const selectorContent = createElement(
    "div",
    "selectContent",
    "Выберете элемент"
  );

  selectHeader.append(selectorContent, btn);

  const selectLabel = createElement("label");
  selectLabel.setAttribute("for", selector.replace("#", ""));

  if (label == null) {
    if (labelItem !== undefined) {
      selectLabel.innerHTML = labelItem.textContent;
      selectBlock.append(selectLabel);
    }
  } else {
    selectLabel.innerHTML = label;
    selectBlock.append(selectLabel);
  }
  selectorWrapper.append(selectHeader, listWrapper);
  selectBlock.append(selectorWrapper);

  select.after(selectBlock);
  select.style = `display:none`;

  if (labelItem !== undefined) labelItem.style = `display:none`;

  selectHeader.addEventListener("click", (e) => {
    listWrapper.classList.toggle("isActive");
    btn.classList.toggle("open");
    let offset = listWrapper.clientHeight + selectBlock.clientHeight;
    console.log(
      document.documentElement.scrollHeight -
        selectBlock.getBoundingClientRect().bottom
    );
    if (
      document.documentElement.scrollHeight -
        selectBlock.getBoundingClientRect().bottom <
      300
    ) {
      console.log(listWrapper.clientHeight, selectBlock.clientHeight);
      listWrapper.style.transform = `translateY(-${offset}px)`;
    } else {
      listWrapper.style.transform = `translateY(-${0}px)`;
    }
  });

  listWrapper.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("option")) {
      if (multiple !== false) {
        target.classList.toggle("select");

        if (!arr.includes(target.textContent)) {
          arr.push(target.textContent);
        } else {
          arr = arr.filter((el) => el !== target.textContent);
        }

        if (arr.length === 0) {
          selectorContent.innerHTML = "Выберете элемент";
        } else {
          selectorContent.innerHTML = arr.join(" ");
        }
      } else {
        optionList.forEach((el) => el.classList.remove("select"));
        target.classList.add("select");
        selectorContent.innerHTML = target.textContent;
        listWrapper.classList.remove("isActive");
      }
    }
  });

  window.addEventListener("click", (e) => {
    const target = e.target;
    console.log();
    if (target.closest(selector) === null) {
      listWrapper.classList.remove("isActive");
      btn.classList.remove("open");
    }
  });
};

function foundLabel(selector) {
  const labels = document.querySelectorAll("label");
  if (labels === undefined) {
    return undefined;
  }
  let label;
  labels.forEach((element) => {
    if (element.getAttribute("for") === selector.replace("#", ""))
      label = element;
  });
  return label;
}

function createElement(tag, className = "", content = "") {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  element.innerHTML += content;
  return element;
}

function renderList(arr, wrapper) {
  arr.forEach((elem) => {
    const item = createElement("li", "option");
    item.setAttribute("value", elem.value);
    item.innerHTML = elem.textContent;
    wrapper.append(item);
  });
}
