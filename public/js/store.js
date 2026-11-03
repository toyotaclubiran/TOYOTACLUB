(function () {
  var indexNode = document.getElementById("search-index");
  var index = [];
  try { index = JSON.parse(indexNode ? indexNode.textContent : "[]"); } catch (error) { index = []; }
  var input = document.querySelector("[data-search-input]");
  var suggest = document.querySelector("[data-suggest]");
  if (input && suggest) {
    var params = new URLSearchParams(location.search);
    if (params.get("q")) input.value = params.get("q");
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      if (query.length < 1) { suggest.hidden = true; return; }
      var hits = index.filter(function (item) { return String(item.t).toLowerCase().indexOf(query) !== -1; }).slice(0, 6);
      suggest.innerHTML = hits.length
        ? hits.map(function (item) { return '<a href="/product/' + item.s + '/">' + item.t + "</a>"; }).join("")
        : "<p>نتیجه‌ای در کالاها نیست</p>";
      suggest.hidden = false;
    });
    document.addEventListener("click", function (event) {
      if (!suggest.contains(event.target) && event.target !== input) suggest.hidden = true;
    });
  }

  document.querySelectorAll(".hero-slider input").forEach(function (radio, _, all) {
    var timer = setInterval(function () {
      if (document.hidden) return;
      var current = Array.prototype.findIndex.call(all, function (item) { return item.checked; });
      all[(current + 1) % all.length].checked = true;
    }, 6500);
    radio.addEventListener("change", function () { clearInterval(timer); });
  });

  var catalog = document.querySelector("[data-catalog]");
  if (catalog) {
    var cards = Array.prototype.slice.call(catalog.querySelectorAll(".card"));
    var count = catalog.querySelector("[data-count]");
    function selected(name) {
      return Array.prototype.map.call(catalog.querySelectorAll('[data-filter="' + name + '"]:checked'), function (box) { return box.value; });
    }
    function apply() {
      var sockets = selected("socket");
      var watts = selected("watt");
      var statuses = selected("status");
      var query = (input && input.value || "").trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var ok = true;
        var cardSockets = (card.getAttribute("data-sockets") || "").split(" ").filter(Boolean);
        if (sockets.length && !sockets.some(function (socket) { return cardSockets.indexOf(socket) !== -1; })) ok = false;
        if (watts.length && watts.indexOf(card.getAttribute("data-watt") || "") === -1) ok = false;
        if (statuses.length && statuses.indexOf(card.getAttribute("data-status") || "") === -1) ok = false;
        if (query && (card.getAttribute("data-search") || "").indexOf(query) === -1) ok = false;
        card.hidden = !ok;
        if (ok) visible += 1;
      });
      if (count) count.textContent = visible.toLocaleString("fa-IR") + " کالا";
    }
    catalog.addEventListener("change", function (event) {
      if (event.target.matches("[data-filter], [data-sort]")) {
        if (event.target.matches("[data-sort]")) {
          var mode = event.target.value;
          var grid = catalog.querySelector(".product-grid");
          var sorted = cards.slice().sort(function (a, b) {
            if (mode === "name") return (a.querySelector("h3")?.textContent || "").localeCompare(b.querySelector("h3")?.textContent || "", "fa");
            if (mode === "watt") return Number(b.getAttribute("data-watt") || 0) - Number(a.getAttribute("data-watt") || 0);
            return 0;
          });
          sorted.forEach(function (card) { grid.appendChild(card); });
        }
        apply();
      }
    });
    var view = catalog.querySelector("[data-view]");
    if (view) view.addEventListener("click", function () {
      catalog.classList.toggle("is-list");
      view.textContent = catalog.classList.contains("is-list") ? "شبکه" : "لیست";
    });
    if (input) input.addEventListener("input", apply);
    apply();
  }

  document.querySelectorAll("[data-zoom]").forEach(function (button) {
    button.addEventListener("click", function () {
      var box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = '<img alt="" src="' + button.getAttribute("data-zoom") + '">';
      box.addEventListener("click", function () { box.remove(); });
      document.body.appendChild(box);
    });
  });
})();
