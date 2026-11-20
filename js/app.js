/**
 * La SAGRA — Italian Kitchen & Wine (г. Уральск, ул. Маншук Маметовой, 44, ЖК Central)
 * Воздушная итальянская эстетика, плавная режиссура скролла, умная шапка и виджет 2ГИС
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    activeCategory: 'all',
    menuView: 'grid', // 'grid' | 'list'
    searchQuery: '',
    selectedDishes: new Set(),
    activeGalleryCategory: 'all',
    currentDishId: null
  };

  // DOM-элементы
  const walkStepsNav = document.getElementById('walk-steps-nav');
  const zonesHorizontalRail = document.getElementById('zones-horizontal-rail');
  const zonesWalkTrack = document.getElementById('zones-walk-track');

  const categoryContainer = document.getElementById('category-container');
  const menuGrid = document.getElementById('menu-grid');
  const emptyMenuState = document.getElementById('empty-menu-state');
  const menuSearchInput = document.getElementById('menu-search-input');
  const resetMenuFilterBtn = document.getElementById('reset-menu-filter');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const viewListBtn = document.getElementById('view-list-btn');
  const cartaHoverPreview = document.getElementById('carta-hover-preview');
  const cartaHoverImg = document.getElementById('carta-hover-img');

  const headerWishlistBtn = document.getElementById('header-wishlist-btn');
  const wishlistCounter = document.getElementById('wishlist-counter');
  const floatingTray = document.getElementById('floating-dinner-tray');
  const trayCountBadge = document.getElementById('tray-count-badge');
  const trayTotalText = document.getElementById('tray-total-text');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  const galleryGrid = document.getElementById('gallery-grid');
  const galleryFilters = document.getElementById('gallery-filters');
  const reviewsGrid = document.getElementById('reviews-grid');

  // Модальные окна
  const dishModal = document.getElementById('dish-modal');
  const reservationModal = document.getElementById('reservation-modal');
  const confirmationModal = document.getElementById('confirmation-modal');
  const lightboxModal = document.getElementById('lightbox-modal');

  function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
  }

  // =========================================================================
  // 1. Статус работы ресторана (UTC+5 Уральск)
  // =========================================================================
  function updateLiveStatus() {
    const statusEl = document.getElementById('live-open-status');
    if (!statusEl) return;
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const uralskHours = (utcHours + 5) % 24;

    if (uralskHours >= 12 && uralskHours < 23) {
      statusEl.textContent = 'Открыто до 00:00 · Кухня до 23:00';
    } else if (uralskHours >= 23 && uralskHours < 24) {
      statusEl.textContent = 'Бар открыт до 00:00';
    } else {
      statusEl.textContent = 'Ежедневно 12:00 – 00:00';
    }
  }

  // =========================================================================
  // 2. ЭФФЕКТ №1: ВХОД ЧЕРЕЗ РАСШИРЯЮЩУЮСЯ РИМСКУЮ АРКУ (БЕЗ НАЛОЖЕНИЯ ТЕКСТА)
  // =========================================================================
  const heroTrack = document.getElementById('hero-portal-track');
  const portalArchMask = document.getElementById('portal-arch-mask');
  const portalArchImg = document.getElementById('portal-arch-inner-img');
  const portalWordLeft = document.getElementById('portal-word-left');
  const portalWordRight = document.getElementById('portal-word-right');
  const portalInsideContent = document.getElementById('portal-inside-content');
  const portalTopCaption = document.getElementById('portal-top-caption');
  const portalScrollHint = document.getElementById('portal-scroll-hint');

  function updatePortalOnScroll() {
    if (!heroTrack || !portalArchMask) return;
    const rect = heroTrack.getBoundingClientRect();
    const scrollable = Math.max(1, heroTrack.offsetHeight - window.innerHeight);
    const rawProgress = -rect.top / scrollable;
    const p = Math.min(1, Math.max(0, rawProgress));

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startW = Math.min(320, vw * 0.74);
    const startH = Math.min(430, vh * 0.52);
    const startMarginTop = 40; // 2.5rem отступ вниз на старте, чтобы не задевать верхний текст

    const expandP = Math.min(1, p / 0.76);
    const eased = 1 - Math.pow(1 - expandP, 2.4);

    const curW = startW + (vw - startW) * eased;
    const curH = startH + (vh - startH) * eased;
    const curMarginTop = startMarginTop * (1 - eased);
    const topRadius = Math.round(250 * (1 - eased));
    const bottomRadius = Math.round(28 * (1 - eased));

    portalArchMask.style.width = `${curW}px`;
    portalArchMask.style.height = `${curH}px`;
    portalArchMask.style.marginTop = `${curMarginTop.toFixed(1)}px`;
    portalArchMask.style.borderRadius = `${topRadius}px ${topRadius}px ${bottomRadius}px ${bottomRadius}px`;

    if (portalArchImg) {
      const imgScale = 1.15 - 0.15 * eased;
      portalArchImg.style.transform = `scale(${imgScale.toFixed(3)})`;
    }

    const shiftX = eased * Math.min(340, vw * 0.28);
    const fadeOut = Math.max(0, 1 - eased * 1.6);

    if (portalWordLeft) {
      portalWordLeft.style.transform = `translate3d(-${shiftX}px, -50%, 0)`;
      portalWordLeft.style.opacity = fadeOut.toFixed(2);
    }
    if (portalWordRight) {
      portalWordRight.style.transform = `translate3d(${shiftX}px, -50%, 0)`;
      portalWordRight.style.opacity = fadeOut.toFixed(2);
    }
    if (portalTopCaption) {
      portalTopCaption.style.opacity = fadeOut.toFixed(2);
      portalTopCaption.style.transform = `translate3d(-50%, -${(eased * 28).toFixed(1)}px, 0)`;
    }
    if (portalScrollHint) {
      portalScrollHint.style.opacity = fadeOut.toFixed(2);
    }

    if (portalInsideContent) {
      if (eased >= 0.56) {
        portalInsideContent.classList.add('revealed');
      } else {
        portalInsideContent.classList.remove('revealed');
      }
    }
  }

  // =========================================================================
  // 3. ЭФФЕКТ №2: ГОРИЗОНТАЛЬНАЯ ПРОГУЛКА ПО 4 ЗАЛАМ + ШИРОКИЕ 2-СТРОЧНЫЕ ТАБЫ
  // =========================================================================
  const ITALIAN_WATERMARKS = [
    'Le Volte',
    'Il Camino',
    'Il Forno',
    'La Galleria'
  ];

  function renderHorizontalZonesWalk() {
    if (!zonesHorizontalRail) return;

    // Широкие табы строго в 2 строки
    if (walkStepsNav) {
      walkStepsNav.innerHTML = ARCHITECTURAL_ZONES.map((z, idx) => `
        <button type="button" data-walk-step="${idx}" class="walk-step-btn ${idx === 0 ? 'active' : ''}">
          <span class="walk-step-line1">${z.floor} · ${z.capacity}</span>
          <span class="walk-step-line2">${z.name}</span>
        </button>
      `).join('');
    }

    zonesHorizontalRail.innerHTML = ARCHITECTURAL_ZONES.map((z, idx) => {
      const zoneSelectValue = `${z.floor} — ${z.name}`;
      return `
        <article class="zone-walk-panel" data-zone-panel="${idx}">
          <div class="zone-bg-watermark" data-zone-watermark="${idx}">
            ${ITALIAN_WATERMARKS[idx] || z.name}
          </div>

          <div class="max-w-[1340px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
            
            <div class="lg:col-span-5 space-y-5">
              <div class="inline-flex items-center gap-3 text-sm text-[#3A1212]">
                <span class="font-serif italic text-xl">${z.floor}</span>
                <span class="text-[#181412]/25">·</span>
                <span class="text-[#564C42]">${z.capacity}</span>
              </div>

              <h3 class="font-serif text-4xl sm:text-5xl text-[#181412] leading-[1.06]">
                ${z.name}
              </h3>

              <p class="font-serif italic text-xl text-[#3A1212]">
                ${z.subtitle}
              </p>

              <p class="text-base text-[#564C42] leading-relaxed">
                ${z.atmosphere}
              </p>

              <div class="flex flex-wrap gap-2 pt-1">
                ${z.features.map(f => `
                  <span class="px-4 py-1.5 rounded-full bg-[#FAF7F2] text-xs text-[#564C42] shadow-sm">${f}</span>
                `).join('')}
              </div>

              <div class="pt-3">
                <button type="button" data-book-specific-zone="${zoneSelectValue}" class="btn-bordeaux">
                  <span>Выбрать стол в этом зале</span>
                </button>
              </div>
            </div>

            <div class="lg:col-span-7 relative">
              <div class="grid grid-cols-12 gap-6 items-center w-full">
                
                <div class="col-span-12 sm:col-span-7 arch-frame aspect-[4/5] bg-[#162432] cursor-pointer group" data-open-photo="${z.mainPhoto}" data-photo-title="${z.name}" data-photo-sub="${z.subtitle}">
                  <img src="${z.mainPhoto}" alt="${z.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                </div>

                <div class="col-span-12 sm:col-span-5 flex sm:flex-col gap-6" data-zone-fg="${idx}">
                  <div class="flex-1 aspect-[4/3] soft-photo-card cursor-pointer group" data-open-photo="${z.secondaryPhoto}" data-photo-title="${z.name}" data-photo-sub="${z.atmosphere}">
                    <img src="${z.secondaryPhoto}" alt="${z.name} ракурс" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                  </div>

                  <div class="flex-1 aspect-[4/3] soft-photo-card cursor-pointer group relative" data-open-photo="${z.detailPhoto}" data-photo-title="${z.name}" data-photo-sub="${z.subtitle}">
                    <img src="${z.detailPhoto}" alt="${z.name} деталь" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                  </div>
                </div>

              </div>
            </div>

          </div>
        </article>
      `;
    }).join('');

    if (walkStepsNav) {
      walkStepsNav.querySelectorAll('[data-walk-step]').forEach(btn => {
        btn.addEventListener('click', () => {
          const stepIdx = parseInt(btn.getAttribute('data-walk-step'), 10);
          if (window.innerWidth >= 1024 && zonesWalkTrack) {
            const trackTop = zonesWalkTrack.getBoundingClientRect().top + window.scrollY;
            const scrollable = zonesWalkTrack.offsetHeight - window.innerHeight;
            const targetScroll = trackTop + (scrollable * (stepIdx / Math.max(1, ARCHITECTURAL_ZONES.length - 1)));
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          } else {
            const panel = zonesHorizontalRail.querySelector(`[data-zone-panel="${stepIdx}"]`);
            if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    zonesHorizontalRail.querySelectorAll('[data-book-specific-zone]').forEach(btn => {
      btn.addEventListener('click', () => {
        openReservationModal({ zone: btn.getAttribute('data-book-specific-zone') });
      });
    });

    zonesHorizontalRail.querySelectorAll('[data-open-photo]').forEach(el => {
      el.addEventListener('click', () => {
        openLightbox({
          image: el.getAttribute('data-open-photo'),
          zoneLabel: 'Интерьер La SAGRA',
          title: el.getAttribute('data-photo-title'),
          subtitle: el.getAttribute('data-photo-sub')
        });
      });
    });
  }

  function updateHorizontalWalkOnScroll() {
    if (!zonesWalkTrack || !zonesHorizontalRail) return;
    if (window.innerWidth < 1024) {
      zonesHorizontalRail.style.transform = 'none';
      return;
    }

    const rect = zonesWalkTrack.getBoundingClientRect();
    const scrollable = Math.max(1, zonesWalkTrack.offsetHeight - window.innerHeight);
    const rawP = -rect.top / scrollable;
    const p = Math.min(1, Math.max(0, rawP));

    const totalPanels = ARCHITECTURAL_ZONES.length;
    const maxShiftVw = (totalPanels - 1) * 100;
    const currentShiftVw = p * maxShiftVw;

    zonesHorizontalRail.style.transform = `translate3d(-${currentShiftVw.toFixed(2)}vw, 0, 0)`;

    const activeIdx = Math.min(totalPanels - 1, Math.round(p * (totalPanels - 1)));
    if (walkStepsNav) {
      walkStepsNav.querySelectorAll('[data-walk-step]').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === activeIdx);
      });
    }

    zonesHorizontalRail.querySelectorAll('[data-zone-watermark]').forEach((wm, idx) => {
      const localOffset = (p * (totalPanels - 1) - idx) * 130;
      wm.style.transform = `translate3d(${localOffset.toFixed(1)}px, 0, 0)`;
    });

    zonesHorizontalRail.querySelectorAll('[data-zone-fg]').forEach((fg, idx) => {
      const localOffset = (p * (totalPanels - 1) - idx) * -40;
      fg.style.transform = `translate3d(0, ${localOffset.toFixed(1)}px, 0)`;
    });
  }

  // =========================================================================
  // 4. НАКРЫТЫЙ ИТАЛЬЯНСКИЙ СТОЛ (АСИММЕТРИЧНОЕ МЕНЮ С ВОЗДУХОМ)
  // =========================================================================
  function renderCategories() {
    if (!categoryContainer) return;
    categoryContainer.innerHTML = MENU_CATEGORIES.map(cat => {
      const isActive = cat.id === state.activeCategory;
      return `
        <button type="button" data-cat-id="${cat.id}" class="category-pill ${isActive ? 'active' : ''}">
          <span>${cat.name}</span>
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
      menuGrid.className = 'grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-14 lg:gap-y-24 items-start';
      menuGrid.innerHTML = items.map((dish, idx) => {
        const isSelected = state.selectedDishes.has(dish.id);
        const pattern = idx % 3;
        const colClass = pattern === 0
          ? 'lg:col-span-7'
          : pattern === 1
          ? 'lg:col-span-5 lg:mt-20'
          : 'lg:col-span-6 lg:col-start-4';

        const imgAspect = pattern === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]';

        return `
          <article class="editorial-dish-card ${colClass}" data-dish-card="${dish.id}">
            <div class="dish-photo-vessel ${imgAspect} cursor-pointer group" data-open-dish="${dish.id}">
              <img src="${dish.image}" alt="${dish.title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
              ${dish.note ? `<span class="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#181412]/75 backdrop-blur-md text-[#F5F0E6] text-xs">${dish.note}</span>` : ''}
              <span class="absolute bottom-4 right-4 px-3.5 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md text-[#181412] text-xs tabular-nums">
                ${dish.weight}
              </span>
            </div>

            <div class="pt-6 px-1 space-y-3">
              <div class="flex items-baseline justify-between gap-4">
                <div>
                  <p class="font-serif italic text-lg text-[#3A1212]">${dish.titleIt}</p>
                  <h3 class="font-serif text-2xl sm:text-3xl font-semibold text-[#181412] leading-snug cursor-pointer hover:text-[#3A1212] transition-colors" data-open-dish="${dish.id}">
                    ${dish.title}
                  </h3>
                </div>
                <div class="font-serif text-2xl sm:text-3xl font-semibold text-[#3A1212] tabular-nums whitespace-nowrap">
                  ${formatPrice(dish.price)}
                </div>
              </div>

              ${dish.termExplain ? `
                <div class="term-glossary-box">
                  <strong class="text-[#1E3F66] font-medium">О блюде:</strong> ${dish.termExplain}
                </div>
              ` : ''}

              <p class="text-sm sm:text-base text-[#564C42] leading-relaxed">
                ${dish.description}
              </p>

              <div class="pt-3 flex items-center justify-between gap-4">
                <button type="button" data-open-dish="${dish.id}" class="text-xs font-medium text-[#564C42] hover:text-[#181412] underline underline-offset-4">
                  Состав и винная пара
                </button>

                <button type="button" data-toggle-wish="${dish.id}" class="px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#3A1212] text-[#F5F0E6] shadow-md'
                    : 'bg-[#FAF7F2] text-[#181412] hover:bg-[#3A1212] hover:text-[#F5F0E6] shadow-sm'
                }">
                  ${isSelected ? '✓ В предзаказе' : '+ Подать к столу'}
                </button>
              </div>
            </div>
          </article>
        `;
      }).join('');

      bindEditorialCardTilt();
    } else {
      menuGrid.className = 'bg-[#FAF7F2] rounded-[32px] p-6 sm:p-10 shadow-sm divide-y divide-[#181412]/10';
      menuGrid.innerHTML = items.map(dish => {
        const isSelected = state.selectedDishes.has(dish.id);
        return `
          <div class="carta-row" data-dish-row="${dish.id}" data-preview-img="${dish.image}">
            <div class="flex-1 pr-4" data-open-dish="${dish.id}">
              <div class="flex flex-wrap items-baseline gap-2.5">
                <h3 class="font-serif text-2xl font-semibold text-[#181412]">${dish.title}</h3>
                <span class="font-serif italic text-base text-[#3A1212]">${dish.titleIt}</span>
              </div>
              <p class="text-sm text-[#564C42] mt-1">${dish.description}</p>
              ${dish.termExplain ? `<p class="text-xs text-[#1E3F66] mt-1.5 italic">${dish.termExplain}</p>` : ''}
            </div>

            <div class="flex items-center gap-5 self-end md:self-center">
              <span class="text-xs text-[#84786B] tabular-nums">${dish.weight}</span>
              <span class="font-serif text-2xl font-semibold text-[#3A1212] tabular-nums whitespace-nowrap">${formatPrice(dish.price)}</span>
              <button type="button" data-toggle-wish="${dish.id}" class="px-4 py-2 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#3A1212] text-[#F5F0E6]'
                  : 'bg-[#F3EFE6] text-[#181412] hover:bg-[#3A1212] hover:text-[#F5F0E6]'
              }">
                ${isSelected ? '✓ Выбрано' : '+ К столу'}
              </button>
            </div>
          </div>
        `;
      }).join('');

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

    menuGrid.querySelectorAll('[data-open-dish]').forEach(el => {
      el.addEventListener('click', () => openDishModal(el.getAttribute('data-open-dish')));
    });

    menuGrid.querySelectorAll('[data-toggle-wish]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDishWish(btn.getAttribute('data-toggle-wish'));
      });
    });
  }

  function bindEditorialCardTilt() {
    if (window.innerWidth < 1024) return;
    document.querySelectorAll('.editorial-dish-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-y * 2.5).toFixed(2)}deg) rotateY(${(x * 2.5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
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
    if (wishlistCounter) wishlistCounter.textContent = count.toString();

    if (headerWishlistBtn) {
      if (count > 0) {
        headerWishlistBtn.classList.remove('hidden');
        headerWishlistBtn.classList.add('inline-flex');
      } else {
        headerWishlistBtn.classList.add('hidden');
        headerWishlistBtn.classList.remove('inline-flex');
      }
    }

    const selectedItems = MENU_ITEMS.filter(d => state.selectedDishes.has(d.id));
    const totalSum = selectedItems.reduce((acc, d) => acc + d.price, 0);

    if (floatingTray) {
      if (count > 0) {
        floatingTray.classList.add('visible');
        if (trayCountBadge) trayCountBadge.textContent = count.toString();
        if (trayTotalText) trayTotalText.textContent = `${formatPrice(totalSum)} · ${count} блюд(а)`;
      } else {
        floatingTray.classList.remove('visible');
      }
    }

    const inlineList = document.getElementById('inline-selected-dishes-list');
    const modalList = document.getElementById('modal-selected-dishes-list');

    if (selectedItems.length === 0) {
      const emptyHtml = 'Блюда еще не выбраны. Отметьте позиции в меню выше, чтобы мы подали их к вашему приходу.';
      if (inlineList) inlineList.innerHTML = emptyHtml;
      if (modalList) modalList.innerHTML = 'Не выбраны (можно отметить в меню)';
      return;
    }

    const pillsHtml = `
      <div class="flex flex-wrap gap-2 mb-2.5">
        ${selectedItems.map(item => `
          <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] text-xs text-[#181412] shadow-sm">
            <span>${item.title} (${formatPrice(item.price)})</span>
            <button type="button" data-remove-wish="${item.id}" class="text-[#3A1212] font-bold hover:opacity-70" title="Удалить">×</button>
          </span>
        `).join('')}
      </div>
      <div class="text-xs text-[#3A1212] font-semibold tabular-nums">
        Итого по предзаказу: ${formatPrice(totalSum)} (${selectedItems.length} поз.)
      </div>
    `;

    if (inlineList) inlineList.innerHTML = pillsHtml;
    if (modalList) modalList.innerHTML = pillsHtml;

    document.querySelectorAll('[data-remove-wish]').forEach(btn => {
      btn.addEventListener('click', () => toggleDishWish(btn.getAttribute('data-remove-wish')));
    });
  }

  // =========================================================================
  // 5. Модальное окно блюда
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
        termBox.innerHTML = `<strong class="text-[#1E3F66]">О блюде:</strong> ${dish.termExplain}`;
      } else {
        termBox.classList.add('hidden');
      }
    }

    const ingContainer = document.getElementById('modal-dish-ingredients');
    if (ingContainer) {
      ingContainer.innerHTML = dish.ingredients.map(ing => `
        <span class="px-3.5 py-1.5 rounded-full bg-[#F3EFE6] text-xs text-[#181412]">${ing}</span>
      `).join('');
    }

    const addBtn = document.getElementById('modal-dish-add-btn');
    if (addBtn) {
      const isSelected = state.selectedDishes.has(dish.id);
      addBtn.textContent = isSelected ? '✓ Уже в предзаказе (убрать)' : '+ Подать к столу / в предзаказ';
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
  // 6. Фотогалерея 2ГИС и Отзывы гостей
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
          <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E1822]/90 via-[#0E1822]/40 to-transparent p-6 pt-14">
            <span class="font-serif italic text-base text-[#C59B5F] block mb-0.5">${item.zoneLabel}</span>
            <h3 class="font-serif text-2xl text-[#F5F0E6] leading-snug">${item.title}</h3>
            <p class="text-xs text-[#CFC5B7] mt-1 line-clamp-2">${item.subtitle}</p>
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
    document.getElementById('lightbox-zone').textContent = item.zoneLabel || 'La SAGRA';
    document.getElementById('lightbox-title').textContent = item.title;
    document.getElementById('lightbox-subtitle').textContent = item.subtitle || '';
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
  }

  function renderReviews() {
    if (!reviewsGrid) return;
    reviewsGrid.innerHTML = REVIEWS_DATA.map(rev => `
      <article class="bg-[#FAF7F2] rounded-[28px] p-8 sm:p-10 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-[#181412]/10">
            <div>
              <h3 class="font-serif text-2xl font-semibold text-[#181412]">${rev.author}</h3>
              <p class="text-xs text-[#564C42] mt-0.5">${rev.date}</p>
            </div>
            <span class="px-3.5 py-1 rounded-full bg-[#3A1212] text-[#F5F0E6] text-xs tabular-nums">
              5.0 ★
            </span>
          </div>

          <p class="text-base text-[#181412] leading-relaxed mb-6">
            «${rev.text}»
          </p>
        </div>

        <div class="pt-4 border-t border-[#181412]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-serif italic text-base text-[#3A1212]">${rev.tag}</span>
          <span class="text-[#564C42]">${rev.staffMention}</span>
        </div>
      </article>
    `).join('');
  }

  // =========================================================================
  // 7. Бронирование стола и отправка в WhatsApp (+7 778 455-13-42)
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
        <div class="flex justify-between py-1.5 border-b border-[#181412]/10"><span class="text-[#564C42]">Формат:</span><strong class="text-right">${visitType}</strong></div>
        <div class="flex justify-between py-1.5 border-b border-[#181412]/10"><span class="text-[#564C42]">Гость:</span><strong>${name} (${phone})</strong></div>
        <div class="flex justify-between py-1.5 border-b border-[#181412]/10"><span class="text-[#564C42]">Дата и время:</span><strong class="tabular-nums">${date} · ${time}</strong></div>
        <div class="flex justify-between py-1.5 border-b border-[#181412]/10"><span class="text-[#564C42]">Персон:</span><strong>${guests}</strong></div>
        <div class="flex justify-between py-1.5 border-b border-[#181412]/10"><span class="text-[#564C42]">Зал:</span><strong class="text-right">${zone}</strong></div>
        ${selectedItems.length > 0 ? `<div class="pt-2"><span class="text-[#3A1212] font-semibold block mb-1">Предзаказ (${formatPrice(totalSum)}):</span><p class="text-xs text-[#564C42]">${selectedItems.map(d => d.title).join(', ')}</p></div>` : ''}
      `;
    }

    closeModal(reservationModal);
    if (confirmationModal) {
      confirmationModal.classList.remove('hidden');
      confirmationModal.classList.add('flex');
    }
  }

  // =========================================================================
  // 8. Единый цикл скролл-драйверов + Умная шапка (скрытие вниз / показ вверх)
  // =========================================================================
  function initChoreographyLoop() {
    const header = document.getElementById('main-header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onFrame() {
      const currentY = window.scrollY;

      updatePortalOnScroll();
      updateHorizontalWalkOnScroll();

      // Умная шапка: исчезает при скролле вниз, появляется при скролле вверх
      if (header) {
        header.classList.toggle('header-scrolled', currentY > 40);

        if (currentY > lastScrollY + 5 && currentY > 100) {
          header.classList.add('header-hidden');
        } else if (currentY < lastScrollY - 5 || currentY <= 80) {
          header.classList.remove('header-hidden');
        }
      }

      // Кнопка возврата наверх
      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', currentY > 450);
      }

      if (window.innerWidth >= 768) {
        document.querySelectorAll('[data-parallax-speed]').forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0');
          const r = el.getBoundingClientRect();
          const centerOffset = (r.top + r.height / 2) - window.innerHeight / 2;
          el.style.transform = `translate3d(0, ${(centerOffset * speed).toFixed(1)}px, 0)`;
        });
      }

      lastScrollY = Math.max(0, currentY);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onFrame);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      updatePortalOnScroll();
      updateHorizontalWalkOnScroll();
    });

    onFrame();

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .curtain-reveal-box, .curtain-mask').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // =========================================================================
  // 9. Привязка интерактивных кнопок, переключателя карты и форм
  // =========================================================================
  function bindEvents() {
    // Кнопка возврата наверх
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Переключатель карты 2ГИС / Яндекс.Карта
    const mapTab2gis = document.getElementById('map-tab-2gis');
    const mapTabYandex = document.getElementById('map-tab-yandex');
    const mapIframe2gis = document.getElementById('map-iframe-2gis');
    const mapIframeYandex = document.getElementById('map-iframe-yandex');

    if (mapTab2gis && mapTabYandex && mapIframe2gis && mapIframeYandex) {
      mapTab2gis.addEventListener('click', () => {
        mapIframe2gis.classList.remove('hidden');
        mapIframeYandex.classList.add('hidden');
        mapTab2gis.className = 'px-3.5 py-1 rounded-full text-xs font-medium bg-[#C59B5F] text-[#14100E] transition-all';
        mapTabYandex.className = 'px-3.5 py-1 rounded-full text-xs font-medium text-[#CFC5B7] hover:text-white transition-all';
      });
      mapTabYandex.addEventListener('click', () => {
        mapIframeYandex.classList.remove('hidden');
        mapIframe2gis.classList.add('hidden');
        mapTabYandex.className = 'px-3.5 py-1 rounded-full text-xs font-medium bg-[#C59B5F] text-[#14100E] transition-all';
        mapTab2gis.className = 'px-3.5 py-1 rounded-full text-xs font-medium text-[#CFC5B7] hover:text-white transition-all';
      });
    }

    if (viewGridBtn && viewListBtn) {
      viewGridBtn.addEventListener('click', () => {
        state.menuView = 'grid';
        viewGridBtn.className = 'px-5 py-2 rounded-full text-xs font-medium bg-[#3A1212] text-[#F5F0E6] transition-all';
        viewListBtn.className = 'px-5 py-2 rounded-full text-xs font-medium text-[#564C42] hover:text-[#181412] transition-all';
        renderMenu();
      });
      viewListBtn.addEventListener('click', () => {
        state.menuView = 'list';
        viewListBtn.className = 'px-5 py-2 rounded-full text-xs font-medium bg-[#3A1212] text-[#F5F0E6] transition-all';
        viewGridBtn.className = 'px-5 py-2 rounded-full text-xs font-medium text-[#564C42] hover:text-[#181412] transition-all';
        renderMenu();
      });
    }

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

    document.querySelectorAll('[data-open-booking]').forEach(btn => {
      btn.addEventListener('click', () => openReservationModal());
    });

    if (headerWishlistBtn) {
      headerWishlistBtn.addEventListener('click', () => openReservationModal());
    }

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
  }

  // Запуск
  updateLiveStatus();
  initBookingDates();
  renderHorizontalZonesWalk();
  renderCategories();
  renderMenu();
  renderGallery();
  renderReviews();
  updateWishlistUI();
  bindEvents();
  initChoreographyLoop();
});
