/* ===================================================================
   UTILS — fonctions utilitaires partagées
   =================================================================== */

/**
 * Formate un montant en FCFA, ex: 125000 -> "125 000 FCFA"
 */
function formatMoney(amount) {
  const n = Number(amount) || 0;
  const formatted = Math.abs(n).toLocaleString("fr-FR").replace(/,/g, " ");
  return formatted + " FCFA";
}

/**
 * Formate une date ISO "2026-07-10" -> "10 juil. 2026"
 */
function formatDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Lit un paramètre de l'URL (?id=3 -> getQueryParam('id') === "3")
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Génère un identifiant simple (à remplacer par l'auto-increment de la BDD côté Django)
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Affiche un petit toast en bas de page (utilisé après suppression)
 */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/**
 * Petit helper de création d'éléments DOM sans dépendance
 */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "class") node.className = value;
    else if (key === "html") node.innerHTML = value;
    else if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  });
  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (child === null || child === undefined) return;
    node.append(child.nodeType ? child : document.createTextNode(child));
  });
  return node;
}

/**
 * Echappe du texte utilisateur avant insertion dans innerHTML
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
