var container = document.querySelector(".brands");
var ele = document.querySelector(".brands-list");
var listingEle = document.querySelector(".brands-scroll");
var brands = ele.children;
var brandsCount = brands.length;
var previousPosition = 0;
// one listItem with margin-right have a 26px width
var viewableItems = Math.round((window.innerWidth * 0.74) / 26);

var itemsLen = null;
var maxSlideableWidth = null;
var scrollDestination = 0;
var startPosition = 0;

var showMoreBtn = null;
var isHideMoreActive = false;

listingEle.onmouseover = function () {
  window.onwheel = function (ev) {
    ev.stopImmediatePropagation();
    console.log(viewableItems);
    console.log(maxSlideableWidth);
    if (ev.deltaY < 0) {
      scrollDestination = Math.max(
        0,
        Math.min(scrollDestination + 30, maxSlideableWidth)
      );
      listingEle.scrollTo(scrollDestination, 0);
    } else {
      scrollDestination = Math.max(
        0,
        Math.min(scrollDestination - 30, maxSlideableWidth)
      );
      listingEle.scrollTo(scrollDestination, 0);
    }
  };
};

function showBrand(selected, position) {
  for (const item of listingEle.children) {
    item.classList.remove("my-x-scroll-item--selected");
  }
  selected.classList.add("my-x-scroll-item--selected");

  let width = position * 255;
  startPosition = position;
  previousPosition = width;
  ele.scrollTo(width, 0);
}

function dragTheBall(position) {
  for (const item of listingEle.children) {
    console.log("fired");
    item.classList.remove("my-x-scroll-item--selected");
  }
  listingEle.children[position].classList.add("my-x-scroll-item--selected");
}

for (let q = 0; q < brandsCount; q++) {
  const listItem = document.createElement("div");
  if (q == 0) {
    listItem.classList.add("my-x-scroll-item", "my-x-scroll-item--selected");
  } else {
    listItem.classList.add("my-x-scroll-item");
  }
  listingEle.appendChild(listItem);
  listItem.onclick = function () {
    showBrand(listItem, q);
  };
}

viewableItems = Math.round((window.innerWidth * 0.74) / 26);
itemsLen = listingEle.children.length - 1;
maxSlideableWidth = (listingEle.children.length - viewableItems) * 26;

ele.ontouchstart = function (onStart) {
  ele.ontouchend = function (onEnd) {
    var before = onStart.changedTouches[0].pageX;
    var after = onEnd.changedTouches[0].pageX;
    if (before != after) {
      var swipeToLeft = before > after ? true : false;
      console.log(swipeToLeft);
      if (swipeToLeft) {
        ++startPosition;
        previousPosition += 255;
        ele.scrollTo(previousPosition, 0);
      } else {
        --startPosition;
        previousPosition -= 255;
        ele.scrollTo(previousPosition, 0);
      }
      dragTheBall(startPosition);
    }
  };
};

function prepareButton() {
  var button = document.createElement("button");
  var buttonIcon = document.createElement("img");
  button.classList.add("brands__show-more-btn", "show-more-btn");
  button.dataset.text = "Показать всё";
  buttonIcon.src = "../images/buttons-icons/showMore.svg";
  buttonIcon.alt = "Показать всё";
  button.appendChild(buttonIcon);
  return button;
}

function btnIsRequire() {
  let listPadding = 40;
  ele = document.querySelector(".brands-list");
  let brandsCount = ele.children.length;
  let brandContainer = { h: 70, w: 240 };
  let listEle = { w: ele.clientWidth - listPadding };
  let viewedInRow = Math.floor(listEle.w / brandContainer.w);
  if (viewedInRow > brandsCount / 2) {
    return false;
  } else {
    return brandsCount % viewedInRow != 0;
  }
}

function hideMore() {
  showMoreBtn.children[0].style.transform = "scaleY(1)";
  showMoreBtn.dataset.text = "Показать всё";
  ele.style.height = "170px";
}

function showMore() {
  showMoreBtn.children[0].style.transform = "scaleY(-1)";
  showMoreBtn.dataset.text = "Скрыть";
  ele.style.height = "100%";
}

function clickListener() {
  !isHideMoreActive ? showMore() : hideMore();
  isHideMoreActive = !isHideMoreActive;
}

window.onresize = function (ev) {
  ev.stopImmediatePropagation();
  viewableItems = Math.round((window.innerWidth * 0.74) / 26);
  maxSlideableWidth = (listingEle.children.length - viewableItems) * 26;
  if (window.innerWidth >= 768 && showMoreBtn == null && btnIsRequire()) {
    showMoreBtn = prepareButton();
    container.children[1].after(showMoreBtn);
    showMoreBtn.onclick = clickListener;
  } else if (window.innerWidth < 768 && showMoreBtn != null) {
    hideMore();
    showMoreBtn = null;
    container.children[2].remove();
  } else if (!btnIsRequire() && showMoreBtn != null) {
    showMoreBtn = null;
    container.children[2].remove();
  }
};

if (window.innerWidth >= 768 && btnIsRequire()) {
  showMoreBtn = prepareButton();
  container.children[1].after(showMoreBtn);
  showMoreBtn.onclick = clickListener;
}

if (showMoreBtn != null) {
  showMoreBtn.onclick = clickListener;
}
