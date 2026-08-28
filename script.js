/* =========================================================
   InstruTech_ID — konfigurasi & data
   ========================================================= */

// GANTI dengan nomor WhatsApp toko (format: 62 diikuti nomor tanpa 0 di depan)
const WA_NUMBER = "6281372768824";

// Data produk kini disimpan terpisah di file products.json (bukan di sini lagi).
// Supaya update produk cukup edit JSON-nya saja, tanpa sentuh HTML/CSS/JS.
// Struktur tiap produk & cara menambah field seperti "variants"/"images"/"specs"
// dijelaskan di komentar dalam products.json.
let PRODUCTS = [];

const ICONS = {
  resistor: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12h3l1.5-4 2 8 2-8 2 8 2-8 1.5 4H22"/></svg>',
  chip: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 2v3M13 2v3M9 19v3M13 19v3M2 9h3M2 13h3M19 9h3M19 13h3"/></svg>',
  laptop: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="11" rx="1"/><path d="M2 19h20l-1.5-4h-17L2 19Z"/></svg>',
  tools: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L4 17l3 3 5.1-5.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2-2 2.5-2.5Z"/></svg>',
};

const CATEGORY_LABEL = {
  komponen: "KOMPONEN ELEKTRONIKA",
  laptop: "LAPTOP & AKSESORIS",
  tools: "TOOLS & ALAT UKUR",
};

/* =========================================================
   Util
   ========================================================= */
function formatRupiah(num){
  return "Rp" + num.toLocaleString("id-ID");
}

function buildWaLink(productName, price){
  const base = `https://wa.me/${WA_NUMBER}`;
  if(!productName){
    return `${base}?text=${encodeURIComponent("Halo InstruTech_ID, saya ingin bertanya tentang produk.")}`;
  }
  const msg = `Halo InstruTech_ID, saya ingin pesan produk berikut:\n\n*${productName}*\nHarga: ${formatRupiah(price)}\n\nApakah stok tersedia?`;
  return `${base}?text=${encodeURIComponent(msg)}`;
}

/* =========================================================
   Render produk
   ========================================================= */
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

// Menyimpan varian kondisi yang sedang dipilih untuk tiap produk (default varian pertama)
const activeVariant = {};

function getDisplayData(p){
  if(p.variants && p.variants.length){
    const idx = activeVariant[p.id] || 0;
    const v = p.variants[idx];
    return { spec: v.spec, price: v.price, condition: v.condition, activeIdx: idx };
  }
  return { spec: p.spec, price: p.price, condition: null, activeIdx: -1 };
}

function renderProducts(list){
  productGrid.innerHTML = "";
  if(list.length === 0){
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  const frag = document.createDocumentFragment();
  list.forEach(p => {
    const { spec, price, condition, activeIdx } = getDisplayData(p);

    const variantRow = p.variants ? `
      <div class="variant-row" role="group" aria-label="Pilih kondisi produk">
        ${p.variants.map((v, i) => `
          <button type="button" class="variant-chip ${i === activeIdx ? "active" : ""}" data-product-id="${p.id}" data-variant-idx="${i}">
            ${v.condition}
          </button>
        `).join("")}
      </div>` : "";

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb">
  ${condition ? `<span class="condition-badge">${condition}</span>` : ""}
  <img 
    src="${p.icon}" 
    alt="${p.name}"
    loading="lazy"
    onerror="this.style.display='none'"
  >
</div>
      <span class="product-cat-tag">${CATEGORY_LABEL[p.category]}</span>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-spec">${spec}</p>
      ${(p.images || p.specs) ? `<button type="button" class="product-detail-link" data-product-id="${p.id}">Lihat foto &amp; spesifikasi lengkap →</button>` : ""}
      ${variantRow}
      <div class="product-foot">
        <span class="product-price">${formatRupiah(price)}</span>
        <a class="product-order" href="${buildWaLink(condition ? `${p.name} (${condition})` : p.name, price)}" target="_blank" rel="noopener">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.19c-.24.68-1.4 1.33-1.93 1.4-.5.07-1.06.1-1.7-.11-.4-.13-.9-.29-1.55-.57-2.73-1.18-4.51-3.93-4.65-4.11-.14-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .96-2.27.24-.26.53-.33.71-.33.18 0 .35 0 .5.01.17.01.38-.06.6.46.24.57.8 1.96.87 2.1.07.15.11.32.02.51-.09.19-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.27.37-.22.62-.13.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z"/></svg>
          Pesan
        </a>
      </div>
    `;
    frag.appendChild(card);
  });
  productGrid.appendChild(frag);
}

// Klik chip kondisi ATAU tombol "lihat detail" di dalam grid produk
productGrid.addEventListener("click", (e) => {
  const chip = e.target.closest(".variant-chip");
  if(chip){
    const { productId, variantIdx } = chip.dataset;
    activeVariant[productId] = Number(variantIdx);
    applyFilters();
    return;
  }
  const detailBtn = e.target.closest(".product-detail-link");
  if(detailBtn){
    openProductModal(detailBtn.dataset.productId);
  }
});

/* =========================================================
   Filter + search
   ========================================================= */
let currentFilter = "all";
let currentSearch = "";

function applyFilters(){
  const filtered = PRODUCTS.filter(p => {
    const matchCategory = currentFilter === "all" || p.category === currentFilter;
    const searchableSpec = p.variants
      ? p.variants.map(v => v.spec + " " + v.condition).join(" ")
      : p.spec;
    const matchSearch = p.name.toLowerCase().includes(currentSearch) || searchableSpec.toLowerCase().includes(currentSearch);
    return matchCategory && matchSearch;
  });
  renderProducts(filtered);
}

const filterTabs = document.querySelectorAll(".filter-tab");
filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    applyFilters();
  });
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  currentSearch = e.target.value.trim().toLowerCase();
  applyFilters();
});

// Klik kartu kategori -> filter katalog + scroll ke katalog
document.querySelectorAll(".cat-card").forEach(card => {
  card.addEventListener("click", () => {
    const filter = card.dataset.filter;
    currentFilter = filter;
    filterTabs.forEach(t => t.classList.toggle("active", t.dataset.filter === filter));
    applyFilters();
    document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================================================
   Tombol-tombol WhatsApp umum (header, hero, cta, footer, float)
   ========================================================= */
const generalWaLink = buildWaLink();
["headerWaBtn", "heroWaBtn", "ctaWaBtn", "footerWaBtn", "floatWaBtn"].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.href = generalWaLink;
});

/* =========================================================
   Menu mobile
   ========================================================= */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mainNav.classList.remove("open"));
});

/* =========================================================
   Accordion FAQ
   ========================================================= */
document.querySelectorAll(".acc-item").forEach(item => {
  const trigger = item.querySelector(".acc-trigger");
  const panel = item.querySelector(".acc-panel");
  trigger.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".acc-item.open").forEach(openItem => {
      openItem.classList.remove("open");
      openItem.querySelector(".acc-panel").style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

/* =========================================================
   Modal detail produk — galeri foto (bisa >1 gambar) + spesifikasi lengkap
   ========================================================= */
const productModal = document.getElementById("productModal");
const modalMainImg = document.getElementById("modalMainImg");
const modalThumbs = document.getElementById("modalThumbs");
const modalCatTag = document.getElementById("modalCatTag");
const modalName = document.getElementById("modalName");
const modalVariantRow = document.getElementById("modalVariantRow");
const modalPrice = document.getElementById("modalPrice");
const modalSpecs = document.getElementById("modalSpecs");
const modalOrderBtn = document.getElementById("modalOrderBtn");

let modalProductId = null;
let modalImageIndex = 0;

// Kotak placeholder yang muncul kalau file foto belum ada / gagal dimuat
function imageFallbackHTML(){
  return `<div class="img-fallback">${ICONS.laptop}<span>Foto belum diupload</span></div>`;
}

function buildImageEl(src, className){
  const wrap = document.createElement("div");
  wrap.className = className;
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => { wrap.innerHTML = imageFallbackHTML(); }, { once: true });
  wrap.appendChild(img);
  return wrap;
}

function renderModal(){
  const p = PRODUCTS.find(x => x.id === modalProductId);
  if(!p) return;
  const { spec, price, condition } = getDisplayData(p);
  const images = (p.images && p.images.length) ? p.images : null;

  // Info dasar
  modalCatTag.textContent = CATEGORY_LABEL[p.category];
  modalName.textContent = p.name;
  modalPrice.textContent = formatRupiah(price);

  // Galeri: gambar utama
  modalMainImg.innerHTML = "";
  if(images){
    modalMainImg.appendChild(buildImageEl(images[modalImageIndex], "modal-main-inner"));
  } else {
    modalMainImg.innerHTML = imageFallbackHTML();
  }

  // Galeri: strip thumbnail (hanya tampil kalau lebih dari 1 foto)
  modalThumbs.innerHTML = "";
  if(images && images.length > 1){
    images.forEach((src, i) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "modal-thumb" + (i === modalImageIndex ? " active" : "");
      thumb.dataset.idx = i;
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Foto ${i + 1}`;
      img.addEventListener("error", () => { img.replaceWith(document.createTextNode(i + 1)); }, { once: true });
      thumb.appendChild(img);
      modalThumbs.appendChild(thumb);
    });
  }

  // Varian kondisi (kalau produk punya)
  if(p.variants){
    const activeIdx = activeVariant[p.id] || 0;
    modalVariantRow.innerHTML = `
      <div class="variant-row">
        ${p.variants.map((v, i) => `
          <button type="button" class="variant-chip ${i === activeIdx ? "active" : ""}" data-product-id="${p.id}" data-variant-idx="${i}">
            ${v.condition}
          </button>
        `).join("")}
      </div>`;
  } else {
    modalVariantRow.innerHTML = "";
  }

  // Spesifikasi: pakai daftar lengkap kalau ada, kalau tidak tampilkan spek singkat
  if(p.specs && p.specs.length){
    modalSpecs.innerHTML = `
      <dl class="spec-list">
        ${p.specs.map(s => `<div class="spec-row"><dt>${s.label}</dt><dd>${s.value}</dd></div>`).join("")}
      </dl>`;
  } else {
    modalSpecs.innerHTML = `<p class="modal-spec-fallback">${spec}</p>`;
  }

  // Tombol pesan
  modalOrderBtn.href = buildWaLink(condition ? `${p.name} (${condition})` : p.name, price);
}

function openProductModal(productId){
  modalProductId = productId;
  modalImageIndex = 0;
  renderModal();
  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductModal(){
  productModal.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeProductModal);
productModal.addEventListener("click", (e) => {
  if(e.target === productModal) closeProductModal();
});
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && productModal.classList.contains("open")) closeProductModal();
});

// Klik thumbnail -> ganti foto utama
modalThumbs.addEventListener("click", (e) => {
  const thumb = e.target.closest(".modal-thumb");
  if(!thumb) return;
  modalImageIndex = Number(thumb.dataset.idx);
  renderModal();
});

// Klik chip varian di dalam modal -> perbarui state global + render ulang modal & grid
modalVariantRow.addEventListener("click", (e) => {
  const chip = e.target.closest(".variant-chip");
  if(!chip) return;
  const { productId, variantIdx } = chip.dataset;
  activeVariant[productId] = Number(variantIdx);
  renderModal();
  applyFilters();
});

/* =========================================================
   Init — muat data dari products.json, baru render katalog
   ========================================================= */
/* =========================================================
   Produk terbaru untuk Hero
   ========================================================= */

/* =========================================================
   Produk terbaru pada Hero
   ========================================================= */

function renderLatestProducts() {

    const container = document.getElementById("latestProducts");

    if (!container || PRODUCTS.length === 0) {
        return;
    }

    // Urutkan berdasarkan tanggal rilis terbaru
    const latestProducts = [...PRODUCTS]
        .filter(product => product.releaseDate)
        .sort((a, b) => {
            return new Date(b.releaseDate) - new Date(a.releaseDate);
        })
        .slice(0, 3);

    container.innerHTML = latestProducts.map((product, index) => {

        return `
            <span class="chip chip-${index + 1}">
                ${product.name}
            </span>
        `;

    }).join("");
}


/* =========================================================
   Init — muat data dari products.json
   ========================================================= */

function loadProducts(){

    fetch("products.json")

        .then(res => {

            if(!res.ok) {
                throw new Error("HTTP " + res.status);
            }

            return res.json();

        })

        .then(data => {

            PRODUCTS = data;

            // Tampilkan produk terbaru di Hero
            renderLatestProducts();

            // Tampilkan katalog
            applyFilters();

        })

        .catch(err => {

            console.error("Gagal memuat products.json:", err);

            productGrid.innerHTML = "";

            emptyState.hidden = false;

            emptyState.textContent =
                "Gagal memuat data produk (products.json).";

        });
}

loadProducts();r