/* ===================================================================
   CATEGORY DETAIL — infos catégorie + transactions associées
   =================================================================== */

function renderCategoryDetail() {
  const id = getQueryParam("id");
  const category = id ? getCategory(id) : null;
  const content = document.getElementById("category-content");

  if (!category) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Catégorie introuvable</h3>
        <p>Elle a peut-être été supprimée.</p>
        <a href="categories.html" class="btn btn-secondary" style="margin-top:14px;">← Retour aux catégories</a>
      </div>`;
    document.getElementById("category-transactions-body").innerHTML = "";
    return;
  }

  document.getElementById("breadcrumb-name").textContent = category.name;

  const transactions = getTransactions({ categoryId: category.id });
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const badgeClass = category.type === "revenu" ? "badge-income" : "badge-expense";
  const badgeLabel = category.type === "revenu" ? "Catégorie de revenu" : "Catégorie de dépense";

  content.innerHTML = `
    <div class="detail-header">
      <div class="detail-icon" style="background:${category.color}22; color:${category.color};">${category.icon}</div>
      <div style="flex:1;">
        <h1>${escapeHtml(category.name)}</h1>
        <span class="badge ${badgeClass}"><span class="badge-dot"></span>${badgeLabel}</span>
      </div>
      <div class="app-topbar-actions">
        <a href="category-form.html?id=${category.id}" class="btn btn-secondary">Modifier</a>
        <button class="btn btn-danger" onclick="handleDeleteFromDetail('${category.id}', '${escapeHtml(category.name).replace(/'/g, "\\'")}')">Supprimer</button>
      </div>
    </div>

    <div class="two-col">
      <div class="card card-pad">
        <div class="info-list">
          <div class="info-row"><span class="info-label">Description</span><span class="info-value">${escapeHtml(category.description || "—")}</span></div>
          <div class="info-row"><span class="info-label">Type</span><span class="info-value">${category.type === "revenu" ? "Revenu" : "Dépense"}</span></div>
          <div class="info-row"><span class="info-label">Nombre de transactions</span><span class="info-value">${transactions.length}</span></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total cumulé</div>
        <div class="stat-value ${category.type === "revenu" ? "positive" : "negative"}">${formatMoney(total)}</div>
      </div>
    </div>
  `;

  const body = document.getElementById("category-transactions-body");

  if (transactions.length === 0) {
    body.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📭</div><h3>Aucune transaction</h3><p>Aucune transaction n'est encore rattachée à cette catégorie.</p></div></td></tr>`;
    return;
  }

  body.innerHTML = transactions
    .map((t) => {
      const sign = t.type === "revenu" ? "+" : "−";
      return `
        <tr>
          <td data-label="Libellé" class="cell-label"><a href="transaction-detail.html?id=${t.id}">${escapeHtml(t.label)}</a></td>
          <td data-label="Date">${formatDate(t.date)}</td>
          <td data-label="Montant" class="cell-amount ${t.type === "revenu" ? "positive" : "negative"}">${sign} ${formatMoney(t.amount)}</td>
          <td data-label="Actions" class="cell-actions">
            <a href="transaction-form.html?id=${t.id}" class="btn btn-ghost btn-sm">Modifier</a>
          </td>
        </tr>`;
    })
    .join("");
}

function handleDeleteFromDetail(id, name) {
  if (!confirm(`Supprimer la catégorie « ${name} » ? Cette action est irréversible.`)) return;
  deleteCategory(id);
  showToast(`Catégorie « ${name} » supprimée.`);
  window.location.href = "categories.html";
}

document.addEventListener("DOMContentLoaded", renderCategoryDetail);
