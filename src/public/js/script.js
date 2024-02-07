var container = document.querySelector(".brands");
var ele = document.querySelector(".brands-list");
var listingEle = document.querySelector(".brands__scroll");
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

var initScrollValue = 244;
var initViewedBrands = Math.floor(window.innerWidth / 244);
var initScrollItems = 0;

switch (initViewedBrands) {
  case 1:
    initScrollItems = brands.length;
    break;
  case 2:
    initScrollItems = 6;
    initScrollValue = 244 * 2;
    break;
  case 3:
    initScrollItems = 4;
    initScrollValue = 244 * 3;
    break;
}

listingEle.onmouseover = function () {
  window.onwheel = function (ev) {
    ev.stopImmediatePropagation();
    if (ev.deltaY < 0) {
      scrollDestination = Math.max(
        0,
        Math.min(scrollDestination + 35, maxSlideableWidth)
      );
      listingEle.scrollTo(scrollDestination, 0);
    } else {
      scrollDestination = Math.max(
        0,
        Math.min(scrollDestination - 35, maxSlideableWidth)
      );
      listingEle.scrollTo(scrollDestination, 0);
    }
  };
};

function getBlurEle() {
  var div = document.createElement("div");
  div.classList.add("blur");
  div.style.opacity = 0;
  return div;
}

function blurEdge(position) {
  if (position == listingEle.children.length - 1) {
    let blurEle = document.querySelector(".blur");
    blurEle.style.opacity = 0;
    setTimeout(() => {
      container.removeChild(blurEle);
    }, 1000);
  } else if (position != listingEle.children.length - 1) {
    let blurEle = document.querySelector(".blur");
    if (blurEle == null) {
      blurEle = getBlurEle();
      container.appendChild(blurEle);
      setTimeout(() => {
        blurEle.style.opacity = 1;
      }, 10);
    }
  }
}

function showBrand(selected, position) {
  for (const item of listingEle.children) {
    item.classList.remove("my-x-scroll-item--selected");
  }
  selected.classList.add("my-x-scroll-item--selected");

  let width = position * initScrollValue;
  startPosition = position;
  previousPosition = width;
  ele.scrollTo({ left: width, behavior: "smooth" });
  blurEdge(position);
}

function dragTheBall(position) {
  for (const item of listingEle.children) {
    item.classList.remove("my-x-scroll-item--selected");
  }
  listingEle.children[position].classList.add("my-x-scroll-item--selected");
}

function drawXScroll(itemsCount) {
  for (let q = 0; q < itemsCount; q++) {
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
}

drawXScroll(initScrollItems);

viewableItems = Math.round((window.innerWidth * 0.74) / 26);
itemsLen = listingEle.children.length - 1;
maxSlideableWidth = (listingEle.children.length - viewableItems) * 26;

ele.ontouchstart = function (onStart) {
  ele.ontouchend = function (onEnd) {
    var before = onStart.changedTouches[0].pageX;
    var after = onEnd.changedTouches[0].pageX;
    if (before != after) {
      var swipeToLeft = before > after ? true : false;
      if (swipeToLeft && startPosition < 10) {
        ++startPosition;
        previousPosition += initScrollValue;
        // ele.scrollTo(previousPosition, 0);
        ele.scrollTo({ left: previousPosition, behavior: "smooth" });
      } else if (!swipeToLeft && startPosition > 0) {
        --startPosition;
        previousPosition -= initScrollValue;
        ele.scrollTo({ left: previousPosition, behavior: "smooth" });
      }
      dragTheBall(startPosition);
      blurEdge(startPosition);
    }
    console.log(listingEle);
  };
};

container.onmousedown = function (clickEv) {
  clickEv.preventDefault();
  window.onmouseup = function (moveEv) {
    var before = clickEv.screenX;
    var after = moveEv.screenX;
    if (before != after) {
      var swipeToLeft = before > after ? true : false;
      if (swipeToLeft && startPosition < 10) {
        ++startPosition;
        previousPosition += initScrollValue;
        ele.scrollTo({ left: previousPosition, behavior: "smooth" });
      } else if (!swipeToLeft && startPosition > 0) {
        --startPosition;
        previousPosition -= initScrollValue;
        ele.scrollTo({ left: previousPosition, behavior: "smooth" });
      }
      dragTheBall(startPosition);
      blurEdge(startPosition);
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

function hideMore() {
  showMoreBtn.children[0].style.transform = "scaleY(1)";
  showMoreBtn.dataset.text = "Показать всё";
  ele.style.removeProperty("flex-wrap");
  if (window.innerWidth >= 768) {
    ele.style.height = "170px";
  } else {
    ele.style.height = "70px";
  }
}

function showMore() {
  showMoreBtn.children[0].style.transform = "scaleY(-1)";
  showMoreBtn.dataset.text = "Скрыть";
  ele.style.flexWrap = "wrap";
  ele.style.height = "auto";
}

function clickListener() {
  !isHideMoreActive ? showMore() : hideMore();
  isHideMoreActive = !isHideMoreActive;
}

function rerenderScroll(count, perOneItem) {
  listingEle.innerHTML = "";
  drawXScroll(count);
  let scrolledBrands = ele.scrollLeft / 244;
  let toDrag = Math.ceil(scrolledBrands / perOneItem);
  dragTheBall(toDrag);
}

function recountScrollItems(listWidth) {
  let viewedBrands = Math.floor(listWidth / 244);
  if (initViewedBrands != viewedBrands) {
    switch (viewedBrands) {
      case 3:
        rerenderScroll(4, 3);
        initScrollValue = 244 * 3;
        break;
      case 2:
        rerenderScroll(6, 2);
        initScrollValue = 244 * 2;
        break;
      case 1:
        rerenderScroll(brands.length, 1);
        initScrollValue = 244;
        break;
    }
    initViewedBrands = viewedBrands;
  }
}

function removeBlur() {
  var beforeBlur = document.querySelector(".blur-before");
  var beforeAfter = document.querySelector(".blur-after");
  container.removeChild(beforeBlur);
  container.removeChild(beforeAfter);
}

window.onresize = function (ev) {
  ev.stopImmediatePropagation();
  recountScrollItems(window.innerWidth);
  viewableItems = Math.round((window.innerWidth * 0.74) / 26);
  maxSlideableWidth = (listingEle.children.length - viewableItems) * 26;
  if (window.innerWidth >= 768 && showMoreBtn == null) {
    showMoreBtn = prepareButton();
    container.children[1].after(showMoreBtn);
    showMoreBtn.onclick = clickListener;
    removeBlur();
  } else if (window.innerWidth < 768 && showMoreBtn != null) {
    hideMore();
    showMoreBtn = null;
    container.children[2].remove();
    blurEdge(0);
  }
};

if (window.innerWidth >= 768) {
  showMoreBtn = prepareButton();
  container.children[1].after(showMoreBtn);
  showMoreBtn.onclick = clickListener;
}

if (showMoreBtn != null) {
  showMoreBtn.onclick = clickListener;
}
