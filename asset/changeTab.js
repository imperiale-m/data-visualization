function changeTab(ta, tabID) {
  const aElements = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  for (let i = 0; i < aElements.length; i++) {
    aElements[i].classList.remove("text-white");
    aElements[i].classList.remove("bg-pink-600");
    aElements[i].classList.add("text-pink-700");
    aElements[i].classList.add("bg-gray-100");
    tabContents[i].classList.add("hidden");
    tabContents[i].classList.remove("block");
  }
  const element = document.getElementById(ta);
  element.classList.remove("text-pink-700");
  element.classList.remove("bg-gray-100");
  element.classList.add("text-white");
  element.classList.add("bg-pink-600");
  document.getElementById(tabID).classList.remove("hidden");
  document.getElementById(tabID).classList.add("block");
}
