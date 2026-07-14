/* ===================================================================
   CATEGORY FORM — une seule page pour l'ajout ET la modification.
   Le mode est déterminé par la présence de ?id= dans l'URL.
   =================================================================== */

let selectedIcon = CATEGORY_ICONS[0];
let selectedColor = CATEGORY_COLORS[0];

function renderSwatches() {
  const iconContainer = document.getElementById("icon-swatches");
  iconContainer.innerHTML = CATEGORY_ICONS.map(
    (icon) => `<button type="button" class="icon-swatch ${icon === selectedIcon ? "selected" : ""}" data-icon="${icon}">${icon}</button>`
  ).join("");

  iconContainer.querySelectorAll(".icon-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedIcon = btn.dataset.icon;
      renderSwatches();
    });
  });

  const colorContainer = document.getElementById("color-swatches");
  colorContainer.innerHTML = CATEGORY_COLORS.map(
    (color) => `<button type="button" class="color-swatch ${color === selectedColor ? "selected" : ""}" data-color="${color}" style="background:${color}"></button>`
  ).join("");

  colorContainer.querySelectorAll(".color-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedColor = btn.dataset.color;
      renderSwatches();
    });
  });
}

function selectType(type) {
  document.getElementById("option-revenu").classList.toggle("selected", type === "revenu");
  document.getElementById("option-depense").classList.toggle("selected", type === "depense");
  document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
}

function initCategoryForm() {
  const id = getQueryParam("id");
  const editing = Boolean(id);

  document.querySelectorAll('input[name="type"]').forEach((radio) => {
    radio.addEventListener("change", (e) => selectType(e.target.value));
  });
  document.getElementById("option-revenu").addEventListener("click", () => selectType("revenu"));
  document.getElementById("option-depense").addEventListener("click", () => selectType("depense"));

  if (editing) {
    const category = getCategory(id);
    if (!category) {
      alert("Catégorie introuvable.");
      window.location.href = "categories.html";
      return;
    }
    document.getElementById("form-eyebrow").textContent = "Modifier";
    document.getElementById("form-title").textContent = "Modifier la catégorie";
    document.getElementById("form-breadcrumb").textContent = "Modifier " + category.name;
    document.getElementById("category-id").value = category.id;
    document.getElementById("name").value = category.name;
    document.getElementById("description").value = category.description || "";
    selectedIcon = category.icon;
    selectedColor = category.color;
    selectType(category.type);
  } else {
    selectType("depense");
  }

  renderSwatches();

  document.getElementById("category-form").addEventListener("submit", handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();

  const nameField = document.getElementById("name").closest(".field");
  const name = document.getElementById("name").value.trim();

  if (name.length < 2) {
    nameField.classList.add("has-error");
    document.getElementById("name").focus();
    return;
  }
  nameField.classList.remove("has-error");

  const type = document.querySelector('input[name="type"]:checked')?.value || "depense";

  const category = {
    id: document.getElementById("category-id").value || null,
    name,
    type,
    icon: selectedIcon,
    color: selectedColor,
    description: document.getElementById("description").value.trim(),
  };

  saveCategory(category);
  showToast(`Catégorie « ${name} » enregistrée.`);
  window.location.href = "categories.html";
}

document.addEventListener("DOMContentLoaded", initCategoryForm);
