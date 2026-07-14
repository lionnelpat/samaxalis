/* ===================================================================
   NAV — construit le menu latéral et l'injecte dans #sidebar-mount.
   Centraliser le menu ici évite de dupliquer le HTML sur chaque page
   (équivalent JS d'un {% include "partials/sidebar.html" %} Django).
   =================================================================== */

const NAV_LINKS = [
  { page: "dashboard", href: "index.html", icon: "◆", label: "Tableau de bord" },
  { page: "categories", href: "categories.html", icon: "▤", label: "Catégories" },
  { page: "transactions", href: "transactions.html", icon: "↕", label: "Transactions" },
];

function renderSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  const currentPage = document.body.dataset.page;

  const links = NAV_LINKS.map(
    (link) => `
      <a href="${link.href}" class="${link.page === currentPage ? "active" : ""}">
        <span class="nav-icon">${link.icon}</span>
        <span>${link.label}</span>
      </a>`
  ).join("");

  mount.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-name">Jokko Finance</span>
        <span class="brand-tag">MonBudget · Dakar</span>
      </div>
      <nav class="sidebar-nav">${links}</nav>
      <div class="sidebar-footer">Connecté en tant que <strong style="color:#fff">Aïssatou D.</strong></div>
    </aside>
  `;
}

document.addEventListener("DOMContentLoaded", renderSidebar);
