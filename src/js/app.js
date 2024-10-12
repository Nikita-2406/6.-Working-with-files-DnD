let btnsAdd = document.querySelectorAll(".block");
let actualElem;
let actualElemXY;
let lastMouseElem;

export const forTest = () => {
  return 5;
};

for (const elem of btnsAdd) {
  let btn = elem.querySelector(".add--btn");
  let form = elem.querySelector(".add--card--form");
  let formBackBtn = elem.querySelector(".back--btn");
  let bodyCards = elem.querySelector(".body--cards");

  btn.addEventListener("click", () => {
    btn.classList.toggle("unvisible");
    form.classList.toggle("unvisible");
  });

  formBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    btn.classList.toggle("unvisible");
    form.classList.toggle("unvisible");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let textarea = form.querySelector("textarea");
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = textarea.value;
    bodyCards.appendChild(card);
    btn.classList.toggle("unvisible");
    form.classList.toggle("unvisible");
    textarea.value = "";
  });

  bodyCards.addEventListener("mousedown", (e) => {
    e.preventDefault();
    actualElem = e.target;
    actualElemXY = [
      e.clientX - actualElem.offsetLeft,
      e.clientY - actualElem.offsetTop,
    ];
    lastMouseElem = actualElem.closest(".block");
    actualElem.classList.add("dragged");
    document.documentElement.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseover", onMouseOver);
  });
}

const onMouseOver = (e) => {
  actualElem.style.left = `${e.clientX - actualElemXY[0]}px`;
  actualElem.style.top = `${e.clientY - actualElemXY[1]}px`;
  let newBlock = e.target.closest(".block");
  if (newBlock && newBlock != lastMouseElem) {
    newBlock.querySelector(".body--cards").style.height =
      `${newBlock.querySelector(".body--cards").offsetHeight + actualElem.offsetHeight}px`;
    lastMouseElem = newBlock;
  }

  if (lastMouseElem && newBlock != lastMouseElem) {
    lastMouseElem.querySelector(".body--cards").removeAttribute("style");
  }
};

const onMouseUp = (e) => {
  let newField = e.target.closest(".block").querySelector(".body--cards");
  let mouseUpItem = e.target;
  let elem = document.createElement("div");
  // console.log(mouseUpItem.classList.value)
  elem.classList.add("card");
  elem.innerHTML = actualElem.innerHTML;

  newField.appendChild(elem);
  if (mouseUpItem.classList.value == "card") {
    newField.insertBefore(elem, mouseUpItem);
  }

  actualElem.remove();
  actualElem.classList.remove("dragged");

  actualElem = undefined;
  lastMouseElem = undefined;
  document.documentElement.removeEventListener("mouseup", onMouseUp);
  document.documentElement.removeEventListener("mouseover", onMouseOver);
};
