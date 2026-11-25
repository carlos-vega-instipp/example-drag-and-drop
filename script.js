// ===================================
// 1. SELECCIONAR ELEMENTOS DEL DOM
// ===================================

const cards = document.querySelectorAll(".card");

console.log(cards);
console.log(...cards);
console.log([...cards]);

const zones = document.querySelectorAll(".dropzone");

// ===================================
// 2. EVENTOS DE LAS TARJETAS
// ===================================

cards.forEach((card) => {
  card.addEventListener("dragstart", handleDragStart);

  card.addEventListener("dragend", handleDragEnd);
});

// ===================================
// 3. EVENTOS DE LAS ZONAS
// ===================================

zones.forEach((zone) => {
  zone.addEventListener("dragover", handleDragOver);

  zone.addEventListener("dragleave", handleDragLeave);

  zone.addEventListener("drop", handleDrop);
});

// ===================================
// 4. INICIAR EL ARRASTRE
// ===================================

function handleDragStart(event) {
  const card = event.currentTarget;

  event.dataTransfer.setData("text/plain", card.dataset.id);

  event.dataTransfer.effectAllowed = "move";

  requestAnimationFrame(() => {
    card.classList.add("dragging");
  });
}

// ===================================
// 5. ARRASTRAR SOBRE UNA ZONA
// ===================================

function handleDragOver(event) {
  event.preventDefault();

  event.dataTransfer.dropEffect = "move";

  event.currentTarget.classList.add("is-over");
}

// ===================================
// 6. ABANDONAR UNA ZONA
// ===================================

function handleDragLeave(event) {
  const zone = event.currentTarget;

  if (!zone.contains(event.relatedTarget)) {
    clearZone(zone);
  }
}

// ===================================
// 7. SOLTAR UNA TARJETA
// ===================================

function handleDrop(event) {
  event.preventDefault();

  const zone = event.currentTarget;

  const id = event.dataTransfer.getData("text/plain");

  const card = [...cards].find((c) => c.dataset.id === id);

  if (card) {
    const afterCard = getCardAfterPointer(zone, event);

    if (afterCard) {
      zone.insertBefore(card, afterCard);
    } else {
      zone.appendChild(card);
    }
  }

  clearZone(zone);
}

// ===================================
// 8. FINALIZAR EL ARRASTRE
// ===================================

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");

  zones.forEach(clearZone);
}

// ===================================
// 9. LIMPIAR LOS ESTILOS DE UNA ZONA
// ===================================

function clearZone(zone) {
  zone.classList.remove("is-over");
}

// ===================================
// 10. CALCULAR LA POSICION DE INSERCION
// ===================================

function getCardAfterPointer(zone, event) {
  const cards = zone.querySelectorAll(".card:not(.dragging)");

  const x = event.clientX;

  const y = event.clientY;

  for (const card of cards) {
    const box = card.getBoundingClientRect();

    const centerX = box.left + box.width / 2;

    const cursorAbove = y < box.top;

    const cursorBefore = y <= box.bottom && x < centerX;

    if (cursorAbove || cursorBefore) {
      return card;
    }
  }

  return null;
}
