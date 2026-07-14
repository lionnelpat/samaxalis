/* ===================================================================
   TRANSACTIONS — liste, filtres, recherche, tri, suppression
   =================================================================== */

let currentSort = "-date";

function populateCategoryFilter() {
  const select = document.getElementById("filter-category");
  getCategories().forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = `${cat.icon} ${cat.name}`;
    select.appendChild(option);
  });
}

function getCurrentFilters() {
  return {
    search: document.getElementById("search").value.trim(),
    categoryId: document.getElementById("filter-category").value,
    type: document.getElementById("filter-type").value,
    dateFrom: document.getElementById("date-from").value,
    dateTo: document.getElementById("date-to").value,
    sort: currentSort,
  };
}

function renderTransactionsTable() {
  const filters = getCurrentFilters();
  const results = getTransactions(filters);
  const body = document.getElementById("transactions-body");

  document.getElementById("results-meta").textContent =
    results.length === 0 ? "Aucun résultat" : `${results.length} transaction(s) trouvée(s)`;

  document.getElementById("sort-date").textContent = "Date " + (currentSort === "-date" ? "↓" : currentSort === "date" ? "↑" : "");
  document.getElementById("sort-amount").textContent = "Montant " + (currentSort === "-amount" ? "↓" : currentSort === "amount" ? "↑" : "");

  if (results.length === 0) {
    body.innerHTML = `
      <tr><td colspan="5">
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Aucune transaction ne correspond</h3>
          <p>Essayez d'élargir vos filtres ou votre recherche.</p>
        </div>
      </td></tr>`;
    return;
  }

  body.innerHTML = results
    .map((t) => {
      const cat = getCategory(t.categoryId);
      const sign = t.type === "revenu" ? "+" : "−";
      return `
        <tr>
          <td data-label="Libellé" class="cell-label">
            <a href="transaction-detail.html?id=${t.id}">${escapeHtml(t.label)}</a>
            ${t.note ? `<div class="cell-sub">${escapeHtml(t.note)}</div>` : ""}
          </td>
          <td data-label="Catégorie">
            ${cat ? `<span class="badge ${t.type === "revenu" ? "badge-income" : "badge-expense"}">${cat.icon} ${escapeHtml(cat.name)}</span>` : `<span class="cell-sub">Sans catégorie</span>`}
          </td>
          <td data-label="Date">${formatDate(t.date)}</td>
          <td data-label="Montant" class="cell-amount ${t.type === "revenu" ? "positive" : "negative"}">${sign} ${formatMoney(t.amount)}</td>
          <td data-label="Actions" class="cell-actions">
            <a href="transaction-form.html?id=${t.id}" class="btn btn-ghost btn-sm">Modifier</a>
            <button class="btn btn-danger btn-sm" onclick="handleDeleteTransaction('${t.id}', '${escapeHtml(t.label).replace(/'/g, "\\'")}')">Suppr.</button>
          </td>
        </tr>`;
    })
    .join("");
}

function handleDeleteTransaction(id, label) {
  if (!confirm(`Supprimer la transaction « ${label} » ? Cette action est irréversible.`)) return;
  deleteTransaction(id);
  showToast(`Transaction « ${label} » supprimée.`);
  renderTransactionsTable();
}

function initFilters() {
  populateCategoryFilter();

  ["search", "filter-category", "filter-type", "date-from", "date-to"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderTransactionsTable);
    document.getElementById(id).addEventListener("change", renderTransactionsTable);
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    document.getElementById("filter-form").reset();
    renderTransactionsTable();
  });

  document.getElementById("sort-date").addEventListener("click", (e) => {
    e.preventDefault();
    currentSort = currentSort === "-date" ? "date" : "-date";
    renderTransactionsTable();
  });

  document.getElementById("sort-amount").addEventListener("click", (e) => {
    e.preventDefault();
    currentSort = currentSort === "-amount" ? "amount" : "-amount";
    renderTransactionsTable();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  renderTransactionsTable();
});
