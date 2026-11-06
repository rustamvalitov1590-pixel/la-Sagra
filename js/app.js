/**
 * La SAGRA — Italian Kitchen & Wine (г. Уральск, ул. Маншук Маметовой, 44, ЖК Central)
 * Интерактивная логика концепции «Palazzo & Fresco»
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    activeZoneId: ARCHITECTURAL_ZONES[0].id,
    activeCategory: 'all',
    menuView: 'grid', // 'grid' | 'list'
    searchQuery: '',
    selectedDishes: new Set(),
    activeGalleryCategory: 'all',
    currentDishId: null
  };

  // DOM-элементы
  const zoneTabsContainer = document.getElementById('zone-tabs-container');
  const zoneShowcase = document.getElementById('zone-showcase');
  const categoryContainer = document.getElementById('category-container');
  const menuGrid = document.getElementById('menu-grid');
  const emptyMenuState = document.getElementById('empty-menu-state');
  const menuSearchInput = document.getElementById('menu-search-input');
  const resetMenuFilterBtn = document.getElementById('reset-menu-filter');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const viewListBtn = document.getElementById('view-list-btn');
  const cartaHoverPreview = document.getElementById('carta-hover-preview');
  const cartaHoverImg = document.getElementById('carta-hover-img');
  const wishlistCounter = document.getElementById('wishlist-counter');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryFilters = document.getElementById('gallery-filters');
  const reviewsGrid = document.getElementById('reviews-grid');

  // Модальные окна
  const dishModal = document.getElementById('dish-modal');
  const reservationModal = document.getElementById('reservation-modal');
  const confirmationModal = document.getElementById('confirmation-modal');
  const lightboxModal = document.getElementById('lightbox-modal');

  // Форматирование цены в тенге
  function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
  }

  // =========================================================================
  // 1. Статус работы ресторана (12:00 – 00:00, кухня до 23:00, UTC+5 Уральск)
  // =========================================================================
  function updateLiveStatus() {
    const statusEl = document.getElementById('live-open-status');
    if (!statusEl) return;
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const uralskHours = (utcHours + 5) % 24;

    if (uralskHours >= 12 && uralskHours < 23) {
      statusEl.textContent = 'Открыто сейчас · 12:00–00:00 (кухня до 23:00)';
    } else if (uralskHours >= 23 && uralskHours < 24) {
      statusEl.textContent = 'Бар открыт до 00:00 · Кухня до 23:00';
    } else {
      statusEl.textContent = 'Откроемся в 12:00 · Онлайн-бронь 24/7';
    }
  }

  // =========================================================================
  // 2. Интерактивный гид по 4 реальным залам (1 и 2 этаж)
  // =========================================================================
  function renderZones() {
    if (!zoneTabsContainer || !zoneShowcase) return;

    zoneTabsContainer.innerHTML = ARCHITECTURAL_ZONES.map((z, idx) => {
      const isActive = z.id === state.activeZoneId;
      return `
        <button type="button" data-zone-id="${z.id}" class="zone-tab-btn ${isActive ? 'active' : ''}">
          <span class="zone-tab-floor font-mono-tech text-[10px] uppercase tracking-widest ${isActive ? 'text-[#C59B5F]' : 'text-[#3A1212]'} mb-1">
            0${idx + 1} · ${z.floor}
          </span>
          <span class="font-serif text-xl font-semibold leading-snug mb-1">${z.name}</span>
          <span class="zone-tab-sub text-xs ${isActive ? 'text-[#C8BEB0]' : 'text-[#52483E]'} line-clamp-1">${z.capacity}</span>
        </button>
      `;
    }).join('');

    zoneTabsContainer.querySelectorAll('[data-zone-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeZoneId = btn.getAttribute('data-zone-id');
        renderZones();
      });
    });

    const activeZone = ARCHITECTURAL_ZONES.find(z => z.id === state.activeZoneId) || ARCHITECTURAL_ZONES[0];
    const zoneSelectValue = `${activeZone.floor} — ${activeZone.name}`;

    zoneShowcase.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Левая часть: Описание зала и кнопка выбора -->
        <div class="lg:col-span-5 space-y-5">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#3A1212] text-[#F5F0E6] font-mono-tech text-[11px] uppercase tracking-wider">
            <span>${activeZone.floor}</span>
            <span>·</span>
            <span>${activeZone.capacity}</span>
          </div>

          <h3 class="font-serif text-3xl sm:text-4xl text-[#181412] leading-tight">${activeZone.name}</h3>
          <p class="font-serif italic text-lg text-[#3A1212]">${activeZone.subtitle}</p>
          <p class="text-sm sm:text-base text-[#52483E] leading-relaxed">${activeZone.atmosphere}</p>

          <div class="pt-2 space-y-2 border-t border-[#181412]/15">
            <p class="font-mono-tech text-[11px] uppercase tracking-wider text-[#52483E]">Особенности посадки:</p>
            <div class="flex flex-wrap gap-2">
              ${activeZone.features.map(f => `
                <span class="px-3 py-1.5 bg-[#F3EFE6] border border-[#181412]/15 text-xs text-[#181412]">${f}</span>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 flex flex-wrap gap-3">
            <button type="button" data-book-specific-zone="${zoneSelectValue}" class="btn-bordeaux">
              <span>Забронировать стол в этом зале</span>
            </button>
            <a href="#gallery" class="btn-outline-dark">
              <span>Все фото интерьера</span>
            </a>
          </div>
        </div>

        <!-- Правая часть: 3 реальных фото этой зоны из 2ГИС -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div class="sm:col-span-7 aspect-[4/5] overflow-hidden border border-[#181412]/20 relative group cursor-pointer" data-open-photo="${activeZone.mainPhoto}" data-photo-title="${activeZone.name}" data-photo-sub="${activeZone.subtitle}">
            <img src="${activeZone.mainPhoto}" alt="${activeZone.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <span class="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-[#181412]/85 text-[#F5F0E6] font-mono-tech text-[10px]">
              ${activeZone.floor} · Главный ракурс
            </span>
          </div>
          <div class="sm:col-span-5 flex flex-col gap-4">
            <div class="aspect-[4/3] overflow-hidden border border-[#181412]/20 relative group cursor-pointer" data-open-photo="${activeZone.secondaryPhoto}" data-photo-title="${activeZone.name}" data-photo-sub="${activeZone.atmosphere}">
              <img src="${activeZone.secondaryPhoto}" alt="${activeZone.name} ракурс 2" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="aspect-[4/3] overflow-hidden border border-[#181412]/20 relative group cursor-pointer" data-open-photo="${activeZone.detailPhoto}" data-photo-title="${activeZone.name}" data-photo-sub="${activeZone.subtitle}">
              <img src="${activeZone.detailPhoto}" alt="${activeZone.name} деталь" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <span class="absolute bottom-2 right-2 px-2 py-0.5 bg-[#181412]/80 text-[#C59B5F] font-mono-tech text-[10px]">
                Увеличить фото ↗
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Клик по кнопке бронирования конкретного зала
    zoneShowcase.querySelectorAll('[data-book-specific-zone]').forEach(btn => {
      btn.addEventListener('click', () => {
        const zoneName = btn.getAttribute('data-book-specific-zone');
        openReservationModal({ zone: zoneName });
      });
    });

    // Клик по фотографиям зоны для открытия в лайтбоксе
    zoneShowcase.querySelectorAll('[data-open-photo]').forEach(el => {
      el.addEventListener('click', () => {
        openLightbox({
          image: el.getAttribute('data-open-photo'),
          zoneLabel: activeZone.floor,
          title: el.getAttribute('data-photo-title'),
          subtitle: el.getAttribute('data-photo-sub')
        });
      });
    });
  }

  // =========================================================================
  // 3. Иллюстрированное меню La Carta Illustrata
  // =========================================================================
  function renderCategories() {
    if (!categoryContainer) return;
    categoryContainer.innerHTML = MENU_CATEGORIES.map(cat => {
      const isActive = cat.id === state.activeCategory;
      const count = cat.id === 'all'
        ? MENU_ITEMS.length
        : MENU_ITEMS.filter(i => i.category === cat.id).length;
      return `
        <button type="button" data-cat-id="${cat.id}" class="category-pill ${isActive ? 'active' : ''}">
          <span>${cat.name}</span>
          <span class="ml-1.5 opacity-60 font-mono-tech text-[11px]">(${count})</span>
        </button>
      `;
    }).join('');

    categoryContainer.querySelectorAll('[data-cat-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.getAttribute('data-cat-id');
        renderCategories();
        renderMenu();
      });
    });
  }

  function getFilteredMenuItems() {
    return MENU_ITEMS.filter(item => {
      const matchesCat = state.activeCategory === 'all' || item.category === state.activeCategory;
      if (!matchesCat) return false;
      if (!state.searchQuery.trim()) return true;
      const q = state.searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.titleIt.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.termExplain && item.termExplain.toLowerCase().includes(q)) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    });
  }

  function renderMenu() {
    if (!menuGrid) return;
    const items = getFilteredMenuItems();

    if (items.length === 0) {
      menuGrid.classList.add('hidden');
      if (emptyMenuState) emptyMenuState.classList.remove('hidden');
      return;
    }

    menuGrid.classList.remove('hidden');
    if (emptyMenuState) emptyMenuState.classList.add('hidden');

    if (state.menuView === 'grid') {
      menuGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      menuGrid.innerHTML = items.map(dish => {
        const isSelected = state.selectedDishes.has(dish.id);
        return `
          <article class="dish-card ceramic-rim-top justify-between" data-dish-card="${dish.id}">
            <div>
              <div class="dish-img-wrap cursor-pointer" data-open-dish="${dish.id}">
                <img src="${dish.image}" alt="${dish.title}" loading="lazy">
                ${dish.note ? `<span class="absolute top-3 left-3 px-2.5 py-1 bg-[#181412]/85 text-[#F5F0E6] font-mono-tech text-[10px] uppercase tracking-wider">${dish.note}</span>` : ''}
                <span class="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#FAF7F2]/95 text-[#181412] font-mono-tech text-[11px]">
                  ${dish.weight}
                </span>
              </div>

              <div class="p-5 sm:p-6 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-serif italic text-sm text-[#3A1212]">${dish.titleIt}</p>
                    <h3 class="font-serif text-2xl font-semibold text-[#181412] leading-snug cursor-pointer hover:text-[#3A1212] transition-colors" data-open-dish="${dish.id}">
                      ${dish.title}
                    </h3>
                  </div>
                  <div class="font-serif text-2xl font-semibold text-[#3A1212] tabular-nums whitespace-nowrap">
                    ${formatPrice(dish.price)}
                  </div>
                </div>

                ${dish.termExplain ? `
                  <div class="term-glossary-box">
                    <strong class="text-[#1E3F66] font-semibold">Справка:</strong> ${dish.termExplain}
                  </div>
                ` : ''}

                <p class="text-xs sm:text-sm text-[#52483E] leading-relaxed line-clamp-3">
                  ${dish.description}
                </p>
              </div>
            </div>

            <div class="px-5 sm:px-6 py-4 border-t border-[#181412]/10 bg-[#F3EFE6]/50 flex items-center justify-between gap-3">
              <button type="button" data-open-dish="${dish.id}" class="font-mono-tech text-[11px] uppercase tracking-wider text-[#52483E] hover:text-[#181412] underline underline-offset-4">
                Состав и вино
              </button>

              <button type="button" data-toggle-wish="${dish.id}" class="px-3.5 py-2 font-mono-tech text-[11px] uppercase tracking-wider border transition-colors ${
                isSelected
                  ? 'bg-[#3A1212] text-[#F5F0E6] border-[#3A1212]'
                  : 'bg-[#FAF7F2] text-[#181412] border-[#181412]/25 hover:border-[#3A1212]'
              }">
                ${isSelected ? '✓ В предзаказе' : '+ В предзаказ'}
              </button>
            </div>
          </article>
        `;
      }).join('');
    } else {
      // Печатный режим La Carta
      menuGrid.className = 'bg-[#FAF7F2] border border-[#181412]/20 p-4 sm:p-8 divide-y divide-[#181412]/10';
      menuGrid.innerHTML = items.map(dish => {
        const isSelected = state.selectedDishes.has(dish.id);
        return `
          <div class="carta-row" data-dish-row="${dish.id}" data-preview-img="${dish.image}">
            <div class="flex-1 pr-4" data-open-dish="${dish.id}">
              <div class="flex items-baseline gap-2">
                <h3 class="font-serif text-xl sm:text-2xl font-semibold text-[#181412]">${dish.title}</h3>
                <span class="font-serif italic text-sm text-[#3A1212]">(${dish.titleIt})</span>
              </div>
              <p class="text-xs text-[#52483E] mt-1">${dish.description}</p>
              ${dish.termExplain ? `<p class="text-[11px] text-[#1E3F66] mt-1 italic">${dish.termExplain}</p>` : ''}
            </div>

            <div class="flex items-center gap-4 self-end md:self-center">
              <span class="font-mono-tech text-xs text-[#7D7165] tabular-nums">${dish.weight}</span>
              <span class="font-serif text-2xl font-semibold text-[#3A1212] tabular-nums whitespace-nowrap">${formatPrice(dish.price)}</span>
              <button type="button" data-toggle-wish="${dish.id}" class="px-3 py-1.5 font-mono-tech text-[11px] uppercase tracking-wider border ${
                isSelected
                  ? 'bg-[#3A1212] text-[#F5F0E6] border-[#3A1212]'
                  : 'bg-white text-[#181412] border-[#181412]/25 hover:border-[#3A1212]'
              }">
                ${isSelected ? '✓ Выбрано' : '+ Заказать'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Наведение курсора для превью фото в режиме печатного листа
      menuGrid.querySelectorAll('[data-dish-row]').forEach(row => {
        row.addEventListener('mouseenter', () => {
          const imgUrl = row.getAttribute('data-preview-img');
          if (cartaHoverImg && cartaHoverPreview && imgUrl) {
            cartaHoverImg.src = imgUrl;
            cartaHoverPreview.classList.add('visible');
          }
        });
        row.addEventListener('mousemove', (e) => {
          if (cartaHoverPreview) {
            cartaHoverPreview.style.left = `${e.clientX + 24}px`;
            cartaHoverPreview.style.top = `${Math.max(20, e.clientY - 90)}px`;
          }
        });
        row.addEventListener('mouseleave', () => {
          if (cartaHoverPreview) cartaHoverPreview.classList.remove('visible');
        });
      });
    }

    // Обработчики открытия модалки блюда и добавления в предзаказ
    menuGrid.querySelectorAll('[data-open-dish]').forEach(el => {
      el.addEventListener('click', () => {
        openDishModal(el.getAttribute('data-open-dish'));
      });
    });

    menuGrid.querySelectorAll('[data-toggle-wish]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDishWish(btn.getAttribute('data-toggle-wish'));
      });
    });
  }

  function toggleDishWish(dishId) {
    if (state.selectedDishes.has(dishId)) {
      state.selectedDishes.delete(dishId);
    } else {
      state.selectedDishes.add(dishId);
    }
    updateWishlistUI();
    renderMenu();
  }

  function updateWishlistUI() {
    const count = state.selectedDishes.size;
    if (wishlistCounter) {
      wishlistCounter.textContent = count.toString();
    }

    const selectedItems = MENU_ITEMS.filter(d => state.selectedDishes.has(d.id));
    const totalSum = selectedItems.reduce((acc, d) => acc + d.price, 0);

    const inlineList = document.getElementById('inline-selected-dishes-list');
    const modalList = document.getElementById('modal-selected-dishes-list');

    if (selectedItems.length === 0) {
      const emptyHtml = 'Блюда еще не выбраны. Отметьте позиции в меню выше, чтобы мы приготовили их к вашему приходу или доставили.';
      if (inlineList) inlineList.innerHTML = emptyHtml;
      if (modalList) modalList.innerHTML = 'Не выбраны (можно добавить в разделе Меню)';
      return;
    }

    const pillsHtml = `
      <div class="flex flex-wrap gap-1.5 mb-2">
        ${selectedItems.map(item => `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF7F2] border border-[#181412]/20 text-xs text-[#181412]">
            <span>${item.title} (${formatPrice(item.price)})</span>
            <button type="button" data-remove-wish="${item.id}" class="text-[#3A1212] font-bold hover:opacity-70" title="Удалить">×</button>
          </span>
        `).join('')}
      </div>
      <div class="font-mono-tech text-xs text-[#3A1212] font-semibold">
        Итого по предзаказу: ${formatPrice(totalSum)} (${selectedItems.length} поз.)
      </div>
    `;

    if (inlineList) inlineList.innerHTML = pillsHtml;
    if (modalList) modalList.innerHTML = pillsHtml;

    document.querySelectorAll('[data-remove-wish]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleDishWish(btn.getAttribute('data-remove-wish'));
      });
    });
  }

  // =========================================================================
  // 4. Модальное окно карточки блюда
  // =========================================================================
  function openDishModal(dishId) {
    const dish = MENU_ITEMS.find(d => d.id === dishId);
    if (!dish || !dishModal) return;
    state.currentDishId = dish.id;

    document.getElementById('modal-dish-image').src = dish.image;
    document.getElementById('modal-dish-image').alt = dish.title;
    document.getElementById('modal-dish-note').textContent = dish.note || 'La SAGRA';
    document.getElementById('modal-dish-title-it').textContent = dish.titleIt;
    document.getElementById('modal-dish-title').textContent = dish.title;
    document.getElementById('modal-dish-price').textContent = formatPrice(dish.price);
    document.getElementById('modal-dish-meta').textContent = `${dish.weight} · ${dish.calories}`;
    document.getElementById('modal-dish-desc').textContent = dish.description;
    document.getElementById('modal-dish-wine').textContent = dish.winePairing;

    const termBox = document.getElementById('modal-dish-term-box');
    if (termBox) {
      if (dish.termExplain) {
        termBox.classList.remove('hidden');
        termBox.innerHTML = `<strong class="text-[#1E3F66]">Гастрономическая справка:</strong> ${dish.termExplain}`;
      } else {
        termBox.classList.add('hidden');
      }
    }

    const ingContainer = document.getElementById('modal-dish-ingredients');
    if (ingContainer) {
      ingContainer.innerHTML = dish.ingredients.map(ing => `
        <span class="px-2.5 py-1 bg-[#F3EFE6] border border-[#181412]/15 text-xs text-[#181412]">${ing}</span>
      `).join('');
    }

    const addBtn = document.getElementById('modal-dish-add-btn');
    if (addBtn) {
      const isSelected = state.selectedDishes.has(dish.id);
      addBtn.textContent = isSelected ? '✓ Уже в предзаказе (убрать)' : '+ Добавить в предзаказ / доставку';
      addBtn.onclick = () => {
        toggleDishWish(dish.id);
        openDishModal(dish.id);
      };
    }

    const bookNowBtn = document.getElementById('modal-dish-book-now');
    if (bookNowBtn) {
      bookNowBtn.onclick = () => {
        if (!state.selectedDishes.has(dish.id)) {
          toggleDishWish(dish.id);
        }
        closeModal(dishModal);
        openReservationModal();
      };
    }

    dishModal.classList.remove('hidden');
    dishModal.classList.add('flex');
  }

  // =========================================================================
  // 5. Архив реальных фотографий 2ГИС и Лайтбокс
  // =========================================================================
  function renderGallery() {
    if (!galleryGrid) return;
    const filtered = state.activeGalleryCategory === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter(g => g.category === state.activeGalleryCategory);

    galleryGrid.innerHTML = filtered.map((item, idx) => {
      const colSpan = idx === 0 || idx === 3
        ? 'md:col-span-7 aspect-[16/11]'
        : idx === 1 || idx === 2
        ? 'md:col-span-5 aspect-[4/3]'
        : 'md:col-span-4 aspect-[4/3]';

      return `
        <figure class="gallery-item ${colSpan} group" data-gallery-idx="${item.id}">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E1822]/95 via-[#0E1822]/50 to-transparent p-5 pt-12">
            <span class="font-mono-tech text-[10px] uppercase tracking-widest text-[#C59B5F] block mb-1">${item.zoneLabel}</span>
            <h3 class="font-serif text-xl sm:text-2xl text-[#F5F0E6] leading-snug">${item.title}</h3>
            <p class="text-xs text-[#C8BEB0] mt-1 line-clamp-2">${item.subtitle}</p>
          </figcaption>
        </figure>
      `;
    }).join('');

    galleryGrid.querySelectorAll('[data-gallery-idx]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-gallery-idx');
        const item = GALLERY_ITEMS.find(g => g.id === id);
        if (item) openLightbox(item);
      });
    });
  }

  function openLightbox(item) {
    if (!lightboxModal) return;
    document.getElementById('lightbox-image').src = item.image;
    document.getElementById('lightbox-image').alt = item.title;
    document.getElementById('lightbox-zone').textContent = item.zoneLabel || 'La SAGRA · 2ГИС';
    document.getElementById('lightbox-title').textContent = item.title;
    document.getElementById('lightbox-subtitle').textContent = item.subtitle || '';
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  }

  // =========================================================================
  // 6. Реальные отзывы гостей из 2ГИС
  // =========================================================================
  function renderReviews() {
    if (!reviewsGrid) return;
    reviewsGrid.innerHTML = REVIEWS_DATA.map(rev => `
      <article class="bg-[#FAF7F2] border border-[#181412]/15 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#181412]/10">
            <div>
              <h3 class="font-serif text-2xl font-semibold text-[#181412]">${rev.author}</h3>
              <p class="font-mono-tech text-[11px] text-[#52483E]">${rev.date}</p>
            </div>
            <span class="px-2.5 py-1 bg-[#3A1212] text-[#F5F0E6] font-mono-tech text-xs">
              5.0 ★
            </span>
          </div>

          <p class="text-sm sm:text-base text-[#181412] leading-relaxed mb-5">
            «${rev.text}»
          </p>
        </div>

        <div class="pt-3 border-t border-[#181412]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
          <span class="text-[#3A1212] font-medium">${rev.tag}</span>
          <span class="text-[#52483E]">${rev.staffMention}</span>
        </div>
      </article>
    `).join('');
  }

  // =========================================================================
  // 7. Бронирование стола, предзаказ и отправка в WhatsApp (+7 778 455-13-42)
  // =========================================================================
  function initBookingDates() {
    const today = new Date().toISOString().split('T')[0];
    ['booking-date', 'modal-booking-date'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.min = today;
        input.value = today;
      }
    });
  }

  function openReservationModal(prefill = {}) {
    if (!reservationModal) return;
    if (prefill.zone) {
      const zoneSel = document.getElementById('modal-booking-zone');
      if (zoneSel) zoneSel.value = prefill.zone;
      const inlineZoneSel = document.getElementById('booking-zone');
      if (inlineZoneSel) inlineZoneSel.value = prefill.zone;
    }
    if (prefill.time) {
      const timeSel = document.getElementById('modal-booking-time');
      if (timeSel) timeSel.value = prefill.time;
      const inlineTimeSel = document.getElementById('booking-time');
      if (inlineTimeSel) inlineTimeSel.value = prefill.time;
    }
    reservationModal.classList.remove('hidden');
    reservationModal.classList.add('flex');
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('hidden');
    modalEl.classList.remove('flex');
  }

  function handleBookingSubmit(formEl) {
    const formData = new FormData(formEl);
    const visitType = formData.get('visitType') || 'Резерв стола в ресторане';
    const name = (formData.get('name') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const date = (formData.get('date') || '').toString();
    const time = (formData.get('time') || '19:30').toString();
    const guests = (formData.get('guests') || '2 персоны').toString();
    const zone = (formData.get('zone') || '1 этаж — Зал под кирпичными сводами').toString();
    const notes = (formData.get('notes') || '').toString().trim();

    const code = 'LS-' + Math.floor(1000 + Math.random() * 9000);
    const selectedItems = MENU_ITEMS.filter(d => state.selectedDishes.has(d.id));
    const totalSum = selectedItems.reduce((acc, d) => acc + d.price, 0);

    const dishesText = selectedItems.length > 0
      ? selectedItems.map(d => `• ${d.title} (${formatPrice(d.price)})`).join('\n') + `\nСумма предзаказа: ${formatPrice(totalSum)}`
      : 'Выбор по меню в ресторане';

    const waLines = [
      `Здравствуйте, La SAGRA!`,
      `Заявка № ${code} (${visitType})`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Дата и время: ${date} в ${time}`,
      `Гостей: ${guests}`,
      `Зал: ${zone}`,
      selectedItems.length > 0 ? `\nПредзаказ блюд ко времени:\n${dishesText}` : '',
      notes ? `\nПожелания: ${notes}` : ''
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/77784551342?text=${encodeURIComponent(waLines)}`;

    const confirmCodeEl = document.getElementById('confirm-code');
    const confirmDetailsEl = document.getElementById('confirm-details');
    const confirmWaLink = document.getElementById('confirm-whatsapp-link');

    if (confirmCodeEl) confirmCodeEl.textContent = code;
    if (confirmWaLink) confirmWaLink.href = waUrl;
    if (confirmDetailsEl) {
      confirmDetailsEl.innerHTML = `
        <div class="flex justify-between py-1 border-b border-[#181412]/10"><span class="text-[#52483E]">Формат:</span><strong class="text-right">${visitType}</strong></div>
        <div class="flex justify-between py-1 border-b border-[#181412]/10"><span class="text-[#52483E]">Гость:</span><strong>${name} (${phone})</strong></div>
        <div class="flex justify-between py-1 border-b border-[#181412]/10"><span class="text-[#52483E]">Дата и время:</span><strong class="font-mono-tech">${date} · ${time}</strong></div>
        <div class="flex justify-between py-1 border-b border-[#181412]/10"><span class="text-[#52483E]">Персон:</span><strong>${guests}</strong></div>
        <div class="flex justify-between py-1 border-b border-[#181412]/10"><span class="text-[#52483E]">Зал:</span><strong class="text-right">${zone}</strong></div>
        ${selectedItems.length > 0 ? `<div class="pt-2"><span class="text-[#3A1212] font-semibold block mb-1">Предзаказ (${formatPrice(totalSum)}):</span><p class="text-xs text-[#52483E]">${selectedItems.map(d => d.title).join(', ')}</p></div>` : ''}
      `;
    }

    closeModal(reservationModal);
    if (confirmationModal) {
      confirmationModal.classList.remove('hidden');
      confirmationModal.classList.add('flex');
    }
  }

  // =========================================================================
  // 8. Карта Leaflet (ЖК Central, ул. Маншук Маметовой, 44)
  // =========================================================================
  function initMap() {
    const mapEl = document.getElementById('restaurant-map');
    if (!mapEl || typeof L === 'undefined') return;

    const coords = RESTAURANT_INFO.coords;
    const map = L.map('restaurant-map', {
      scrollWheelZoom: false
    }).setView(coords, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="width:28px;height:28px;background:#3A1212;border:2px solid #C59B5F;border-radius:50%;box-shadow:0 4px 14px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:#F5F0E6;font-family:serif;font-style:italic;font-size:13px;">La</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker(coords, { icon: pinIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px;">
          <strong style="font-size:14px;color:#3A1212;">La SAGRA — Italian Kitchen &amp; Wine</strong><br>
          <span style="font-size:12px;color:#181412;">ул. Маншук Маметовой, 44 (ЖК Central)</span><br>
          <span style="font-size:11px;color:#52483E;">Ежедневно 12:00 – 00:00 · +7 (778) 455-13-42</span>
        </div>
      `)
      .openPopup();
  }

  // =========================================================================
  // 9. События интерфейса и скролл-анимация
  // =========================================================================
  function bindEvents() {
    // Переключение вида меню (Фото-карточки / Печатный лист)
    if (viewGridBtn && viewListBtn) {
      viewGridBtn.addEventListener('click', () => {
        state.menuView = 'grid';
        viewGridBtn.className = 'px-3.5 py-2 text-xs font-mono-tech uppercase tracking-wider bg-[#3A1212] text-[#F5F0E6] transition-colors';
        viewListBtn.className = 'px-3.5 py-2 text-xs font-mono-tech uppercase tracking-wider text-[#52483E] hover:text-[#181412] transition-colors';
        renderMenu();
      });
      viewListBtn.addEventListener('click', () => {
        state.menuView = 'list';
        viewListBtn.className = 'px-3.5 py-2 text-xs font-mono-tech uppercase tracking-wider bg-[#3A1212] text-[#F5F0E6] transition-colors';
        viewGridBtn.className = 'px-3.5 py-2 text-xs font-mono-tech uppercase tracking-wider text-[#52483E] hover:text-[#181412] transition-colors';
        renderMenu();
      });
    }

    // Поиск по меню
    if (menuSearchInput) {
      menuSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMenu();
      });
    }

    if (resetMenuFilterBtn) {
      resetMenuFilterBtn.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        if (menuSearchInput) menuSearchInput.value = '';
        renderCategories();
        renderMenu();
      });
    }

    // Фильтры фотогалереи 2ГИС
    if (galleryFilters) {
      galleryFilters.querySelectorAll('[data-gallery-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.activeGalleryCategory = btn.getAttribute('data-gallery-cat');
          galleryFilters.querySelectorAll('[data-gallery-cat]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderGallery();
        });
      });
    }

    // Открытие модалки бронирования
    document.querySelectorAll('[data-open-booking]').forEach(btn => {
      btn.addEventListener('click', () => openReservationModal());
    });

    const headerWishBtn = document.getElementById('header-wishlist-btn');
    if (headerWishBtn) {
      headerWishBtn.addEventListener('click', () => openReservationModal());
    }

    // Быстрый выбор зала и времени в первом экране
    document.querySelectorAll('[data-quick-zone]').forEach(btn => {
      btn.addEventListener('click', () => {
        openReservationModal({ zone: btn.getAttribute('data-quick-zone') });
      });
    });

    document.querySelectorAll('[data-quick-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        openReservationModal({ time: btn.getAttribute('data-quick-time') });
      });
    });

    // Закрытие модальных окон
    const closeDishBtn = document.getElementById('close-dish-modal');
    if (closeDishBtn) closeDishBtn.addEventListener('click', () => closeModal(dishModal));

    const closeResBtn = document.getElementById('close-reservation-modal');
    if (closeResBtn) closeResBtn.addEventListener('click', () => closeModal(reservationModal));

    const closeConfBtn = document.getElementById('close-confirmation-modal');
    if (closeConfBtn) closeConfBtn.addEventListener('click', () => closeModal(confirmationModal));

    const closeLbBtn = document.getElementById('close-lightbox');
    if (closeLbBtn) closeLbBtn.addEventListener('click', () => closeModal(lightboxModal));

    [dishModal, reservationModal, confirmationModal, lightboxModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        [dishModal, reservationModal, confirmationModal, lightboxModal].forEach(closeModal);
      }
    });

    // Отправка форм бронирования
    const inlineForm = document.getElementById('inline-booking-form');
    if (inlineForm) {
      inlineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmit(inlineForm);
      });
    }

    const modalForm = document.getElementById('modal-booking-form');
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmit(modalForm);
      });
    }

    // Мобильное меню
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileClose = document.getElementById('mobile-menu-close');
    const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => mobileDrawer.classList.remove('hidden'));
    }
    [mobileClose, mobileBackdrop].forEach(el => {
      if (el && mobileDrawer) {
        el.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
      }
    });
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
      });
    });

    // Скролл шапки и плавное появление секций
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
      if (!header) return;
      if (window.scrollY > 30) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Запуск
  updateLiveStatus();
  initBookingDates();
  renderZones();
  renderCategories();
  renderMenu();
  renderGallery();
  renderReviews();
  updateWishlistUI();
  bindEvents();
  initMap();
});
