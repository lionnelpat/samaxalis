/* ===================================================================
   TRANSACTION FORM — une seule page pour l'ajout ET la modification.
   Le mode est déterminé par la présence de ?id= dans l'URL.
   La liste des catégories proposées s'adapte au type choisi.
   =================================================================== */

function selectType(type) {
  document.getElementById("option-revenu").classList.toggle("selected", type === "revenu");
  document.getElementById("option-depense").classList.toggle("selected", type === "depense");
  document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
}

function initTransactionForm() {
  const id = getQueryParam("id");
  const editing = Boolean(id);

  document.querySelectorAll('input[name="type"]').forEach((radio) => {
    radio.addEventListener("change", (e) => selectType(e.target.value));
  });
  document.getElementById("option-revenu").addEventListener("click", () => selectType("revenu"));
  document.getElementById("option-depense").addEventListener("click", () => selectType("depense"));

  if (editing) {
    const transaction = getTransaction(id);
    if (!transaction) {
      alert("Transaction introuvable.");
      window.location.href = "/transaction-list";
      return;
    }
    document.getElementById("form-eyebrow").textContent = "Modifier";
    document.getElementById("form-title").textContent = "Modifier la transaction";
    document.getElementById("form-breadcrumb").textContent = "Modifier " + transaction.label;
    document.getElementById("transaction-id").value = transaction.id;
    document.getElementById("label").value = transaction.label;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("date").value = transaction.date;
    document.getElementById("note").value = transaction.note || "";

    selectType(transaction.type);
    populateCategorySelect(transaction.type, transaction.categoryId || "");
  } else {
    selectType("depense");
    document.getElementById("date").value = new Date().toISOString().slice(0, 10);
  }

  // document.getElementById("transaction-form").addEventListener("submit", handleSubmit);
}

function validateField(inputId, isValid) {
  const field = document.getElementById(inputId).closest(".field");
  field.classList.toggle("has-error", !isValid);
  return isValid;
}

function handleSubmit(event) {
  event.preventDefault();

  const label = document.getElementById("label").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  const labelValid = validateField("label", label.length > 0);
  const amountValid = validateField("amount", !isNaN(amount) && amount > 0);
  const dateValid = validateField("date", Boolean(date));

  if (!labelValid || !amountValid || !dateValid) return;

  const type = document.querySelector('input[name="type"]:checked')?.value || "depense";

  const transaction = {
    id: document.getElementById("transaction-id").value || null,
    label,
    amount,
    type,
    date,
    categoryId: document.getElementById("category").value || null,
    note: document.getElementById("note").value.trim(),
  };

  saveTransaction(transaction);
  showToast(`Transaction « ${label} » enregistrée.`);
  window.location.href = "/transaction-list";
}

document.addEventListener("DOMContentLoaded", initTransactionForm);
