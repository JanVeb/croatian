import './style.css';
import { translations } from './translations';
import type { Language } from './translations';
import { fetchAndParseMenu } from './menu-parser';
import type { MenuItem } from './menu-parser';

// State Management
interface AppState {
  language: Language;
  theme: 'dark' | 'light';
  menuItems: MenuItem[];
  activeCategory: string;
  searchQuery: string;
  onlyVegetarian: boolean;
  onlySpicy: boolean;
}

const state: AppState = {
  language: (localStorage.getItem('lang') as Language) || 'hr',
  theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
  menuItems: [],
  activeCategory: 'All',
  searchQuery: '',
  onlyVegetarian: false,
  onlySpicy: false,
};

// SVG Assets for Restaurant Categories
const CATEGORY_SVGS = {
  Appetizer: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1.5"/>
    </svg>
  `, // Elegant plate/starter concept
  Main: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 15h18M3 19h18M12 2v13M7 8a5 5 0 0 1 10 0"/>
    </svg>
  `, // Cloche (Peka) cover
  Dessert: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="5" r="2"/>
      <path d="M5 13a7 7 0 0 0 14 0V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4z"/>
      <path d="M9 17v4M15 17v4M3 21h18"/>
    </svg>
  `, // Sweet cupcake/cherry concept
  Drink: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15.2 3a2 2 0 0 1 1.6 1.2l2.6 7.8a2 2 0 0 1-1.6 2.6L12 15l-5.8-.4A2 2 0 0 1 4.6 12L7.2 4.2A2 2 0 0 1 8.8 3h6.4z"/>
      <path d="M12 15v5M9 21h6"/>
    </svg>
  `, // Wine glass
};

// Initializer
document.addEventListener('DOMContentLoaded', async () => {
  // Apply initial theme
  applyTheme(state.theme);

  // Bind settings listeners
  setupSettingsUI();

  // Load menu items
  state.menuItems = await fetchAndParseMenu();

  // Translate static UI elements
  translateUI();

  // Render filter options
  renderCategoryTabs();

  // Render menu grid
  renderMenu();

  // Set up listeners for search & toggles
  setupFiltersListeners();

  // Setup reservation listener
  setupReservationForm();

  // Setup Scroll Animation & Navigation
  setupScrollHandlers();
});

// Translation Engine
function translateUI() {
  const dict = translations[state.language];

  // Document language attribute
  document.documentElement.lang = state.language;

  // Document Title
  const titles = {
    hr: 'Srce Vatreno | Vrhunski Hrvatski Restoran & Konoba',
    en: 'Srce Vatreno | Premium Croatian Restaurant & Tavern',
    zh: '烈火之心 | 克罗地亚经典餐厅与酒馆',
  };
  document.title = titles[state.language];

  // Header Navigation
  const homeLink = document.querySelector('[data-nav="home"]');
  const storyLink = document.querySelector('[data-nav="story"]');
  const menuLink = document.querySelector('[data-nav="menu"]');
  const resLink = document.querySelector('[data-nav="reservation"]');
  
  if (homeLink) homeLink.textContent = dict.navHome;
  if (storyLink) storyLink.textContent = dict.navHome === 'Home' || dict.navHome === '首页' ? (state.language === 'en' ? 'Our Story' : '品牌故事') : 'Naša Priča';
  if (menuLink) menuLink.textContent = dict.navMenu;
  if (resLink) resLink.textContent = dict.navReservation;

  // Drawer Nav (Mobile)
  const mobHomeLink = document.querySelector('.mobile-nav [data-nav="home"]');
  const mobStoryLink = document.querySelector('.mobile-nav [data-nav="story"]');
  const mobMenuLink = document.querySelector('.mobile-nav [data-nav="menu"]');
  const mobResLink = document.querySelector('.mobile-nav [data-nav="reservation"]');

  if (mobHomeLink) mobHomeLink.textContent = dict.navHome;
  if (mobStoryLink) mobStoryLink.textContent = state.language === 'en' ? 'Our Story' : (state.language === 'zh' ? '品牌故事' : 'Naša Priča');
  if (mobMenuLink) mobMenuLink.textContent = dict.navMenu;
  if (mobResLink) mobResLink.textContent = dict.navReservation;

  // Language display text in main switcher
  const activeLangLabel = document.getElementById('active-lang-label');
  const activeLangFlag = document.getElementById('active-lang-flag');
  if (activeLangLabel && activeLangFlag) {
    activeLangLabel.textContent = state.language.toUpperCase();
    activeLangFlag.textContent = state.language === 'hr' ? '🇭🇷' : state.language === 'en' ? '🇬🇧' : '🇨🇳';
  }

  // Hero Section
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroMenuCta = document.getElementById('hero-menu-cta');
  const heroResCta = document.getElementById('hero-res-cta');

  if (heroTitle) heroTitle.textContent = dict.heroTagline;
  if (heroSubtitle) heroSubtitle.textContent = dict.heroSub;
  if (heroMenuCta) heroMenuCta.textContent = dict.navMenu;
  if (heroResCta) heroResCta.textContent = dict.resSubmit;

  // Brand Story Section
  const storyTitle = document.getElementById('story-title');
  const storyText = document.getElementById('story-text');

  if (storyTitle) storyTitle.textContent = dict.brandStoryTitle;
  if (storyText) storyText.textContent = dict.brandStoryText;

  // Menu Section
  const menuTitle = document.getElementById('menu-title');
  const searchInput = document.getElementById('menu-search') as HTMLInputElement;
  const vegToggleLabel = document.getElementById('veg-toggle-label');
  const spicyToggleLabel = document.getElementById('spicy-toggle-label');

  if (menuTitle) menuTitle.textContent = dict.navMenu;
  if (searchInput) searchInput.placeholder = dict.searchPlaceholder;
  if (vegToggleLabel) vegToggleLabel.textContent = dict.filterVegetarian;
  if (spicyToggleLabel) spicyToggleLabel.textContent = dict.filterSpicy;

  // Reservation Section
  const resTitle = document.getElementById('res-title');
  const resSubtitle = document.getElementById('res-subtitle');
  const lblResName = document.getElementById('lbl-res-name');
  const lblResEmail = document.getElementById('lbl-res-email');
  const lblResDate = document.getElementById('lbl-res-date');
  const lblResTime = document.getElementById('lbl-res-time');
  const lblResGuests = document.getElementById('lbl-res-guests');
  const lblResNotes = document.getElementById('lbl-res-notes');
  const resSubmitBtn = document.getElementById('res-submit-btn');
  const resSuccessMsg = document.getElementById('res-success-msg');

  if (resTitle) resTitle.textContent = dict.resTitle;
  if (resSubtitle) resSubtitle.textContent = dict.resSubtitle;
  if (lblResName) lblResName.textContent = dict.resName;
  if (lblResEmail) lblResEmail.textContent = dict.resEmail;
  if (lblResDate) lblResDate.textContent = dict.resDate;
  if (lblResTime) lblResTime.textContent = dict.resTime;
  if (lblResGuests) lblResGuests.textContent = dict.resGuests;
  if (lblResNotes) lblResNotes.textContent = dict.resNotes;
  if (resSubmitBtn) resSubmitBtn.textContent = dict.resSubmit;
  if (resSuccessMsg) resSuccessMsg.textContent = dict.resSuccess;

  // Settings Modal Labels
  const settingsTitleLabel = document.getElementById('settings-title-label');
  const settingsLangLabel = document.getElementById('settings-lang-label');
  const settingsThemeLabel = document.getElementById('settings-theme-label');
  const lblThemeDark = document.getElementById('lbl-theme-dark');
  const lblThemeLight = document.getElementById('lbl-theme-light');

  if (settingsTitleLabel) settingsTitleLabel.textContent = dict.settingsTitle;
  if (settingsLangLabel) settingsLangLabel.textContent = dict.settingsLanguage;
  if (settingsThemeLabel) settingsThemeLabel.textContent = dict.settingsTheme;
  if (lblThemeDark) lblThemeDark.textContent = dict.settingsThemeDark;
  if (lblThemeLight) lblThemeLight.textContent = dict.settingsThemeLight;

  // Footer Section
  const footerTagline = document.getElementById('footer-tagline');
  const footerContactTitle = document.getElementById('footer-contact-title');
  const footerAddress = document.getElementById('footer-address');
  const footerHoursTitle = document.getElementById('footer-hours-title');
  const footerHoursWeek = document.getElementById('footer-hours-week');
  const footerHoursWeekend = document.getElementById('footer-hours-weekend');
  const lblBackToTop = document.getElementById('lbl-back-to-top');

  if (footerTagline) footerTagline.textContent = dict.heroSub;
  if (footerContactTitle) footerContactTitle.textContent = dict.contactTitle;
  if (footerAddress) footerAddress.textContent = dict.contactAddress;
  if (footerHoursTitle) footerHoursTitle.textContent = dict.contactHours;
  if (footerHoursWeek) footerHoursWeek.textContent = dict.contactHoursWeek;
  if (footerHoursWeekend) footerHoursWeekend.textContent = dict.contactHoursWeekend;
  if (lblBackToTop) lblBackToTop.textContent = dict.backToTop;
}

// Category Tabs Renderer
function renderCategoryTabs() {
  const container = document.getElementById('category-tabs-container');
  if (!container) return;

  const categories = ['All', 'Appetizer', 'Main', 'Dessert', 'Drink'];
  const dict = translations[state.language];

  const categoryNames: Record<string, string> = {
    All: dict.catAll,
    Appetizer: dict.catAppetizer,
    Main: dict.catMain,
    Dessert: dict.catDessert,
    Drink: dict.catDrink,
  };

  container.innerHTML = categories
    .map(
      cat => `
      <button class="category-btn ${state.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
        ${categoryNames[cat]}
      </button>
    `
    )
    .join('');

  // Re-bind listeners to newly created buttons
  const buttons = container.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const cat = target.getAttribute('data-category') || 'All';
      
      // Update state
      state.activeCategory = cat;
      
      // Toggle active states on UI
      buttons.forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      
      // Re-filter menu
      renderMenu();
    });
  });
}

// Menu Grid Renderer
function renderMenu() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  // Filter items
  const filtered = state.menuItems.filter(item => {
    // Category match
    if (state.activeCategory !== 'All' && item.category !== state.activeCategory) {
      return false;
    }
    // Vegetarian filter
    if (state.onlyVegetarian && !item.is_vegetarian) {
      return false;
    }
    // Spicy filter
    if (state.onlySpicy && item.spicy_level === 0) {
      return false;
    }
    // Text search filter
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      const name = (item[`name_${state.language}`] || '').toLowerCase();
      const desc = (item[`description_${state.language}`] || '').toLowerCase();
      if (!name.includes(q) && !desc.includes(q)) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    const messages = {
      hr: 'Nema jela koja odgovaraju traženim kriterijima.',
      en: 'No dishes found matching your criteria.',
      zh: '没有符合您所选条件的项目。',
    };
    grid.innerHTML = `
      <div class="loader-container">
        <p style="font-family: var(--font-family-serif); font-size: 18px; color: var(--text-muted);">
          ${messages[state.language]}
        </p>
      </div>
    `;
    return;
  }

  // Render cards
  grid.innerHTML = filtered
    .map(item => {
      const name = item[`name_${state.language}`];
      const dict = translations[state.language];

      const categoryName = {
        Appetizer: dict.catAppetizer,
        Main: dict.catMain,
        Dessert: dict.catDessert,
        Drink: dict.catDrink,
      }[item.category];

      // Badges
      let badgesHTML = '';
      if (item.is_vegetarian) {
        badgesHTML += `<span class="badge badge-veg">${dict.filterVegetarian}</span>`;
      }
      if (item.spicy_level > 0) {
        badgesHTML += `<span class="badge badge-spicy">${dict.filterSpicy}</span>`;
      }

      // Spicy flames
      let flamesHTML = '';
      if (item.spicy_level > 0) {
        flamesHTML = `
          <div class="spicy-flames" title="${dict.spicyLevel}: ${item.spicy_level}">
            ${Array(item.spicy_level)
              .fill(
                `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2c0 2 .5 3.5 1 5.5.5 2 2.5 3 2.5 5.5 0 3.5-3 6-6 6s-6-2.5-6-6c0-2.5 2-4.5 3-6 .5-1 1-2 1-3.5.5.5.8 1.2 1 2.5.5-1.5.5-3 1-4z"/></svg>`
              )
              .join('')}
          </div>
        `;
      }

      const svgIcon = CATEGORY_SVGS[item.category] || '';

      return `
        <article class="card glass-card menu-card" data-dish-id="${item.id}">
          <div class="menu-card-visual">
            <div class="card-category-svg">${svgIcon}</div>
            <div class="card-badges">${badgesHTML}</div>
            <div class="card-price">€${item.price.toFixed(2)}</div>
          </div>
          <div class="menu-card-content">
            <span class="menu-card-cat">${categoryName}</span>
            <h3 class="menu-card-title">${name}</h3>
            <div class="card-footer-action">
              <span class="detail-link">
                ${state.language === 'hr' ? 'Saznaj više' : state.language === 'en' ? 'View Details' : '查看详情'}
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
              ${flamesHTML}
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  // Add click listeners for Details modal
  const cards = grid.querySelectorAll('.menu-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Don't trigger if clicked a sub-button (e.g. if we add ordering options later)
      const dishId = parseInt(card.getAttribute('data-dish-id') || '0', 10);
      const dish = state.menuItems.find(item => item.id === dishId);
      if (dish) {
        openDishModal(dish);
      }
    });
  });
}

// Simple Markdown Parser Utility
function parseMarkdown(text: string): string {
  if (!text) return '';
  
  // Escape HTML to prevent XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italics: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Line breaks: \n to <br>
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

// Details Modal Handler
function openDishModal(dish: MenuItem) {
  const modal = document.getElementById('dish-modal');
  const container = document.getElementById('dish-modal-content');
  if (!modal || !container) return;

  const dict = translations[state.language];
  const name = dish[`name_${state.language}`];
  const desc = dish[`description_${state.language}`];
  const svgIcon = CATEGORY_SVGS[dish.category] || '';

  const categoryName = {
    Appetizer: dict.catAppetizer,
    Main: dict.catMain,
    Dessert: dict.catDessert,
    Drink: dict.catDrink,
  }[dish.category];

  // Badges
  let badgesHTML = '';
  if (dish.is_vegetarian) {
    badgesHTML += `<span class="badge badge-veg">${dict.filterVegetarian}</span>`;
  }
  if (dish.spicy_level > 0) {
    badgesHTML += `<span class="badge badge-spicy">${dict.filterSpicy}</span>`;
  }

  // Spicy flames detail
  let flamesHTML = '';
  if (dish.spicy_level > 0) {
    flamesHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">${dict.spicyLevel}:</span>
        <div class="spicy-flames" style="font-size: 16px;">
          ${Array(dish.spicy_level)
            .fill(
              `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2c0 2 .5 3.5 1 5.5.5 2 2.5 3 2.5 5.5 0 3.5-3 6-6 6s-6-2.5-6-6c0-2.5 2-4.5 3-6 .5-1 1-2 1-3.5.5.5.8 1.2 1 2.5.5-1.5.5-3 1-4z"/></svg>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="dish-detail-graphic">
      <div class="card-category-svg" style="opacity: 0.2;">${svgIcon}</div>
      <div class="card-badges" style="top:24px; left:24px;">${badgesHTML}</div>
    </div>
    <div class="dish-detail-body">
      <div class="dish-detail-title-row">
        <div>
          <span class="menu-card-cat" style="font-size:12px;">${categoryName}</span>
          <h3 class="dish-detail-title">${name}</h3>
        </div>
        <div class="dish-detail-price">€${dish.price.toFixed(2)}</div>
      </div>
      <div class="dish-detail-badges-row">
        ${flamesHTML}
      </div>
      <div class="dish-detail-desc">${parseMarkdown(desc)}</div>
      
      <button class="btn btn-primary" id="modal-close-btn" style="width: 100%; margin-top: 10px;">
        ${dict.close}
      </button>
    </div>
  `;

  // Open modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Lock background scroll

  // Close elements
  const closeBtn = document.getElementById('dish-modal-close');
  const innerCloseBtn = document.getElementById('modal-close-btn');

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  innerCloseBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Search and Toggle Inputs Listener
function setupFiltersListeners() {
  const searchInput = document.getElementById('menu-search') as HTMLInputElement;
  const vegToggle = document.getElementById('veg-toggle') as HTMLInputElement;
  const spicyToggle = document.getElementById('spicy-toggle') as HTMLInputElement;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = (e.target as HTMLInputElement).value;
      renderMenu();
    });
  }

  if (vegToggle) {
    vegToggle.addEventListener('change', (e) => {
      state.onlyVegetarian = (e.target as HTMLInputElement).checked;
      renderMenu();
    });
  }

  if (spicyToggle) {
    spicyToggle.addEventListener('change', (e) => {
      state.onlySpicy = (e.target as HTMLInputElement).checked;
      renderMenu();
    });
  }
}

// Settings Modal & Language Switcher
function setupSettingsUI() {
  const modal = document.getElementById('settings-modal');
  const trigger = document.getElementById('settings-trigger');
  const closeBtn = document.getElementById('settings-close');
  const dropdown = document.getElementById('lang-dropdown');
  const dropdownTrigger = document.getElementById('lang-btn');

  // Open modal
  trigger?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  const closeModal = () => {
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Dropdown header picker
  dropdownTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.classList.toggle('show');
  });

  window.addEventListener('click', () => {
    dropdown?.classList.remove('show');
  });

  // Language selectors in dropdown
  const quickOpts = dropdown?.querySelectorAll('.lang-opt');
  quickOpts?.forEach(opt => {
    opt.addEventListener('click', (e) => {
      const lang = (e.currentTarget as HTMLButtonElement).getAttribute('data-lang') as Language;
      if (lang) {
        changeLanguage(lang);
      }
    });
  });

  // Language buttons in settings modal
  const modalLangBtns = modal?.querySelectorAll('.lang-selector-btn');
  modalLangBtns?.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = (e.currentTarget as HTMLButtonElement).getAttribute('data-lang-opt') as Language;
      if (lang) {
        changeLanguage(lang);
        modalLangBtns.forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLButtonElement).classList.add('active');
      }
    });
  });

  // Update active state in settings language selector on load
  const activeModalBtn = modal?.querySelector(`[data-lang-opt="${state.language}"]`);
  if (activeModalBtn) {
    modalLangBtns?.forEach(b => b.classList.remove('active'));
    activeModalBtn.classList.add('active');
  }

  // Theme Switches
  const darkThemeBtn = document.getElementById('theme-btn-dark');
  const lightThemeBtn = document.getElementById('theme-btn-light');

  const updateThemeSelectorState = () => {
    if (state.theme === 'dark') {
      darkThemeBtn?.classList.add('active');
      lightThemeBtn?.classList.remove('active');
    } else {
      darkThemeBtn?.classList.remove('active');
      lightThemeBtn?.classList.add('active');
    }
  };

  updateThemeSelectorState();

  darkThemeBtn?.addEventListener('click', () => {
    applyTheme('dark');
    updateThemeSelectorState();
  });

  lightThemeBtn?.addEventListener('click', () => {
    applyTheme('light');
    updateThemeSelectorState();
  });
}

function changeLanguage(lang: Language) {
  state.language = lang;
  localStorage.setItem('lang', lang);
  
  // Re-translate all static texts
  translateUI();
  // Re-render categories tabs (names change)
  renderCategoryTabs();
  // Re-render menu (dishes translation)
  renderMenu();

  // Sync settings modal buttons
  const modal = document.getElementById('settings-modal');
  const modalLangBtns = modal?.querySelectorAll('.lang-selector-btn');
  modalLangBtns?.forEach(btn => {
    if (btn.getAttribute('data-lang-opt') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function applyTheme(theme: 'dark' | 'light') {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  
  const htmlEl = document.documentElement;
  if (theme === 'dark') {
    htmlEl.classList.remove('light');
    htmlEl.classList.add('dark');
  } else {
    htmlEl.classList.remove('dark');
    htmlEl.classList.add('light');
  }
}

// Reservation Form Submission (Simulated)
function setupReservationForm() {
  const form = document.getElementById('reservation-form') as HTMLFormElement;
  const banner = document.getElementById('form-success-banner');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('res-name-input') as HTMLInputElement).value;
    const email = (document.getElementById('res-email-input') as HTMLInputElement).value;
    const date = (document.getElementById('res-date-input') as HTMLInputElement).value;
    const time = (document.getElementById('res-time-input') as HTMLSelectElement).value;
    const guests = (document.getElementById('res-guests-input') as HTMLInputElement).value;
    const notes = (document.getElementById('res-notes-input') as HTMLTextAreaElement).value;

    const reservation = {
      id: Date.now(),
      name,
      email,
      date,
      time,
      guests,
      notes,
      timestamp: new Date().toISOString()
    };

    // Store reservation locally (simulate backend)
    const existing = JSON.parse(localStorage.getItem('reservations') || '[]');
    existing.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(existing));

    // Show banner
    if (banner) {
      banner.classList.remove('hidden');
      // Scroll to banner nicely
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Clear form
      form.reset();

      // Hide after 6 seconds
      setTimeout(() => {
        banner.classList.add('hidden');
      }, 6000);
    }
  });

  // Set date field minimum value to today
  const dateInput = document.getElementById('res-date-input') as HTMLInputElement;
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

// Scroll Handlers & Animation triggers
function setupScrollHandlers() {
  const header = document.getElementById('main-header');
  const desktopLinks = document.querySelectorAll('#desktop-nav .nav-link');
  const sections = document.querySelectorAll('section');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  // Back to top button click
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll event
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Header class scroll additions
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active link highlighting on scroll
    let currentId = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id') || 'home';
      }
    });

    desktopLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer controls
  const drawerToggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const closeDrawer = () => {
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
    
    // Reset mobile toggler SVG lines
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    
    if (line1 && line2 && line3) {
      line1.setAttribute('y1', '6');
      line1.setAttribute('y2', '6');
      line1.setAttribute('x1', '4');
      line1.setAttribute('x2', '20');

      line2.setAttribute('opacity', '1');

      line3.setAttribute('y1', '18');
      line3.setAttribute('y2', '18');
      line3.setAttribute('x1', '4');
      line3.setAttribute('x2', '20');
    }
  };

  drawerToggle?.addEventListener('click', () => {
    const isOpen = drawer?.classList.toggle('open');
    
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Animate hamburger to cross
      line1?.setAttribute('x1', '4');
      line1?.setAttribute('y1', '4');
      line1?.setAttribute('x2', '20');
      line1?.setAttribute('y2', '20');
      
      line2?.setAttribute('opacity', '0');
      
      line3?.setAttribute('x1', '4');
      line3?.setAttribute('y1', '20');
      line3?.setAttribute('x2', '20');
      line3?.setAttribute('y2', '4');
    } else {
      closeDrawer();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Reveal-on-scroll using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
}
