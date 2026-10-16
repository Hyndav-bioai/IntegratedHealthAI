(function () {
  "use strict";

  function setupExplorer() {
    const page = document.getElementById("page-explorer");
    if (!page || page.dataset.explorerRepairLoaded === "true") return;

    const search = page.querySelector("#explorer-search");
    const cards = Array.from(page.querySelectorAll(".explorer-topic-card"));
    const filters = Array.from(page.querySelectorAll("[data-explorer-filter]"));
    const count = page.querySelector("#explorer-results-count");
    const empty = page.querySelector("#explorer-empty");
    const clear = page.querySelector("#explorer-clear");

    if (!search || !cards.length || !filters.length) {
      console.error("Health Explorer: required elements are missing.");
      return;
    }

    page.dataset.explorerRepairLoaded = "true";
    let category = "all";

    function filterTopics() {
      const query = search.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(function (card) {
        const text = (
          (card.dataset.explorerSearch || "") + " " + card.innerText
        ).toLowerCase();

        const matchesCategory =
          category === "all" ||
          card.dataset.explorerCategory === category;

        const matchesSearch = !query || text.includes(query);
        const show = matchesCategory && matchesSearch;

        card.hidden = !show;
        if (show) visible++;
      });

      if (count) {
        count.textContent =
          visible + " educational topic" + (visible === 1 ? "" : "s");
      }

      if (empty) empty.hidden = visible !== 0;
    }

    search.addEventListener("input", filterTopics);

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        category = button.dataset.explorerFilter || "all";

        filters.forEach(function (item) {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        filterTopics();
      });
    });

    if (clear) {
      clear.addEventListener("click", function () {
        search.value = "";
        category = "all";

        filters.forEach(function (button) {
          const active = button.dataset.explorerFilter === "all";
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });

        filterTopics();
      });
    }

    filterTopics();
    console.log("Health Explorer search and filters are ready.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupExplorer, { once: true });
  } else {
    setupExplorer();
  }
})();
