/* ===================================================================
   DASHBOARD — statistiques, dernières transactions, résumé catégories
   =================================================================== */

function renderStats() {
  const summary = computeSummary(getTransactions());
  const row = document.getElementById("stat-row");
  row.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Solde global</div>
      <div class="stat-value ${summary.solde >= 0 ? "positive" : "negative"}">${formatMoney(summary.solde)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Revenus</div>
      <div class="stat-value positive">${formatMoney(summary.revenus)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Dépenses</div>
      <div class="stat-value negative">${formatMoney(summary.depenses)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Transactions</div>
      <div class="stat-value">${summary.count}</div>
    </div>
  `;
}

function renderRecent() {
  const list = document.getElementById("recent-list");
  const recent = getTransactions({ sort: "-date" }).slice(0, 5);

  if (recent.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🗂️</div><h3>Aucune transaction</h3><p>Ajoutez votre première transaction pour voir apparaître l'historique ici.</p></div>`;
    return;
  }

  list.innerHTML = recent
    .map((t) => {
      const cat = getCategory(t.categoryId);
      const sign = t.type === "revenu" ? "+" : "−";
      return `
        <div class="info-row">
          <span class="info-label">
            <a href="transaction-detail.html?id=${t.id}"><strong style="color:inherit">${escapeHtml(t.label)}</strong></a><br>
            <span class="cell-sub">${cat ? escapeHtml(cat.name) : "Sans catégorie"} · ${formatDate(t.date)}</span>
          </span>
          <span class="info-value ${t.type === "revenu" ? "positive" : "negative"}" style="font-family:var(--font-mono)">
            ${sign} ${formatMoney(t.amount)}
          </span>
        </div>`;
    })
    .join("");
}

function renderCategorySummary() {
  const container = document.getElementById("category-summary");
  const categories = getCategories();

  if (categories.length === 0) {
    container.innerHTML = `<p class="field-hint">Aucune catégorie créée pour le moment.</p>`;
    return;
  }

  container.innerHTML = categories
    .slice(0, 6)
    .map((cat) => {
      const total = getTransactions({ categoryId: cat.id }).reduce((sum, t) => sum + Number(t.amount), 0);
      return `
        <div class="info-row">
          <span class="info-label">
            <span class="category-icon" style="width:28px;height:28px;font-size:14px;background:${cat.color}22;color:${cat.color};display:inline-flex;vertical-align:middle;margin-right:8px;">${cat.icon}</span>
            ${escapeHtml(cat.name)}
          </span>
          <span class="info-value">${formatMoney(total)}</span>
        </div>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderRecent();
  renderCategorySummary();
});
