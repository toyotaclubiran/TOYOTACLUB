(function () {
  var params = new URLSearchParams(location.search);
  var query = (params.get("q") || "").trim().toLowerCase();
  var box = document.querySelector(".search input");
  if (box && query) box.value = query;
  if (!query) return;
  document.querySelectorAll(".card").forEach(function (card) {
    var hay = card.getAttribute("data-search") || "";
    card.hidden = hay.indexOf(query) === -1;
  });
})();
