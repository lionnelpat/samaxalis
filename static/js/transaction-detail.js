/* ===================================================================
   TRANSACTION DETAIL — fiche complète d'une transaction
   =================================================================== */

function renderTransactionDetail() {
  const id = getQueryParam("id");
  const transaction = id ? getTransaction(id) : null;
  const content = document.getElementById("transaction-content");

  if (!transaction) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Transaction introuvable</h3>
        <p>Elle a peut-être été supprimée.</p>
        <a href="transactions.html" class="btn btn-secondary" style="margin-top:14px;">← Retour aux transactions</a>
      </div>`;
    return;
  }

  document.getElementById("breadcrumb-name").textContent = transaction.label;

  const category = getCategory(transaction.categoryId);
  const isRevenu = transaction.type === "revenu";
  const sign = isRevenu ? "+" : "−";

  content.innerHTML = `
    <div class="app-topbar">
      <div>
        <span class="eyebrow">${isRevenu ? "Revenu" : "Dépense"}</span>
        <h1>${escapeHtml(transaction.label)}</h1>
      </div>
    </div>

    <div class="card card-pad" style="margin-bottom:20px;">
      <div class="stat-label">Montant</div>
      <div class="detail-amount-hero ${isRevenu ? "positive" : "negative"}">${sign} ${formatMoney(transaction.amount)}</div>

      <div class="info-list" style="margin-top:22px;">
        <div class="info-row">
          <span class="info-label">Catégorie</span>
          <span class="info-value">
            ${category ? `<span class="badge ${isRevenu ? "badge-income" : "badge-expense"}">${category.icon} ${escapeHtml(category.name)}</span>` : "Sans catégorie"}
          </span>
        </div>
        <div class="info-row"><span class="info-label">Date</span><span class="info-value">${formatDate(transaction.date)}</span></div>
        <div class="info-row"><span class="info-label">Note</span><span class="info-value">${escapeHtml(transaction.note || "—")}</span></div>
      </div>
    </div>

    <div class="app-topbar-actions">
      <a href="transaction-form.html?id=${transaction.id}" class="btn btn-secondary">Modifier</a>
      <button class="btn btn-danger" onclick="handleDeleteFromDetail('${transaction.id}', '${escapeHtml(transaction.label).replace(/'/g, "\\'")}')">Supprimer</button>
      ${category ? `<a href="category-detail.html?id=${category.id}" class="btn btn-ghost">Voir la catégorie →</a>` : ""}
    </div>
  `;
}

function handleDeleteFromDetail(id, label) {
  if (!confirm(`Supprimer la transaction « ${label} » ? Cette action est irréversible.`)) return;
  deleteTransaction(id);
  showToast(`Transaction « ${label} » supprimée.`);
  window.location.href = "transactions.html";
}

document.addEventListener("DOMContentLoaded", renderTransactionDetail);
