/* ===================================================================
   DATA LAYER — simule la base de données via localStorage.
   Cette couche est volontairement isolée : quand le projet sera
   branché sur Django, seules les fonctions ci-dessous seront
   remplacées par des appels fetch() vers l'API (ex: /api/categories/).
   Le reste du code (pages, rendu HTML) n'aura pas à changer.
   =================================================================== */

const STORAGE_KEYS = {
  categories: "jokko_categories",
  transactions: "jokko_transactions",
};

const CATEGORY_COLORS = ["#0f8b8d", "#e8a33d", "#c7402d", "#3a5a9b", "#7a4fb0", "#2f9e5c"];
const CATEGORY_ICONS = ["💰", "🏠", "🚌", "🍽️", "💡", "📱", "🎓", "🩺", "🛍️", "✈️", "🏦", "🎁"];

function seedData() {
  if (!localStorage.getItem(STORAGE_KEYS.categories)) {
    const categories = [
      { id: "cat-1", name: "Salaire", type: "revenu", color: "#0f8b8d", icon: "💰", description: "Salaire mensuel et primes" },
      { id: "cat-2", name: "Loyer", type: "depense", color: "#c7402d", icon: "🏠", description: "Loyer et charges du logement" },
      { id: "cat-3", name: "Transport", type: "depense", color: "#3a5a9b", icon: "🚌", description: "Transport en commun, essence, Yango" },
      { id: "cat-4", name: "Alimentation", type: "depense", color: "#e8a33d", icon: "🍽️", description: "Marché, restaurants, courses" },
      { id: "cat-5", name: "Epargne Jokko", type: "revenu", color: "#2f9e5c", icon: "🏦", description: "Virement vers JokkoSave" },
      { id: "cat-6", name: "Freelance", type: "revenu", color: "#7a4fb0", icon: "📱", description: "Missions de conseil ponctuelles" },
    ];
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  }

  if (!localStorage.getItem(STORAGE_KEYS.transactions)) {
    const transactions = [
      { id: "txn-1", label: "Salaire juin", amount: 450000, type: "revenu", categoryId: "cat-1", date: "2026-06-30", note: "Virement CBAO" },
      { id: "txn-2", label: "Loyer appartement Sacré-Coeur", amount: 120000, type: "depense", categoryId: "cat-2", date: "2026-07-02", note: "" },
      { id: "txn-3", label: "Courses Auchan Sea Plaza", amount: 32500, type: "depense", categoryId: "cat-4", date: "2026-07-04", note: "" },
      { id: "txn-4", label: "Trajets Yango semaine", amount: 15000, type: "depense", categoryId: "cat-3", date: "2026-07-05", note: "" },
      { id: "txn-5", label: "Mission conseil SONAM", amount: 85000, type: "revenu", categoryId: "cat-6", date: "2026-07-06", note: "Facture n°014" },
      { id: "txn-6", label: "Virement JokkoSave", amount: 60000, type: "depense", categoryId: "cat-5", date: "2026-07-08", note: "Objectif épargne juillet" },
      { id: "txn-7", label: "Restaurant Ngor", amount: 18500, type: "depense", categoryId: "cat-4", date: "2026-07-09", note: "" },
      { id: "txn-8", label: "Essence", amount: 25000, type: "depense", categoryId: "cat-3", date: "2026-07-10", note: "" },
    ];
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }
}

function readStore(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function writeStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ---------------------- CATEGORIES ---------------------- */

function getCategories() {
  return readStore(STORAGE_KEYS.categories);
}

function getCategory(id) {
  return getCategories().find((c) => c.id === id) || null;
}

function saveCategory(category) {
  const categories = getCategories();
  if (category.id) {
    const index = categories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...category };
    }
  } else {
    category.id = "cat-" + generateId();
    categories.push(category);
  }
  writeStore(STORAGE_KEYS.categories, categories);
  return category;
}

function deleteCategory(id) {
  writeStore(STORAGE_KEYS.categories, getCategories().filter((c) => c.id !== id));
  // Les transactions liées perdent leur catégorie plutôt que d'être supprimées
  const transactions = getTransactions().map((t) => (t.categoryId === id ? { ...t, categoryId: null } : t));
  writeStore(STORAGE_KEYS.transactions, transactions);
}

function categoryHasTransactions(id) {
  return getTransactions().some((t) => t.categoryId === id);
}

/* ---------------------- TRANSACTIONS ---------------------- */

function getTransactions(filters = {}) {
  let results = readStore(STORAGE_KEYS.transactions);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((t) => t.label.toLowerCase().includes(q) || (t.note || "").toLowerCase().includes(q));
  }
  if (filters.categoryId) {
    results = results.filter((t) => t.categoryId === filters.categoryId);
  }
  if (filters.type) {
    results = results.filter((t) => t.type === filters.type);
  }
  if (filters.dateFrom) {
    results = results.filter((t) => t.date >= filters.dateFrom);
  }
  if (filters.dateTo) {
    results = results.filter((t) => t.date <= filters.dateTo);
  }

  const sort = filters.sort || "-date";
  const field = sort.replace("-", "");
  const dir = sort.startsWith("-") ? -1 : 1;
  results.sort((a, b) => {
    if (a[field] < b[field]) return -1 * dir;
    if (a[field] > b[field]) return 1 * dir;
    return 0;
  });

  return results;
}

function getTransaction(id) {
  return getTransactions().find((t) => t.id === id) || null;
}

function saveTransaction(transaction) {
  const transactions = readStore(STORAGE_KEYS.transactions);
  if (transaction.id) {
    const index = transactions.findIndex((t) => t.id === transaction.id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...transaction };
    }
  } else {
    transaction.id = "txn-" + generateId();
    transactions.push(transaction);
  }
  writeStore(STORAGE_KEYS.transactions, transactions);
  return transaction;
}

function deleteTransaction(id) {
  writeStore(STORAGE_KEYS.transactions, readStore(STORAGE_KEYS.transactions).filter((t) => t.id !== id));
}

/* ---------------------- AGREGATS ---------------------- */

function computeSummary(transactions) {
  const revenus = transactions.filter((t) => t.type === "revenu").reduce((sum, t) => sum + Number(t.amount), 0);
  const depenses = transactions.filter((t) => t.type === "depense").reduce((sum, t) => sum + Number(t.amount), 0);
  return { revenus, depenses, solde: revenus - depenses, count: transactions.length };
}

seedData();
