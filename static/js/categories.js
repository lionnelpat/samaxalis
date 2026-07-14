/* ===================================================================
   CATEGORIES — liste, suppression (sans page dédiée)
   =================================================================== */

function renderCategoryGrid() {
  const grid = document.getElementById("category-grid");
  const categories = getCategories();

  if (categories.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🗂️</div>
        <h3>Aucune catégorie</h3>
        <p>Créez votre première catégorie pour commencer à classer vos transactions.</p>
        <a href="category-form.html" class="btn btn-primary" style="margin-top:14px;">+ Nouvelle catégorie</a>
      </div>`;
    return;
  }

  grid.innerHTML = categories
    .map((cat) => {
      const total = getTransactions({ categoryId: cat.id }).reduce((sum, t) => sum + Number(t.amount), 0);
      const badgeClass = cat.type === "revenu" ? "badge-income" : "badge-expense";
      const badgeLabel = cat.type === "revenu" ? "Revenu" : "Dépense";

      return `
        <div class="category-card">
          <div class="category-card-head">
            <div class="category-icon" style="background:${cat.color}22; color:${cat.color};">${cat.icon}</div>
            <div>
              <div class="category-card-title">
                <a href="category-detail.html?id=${cat.id}">${escapeHtml(cat.name)}</a>
              </div>
              <span class="badge ${badgeClass}"><span class="badge-dot"></span>${badgeLabel}</span>
            </div>
          </div>
          <p class="category-card-desc">${escapeHtml(cat.description || "Pas de description.")}</p>
          <div class="category-card-foot">
            <span class="cell-amount" style="text-align:left;">${formatMoney(total)}</span>
            <div class="category-card-actions">
              <a href="category-detail.html?id=${cat.id}" class="btn btn-ghost btn-sm">Détail</a>
              <a href="category-form.html?id=${cat.id}" class="btn btn-secondary btn-sm">Modifier</a>
              <button class="btn btn-danger btn-sm" onclick="handleDeleteCategory('${cat.id}', '${escapeHtml(cat.name).replace(/'/g, "\\'")}')">Suppr.</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

function handleDeleteCategory(id, name) {
  const nbTxn = getTransactions({ categoryId: id }).length;
  const warning = nbTxn > 0
    ? `Supprimer « ${name} » ? ${nbTxn} transaction(s) associée(s) deviendront "sans catégorie".`
    : `Supprimer la catégorie « ${name} » ? Cette action est irréversible.`;

  if (!confirm(warning)) return;

  deleteCategory(id);
  showToast(`Catégorie « ${name} » supprimée.`);
  renderCategoryGrid();
}

document.addEventListener("DOMContentLoaded", renderCategoryGrid);
