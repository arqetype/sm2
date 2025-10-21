function init(): void {
  window.addEventListener("DOMContentLoaded", () => {
    doAThing();
  });
}

function doAThing(): void {
  console.log("hello there");
}

init();
