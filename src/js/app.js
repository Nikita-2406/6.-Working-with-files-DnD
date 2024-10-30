let btnsAdd = document.querySelectorAll(".block");
let actualElem;
let actualElemXY;
let lastMouseElem;
let new_elem_opasity;
let newBlock;
let mouseUpItem;

function toogleMove(elem1, elem2) {
  elem1.classList.toggle("unvisible");
  elem2.classList.toggle("unvisible");
}

function formOnSubmit(e, form, bodyCards, btn) {
  e.preventDefault();
  let textarea = form.querySelector("textarea");
  const card = document.createElement("div");
  card.classList.add("card");
  card.textContent = textarea.value;
  bodyCards.append(card);
  toogleMove(btn, form);
  textarea.value = "";
}

for (const elem of btnsAdd) {
  let btn = elem.querySelector(".add--btn");
  let form = elem.querySelector(".add--card--form");
  let formBackBtn = elem.querySelector(".back--btn");
  let bodyCards = elem.querySelector(".body--cards");

  btn.addEventListener("click", () => {
    toogleMove(btn, form);
  });

  formBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toogleMove(btn, form);
  });

  form.addEventListener("submit", (e) => {
    formOnSubmit(e, form, bodyCards, btn);
  });

  bodyCards.addEventListener("mousedown", (e) => {
    e.preventDefault();
    actualElem = e.target;
    newBlock = e.target.closest(".block");
    actualElemXY = [
      e.clientX - actualElem.offsetLeft,
      e.clientY - actualElem.offsetTop,
    ];

    actualElem.classList.add("dragged");
    document.documentElement.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mousemove", onMouseOver);
  });
}

const onMouseOver = (e) => {
  actualElem.style.left = `${e.clientX - actualElemXY[0]}px`;
  actualElem.style.top = `${e.clientY - actualElemXY[1]}px`;
  newBlock = e.target.closest(".block");

  if (newBlock && newBlock !== lastMouseElem) {
    new_elem_opasity ? new_elem_opasity.remove() : console.log("000");

    new_elem_opasity = document.createElement("div");
    new_elem_opasity.innerHTML = actualElem.innerHTML;
    new_elem_opasity.style.opacity = 0;
    new_elem_opasity.classList.add("card");
    new_elem_opasity.classList.add("unvis");

    new_elem_opasity = newBlock
      .querySelector(".body--cards")
      .appendChild(new_elem_opasity);

    lastMouseElem = newBlock;
  }

  if (e.target.classList.value == "card") {
    newBlock
      .querySelector(".body--cards")
      .insertBefore(new_elem_opasity, e.target);
    mouseUpItem = e.target;
  }
};

const onMouseUp = (e) => {
  if (mouseUpItem.closest(".block") !== null) {
    let newField = e.target.closest(".block").querySelector(".body--cards");
    let elem = document.createElement("div");
    elem.classList.add("card");
    elem.innerHTML = actualElem.innerHTML;
    newField.appendChild(elem);
    if (mouseUpItem.classList.value == "card") {
      newField.insertBefore(elem, mouseUpItem);
    }

    actualElem.remove();
  } else {
    actualElem.removeAttribute("style");
  }

  new_elem_opasity ? new_elem_opasity.remove() : new_elem_opasity;

  actualElem.classList.remove("dragged");

  actualElem = undefined;
  lastMouseElem = undefined;
  new_elem_opasity = undefined;
  document.documentElement.removeEventListener("mouseup", onMouseUp);
  document.documentElement.removeEventListener("mousemove", onMouseOver);
};

window.addEventListener("beforeunload", () => {
  const blockData = {};
  const blocks = document.querySelectorAll(".block");
  for (const elem of blocks) {
    const readyText = [];
    for (const card of elem.querySelectorAll(".card")) {
      readyText.push(card.textContent);
    }
    blockData[elem.querySelector("h2").textContent] = readyText;
  }

  localStorage.setItem("blockData", JSON.stringify(blockData));
});

document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("blockData");
  let formData;
  try {
    formData = JSON.parse(json);
  } catch (error) {
    console.log("Error", error);
  }

  if (formData) {
    Object.keys(formData).forEach((el) => {
      const place = document
        .querySelector(`[name="${el}"]`)
        .querySelector(".body--cards");
      for (const value of formData[el]) {
        const elem = document.createElement("div");
        elem.classList.add("card");
        elem.textContent = value;
        place.append(elem);
      }
    });
  }
});
