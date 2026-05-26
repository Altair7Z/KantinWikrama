// ================= MENU DATA =================

const Menu = [
  {
    id: 1,
    name: "es jeruk",
    harga: 5,
    tersedia: true,
    gambar: "Img/Es-jeruk.png",
  },
  {
    id: 2,
    name: "kopi",
    harga: 5,
    tersedia: true,
    gambar: "Img/Es-Kopi2.png",
  },
  {
    id: 3,
    name: "es coklat",
    harga: 5,
    tersedia: true,
    gambar: "Img/Es-Kopi1.png",
  },
  {
    id: 4,
    name: "jus jambu",
    harga: 5,
    tersedia: true,
    gambar: "Img/JusJambu.png",
  },
  {
    id: 5,
    name: "es kulkul",
    harga: 2,
    tersedia: true,
    gambar: "Img/eskulkul.jpg",
  },
  {
    id: 6,
    name: "nanas",
    harga: 2,
    tersedia: true,
    gambar: "Img/nanas.jpg",
  },
  {
    id: 7,
    name: "semangka",
    harga: 2,
    tersedia: false,
    gambar: "Img/semangka.webp",
  },
  {
    id: 8,
    name: "risol coklat",
    harga: 3,
    tersedia: false,
    gambar: "Img/RisolCoklat.png",
  },
  {
    id: 9,
    name: "risol matcha",
    harga: 3,
    tersedia: false,
    gambar: "Img/risolmatcha.jpg",
  },
  {
    id: 10,
    name: "pie susu",
    harga: 3,
    tersedia: false,
    gambar: "Img/PieSusu.jpg",
  },
  {
    id: 11,
    name: "piscok",
    harga: 2,
    tersedia: true,
    gambar: "Img/piscok.jpg",
  }
];

// ================= CLASS =================

class FoodItem {
  constructor({ id, name, harga, tersedia, gambar }) {
    this.id = id;
    this.name = name;
    this.harga = harga;
    this.tersedia = tersedia;
    this.gambar = gambar;
  }

  get textHarga() {
    return `${this.harga}k`;
  }

  toCardHTML() {
    const unavailableClass = this.tersedia ? "" : "food-card--unavailable";
    const disabledAttr = this.tersedia ? "" : "disabled";
    const oosOverlay = this.tersedia ? "" : `<div class="food-oos-overlay">Habis</div>`;

    return `
      <div class="food-card ${unavailableClass}">
        <div class="food-img-wrap">
          <img src="${this.gambar}" alt="${this.name}">
          ${oosOverlay}
        </div>
        <div class="food-details">
          <div class="food-name-row">
            <div>
              <div class="food-name">${this.name}</div>
              <div class="food-price">${this.textHarga}</div>
            </div>
            <button class="add-btn" data-id="${this.id}" ${disabledAttr}>+</button>
          </div>
        </div>
      </div>
    `;
  }
}

class CartItem {
  constructor(food, qty = 1) {
    this.food = food;
    this.qty = qty;
  }
}

// ================= ELEMENT =================

const hasilPencarian = document.getElementById("hasilPencarian");
const listPesanan = document.getElementById("listPesanan");
const totalHarga = document.getElementById("totalHarga");

// ================= DATA =================

const makanan = Menu.map(item => new FoodItem(item));
let keranjang = [];

// ================= SIDEBAR MINIMIZE FUNCTION =================

let isSidebarCollapsed = false;

function updateSidebarBadge() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && keranjang.length > 0) {
    const totalItems = keranjang.reduce((sum, item) => sum + item.qty, 0);
    sidebar.setAttribute("data-badge", totalItems);
  } else if (sidebar) {
    sidebar.setAttribute("data-badge", "0");
  }
}

function toggleSidebar(forceExpand = false) {
  const sidebar = document.querySelector(".sidebar");
  const arrowBtn = document.querySelector(".arrow-btn");
  
  if (!sidebar) return;
  
  if (forceExpand && isSidebarCollapsed) {
    // Force expand (dipanggil saat ada pesanan masuk)
    sidebar.classList.remove("sidebar--collapsed");
    isSidebarCollapsed = false;
    if (arrowBtn) arrowBtn.innerHTML = "›";
    document.querySelector(".content-area")?.classList.remove("sidebar-collapsed");
    showToast("Sidebar dibuka kembali 📋", 1000);
  } else if (!forceExpand) {
    // Toggle normal
    sidebar.classList.toggle("sidebar--collapsed");
    isSidebarCollapsed = sidebar.classList.contains("sidebar--collapsed");
    if (arrowBtn) arrowBtn.innerHTML = isSidebarCollapsed ? "‹" : "›";
    
    if (isSidebarCollapsed) {
      document.querySelector(".content-area")?.classList.add("sidebar-collapsed");
      showToast("Sidebar diminimize", 800);
    } else {
      document.querySelector(".content-area")?.classList.remove("sidebar-collapsed");
      showToast("Sidebar dimaksimalkan", 800);
    }
  }
  
  updateSidebarBadge();
}

// ================= TAMPIL MENU =================

function tampilkanMenu(data) {
  if (data.length === 0) {
    hasilPencarian.innerHTML = `
      <div class="empty-state">
        <span>🍽️</span>
        <p>Tidak ada menu ditemukan</p>
      </div>
    `;
    return;
  }
  
  hasilPencarian.innerHTML = data.map(item => item.toCardHTML()).join("");
  pasangButtonTambah();
}

// ================= TAMPIL MENU HABIS =================
function tampilkanMenuHabis() {
  const menuHabis = makanan.filter(item => !item.tersedia);
  tampilkanMenu(menuHabis);
}

// ================= TAMPIL MENU TERSEDIA =================
function tampilkanMenuTersedia() {
  tampilkanMenu(makanan.filter(item => item.tersedia));
}

// ================= TAMBAH PESANAN =================

function pasangButtonTambah() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const makananDipilih = makanan.find(item => item.id === id);

      if (!makananDipilih.tersedia) {
        showToast(`${makananDipilih.name} sedang habis!`);
        return;
      }

      const sudahAda = keranjang.find(item => item.food.id === id);

      if (sudahAda) {
        sudahAda.qty++;
        showToast(`${makananDipilih.name} +1 (total ${sudahAda.qty} pcs)`);
      } else {
        keranjang.push(new CartItem(makananDipilih));
        showToast(`${makananDipilih.name} ditambahkan ke keranjang`);
      }

      renderKeranjang();
      updateSidebarBadge();
      
      // EXPAND SIDEBAR OTOMATIS saat ada pesanan masuk
      if (isSidebarCollapsed) {
        toggleSidebar(true); // Force expand
      }
      
      // Update pembayaran jika tab pembayaran aktif
      const pembayaranTab = document.querySelector('.tab-menu button[data-tab="pembayaran"]');
      if (pembayaranTab && pembayaranTab.classList.contains('active')) {
        renderPembayaran();
      }
    };
  });
}

// ================= RENDER KERANJANG =================

function renderKeranjang() {
  if (keranjang.length === 0) {
    listPesanan.innerHTML = `
      <div class="empty-cart">
        🛒<br/>
        Belum ada pesanan<br/>
        <span style="font-size: 11px;">Klik + untuk menambah menu</span>
      </div>
    `;
    totalHarga.innerText = "0k";
    updateSidebarBadge();
    return;
  }

  // Header keranjang
  let html = `
    <div class="cart-header">
      <span>Menu</span>
      <span style="text-align: center;">Jumlah</span>
      <span style="text-align: right;">Total</span>
    </div>
  `;

  // Loop semua item di keranjang
  keranjang.forEach((item, index) => {
    const itemTotal = item.food.harga * item.qty;
    
    html += `
      <div class="item" data-cart-index="${index}">
        <div class="item-info">
          <div class="item-name">${item.food.name}</div>
          <div class="item-detail">
            <span>${item.food.textHarga}/pcs</span>
          </div>
        </div>
        <div class="item-controls">
          <button class="qty-btn minus" data-id="${item.food.id}">−</button>
          <span class="item-qty">${item.qty}</span>
          <button class="qty-btn plus" data-id="${item.food.id}">+</button>
        </div>
        <div class="item-total-price">${itemTotal}k</div>
      </div>
    `;
  });

  listPesanan.innerHTML = html;
  
  const total = keranjang.reduce((total, item) => total + item.food.harga * item.qty, 0);
  totalHarga.innerText = `${total}k`;
  
  updateSidebarBadge();
  
  // Pasang event untuk tombol + dan - di keranjang
  pasangEventKeranjang();
}

// ================= EVENT UNTUK TOMBOL DI KERANJANG =================

function pasangEventKeranjang() {
  // Tombol MINUS (-)
  document.querySelectorAll(".qty-btn.minus").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const itemIndex = keranjang.findIndex(item => item.food.id === id);
      
      if (itemIndex !== -1) {
        if (keranjang[itemIndex].qty > 1) {
          keranjang[itemIndex].qty--;
          showToast(`${keranjang[itemIndex].food.name} -1 (${keranjang[itemIndex].qty} pcs tersisa)`);
        } else {
          const itemName = keranjang[itemIndex].food.name;
          keranjang.splice(itemIndex, 1);
          showToast(`🗑️ ${itemName} dihapus dari keranjang`);
        }
        renderKeranjang();
        
        // Update pembayaran jika tab pembayaran aktif
        const pembayaranTab = document.querySelector('.tab-menu button[data-tab="pembayaran"]');
        if (pembayaranTab && pembayaranTab.classList.contains('active')) {
          renderPembayaran();
        }
      }
    };
  });
  
  // Tombol PLUS (+)
  document.querySelectorAll(".qty-btn.plus").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const item = keranjang.find(item => item.food.id === id);
      
      if (item) {
        item.qty++;
        renderKeranjang();
        showToast(`${item.food.name} +1 (total ${item.qty} pcs) - ${item.food.harga * item.qty}k`);
        
        // Update pembayaran jika tab pembayaran aktif
        const pembayaranTab = document.querySelector('.tab-menu button[data-tab="pembayaran"]');
        if (pembayaranTab && pembayaranTab.classList.contains('active')) {
          renderPembayaran();
        }
      }
    };
  });
}

// ================= TOAST NOTIFICATION =================

function showToast(message, duration = 2000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add("toast--show");
  
  setTimeout(() => {
    toast.classList.remove("toast--show");
  }, duration);
}

// ================= SETUP BANNER =================

function setupBanner() {
  const bannerTersedia = document.querySelector(".banner-available");
  const bannerHabis = document.querySelector(".banner-oos");

  if (bannerTersedia) {
    const newBannerTersedia = bannerTersedia.cloneNode(true);
    bannerTersedia.parentNode.replaceChild(newBannerTersedia, bannerTersedia);
    
    newBannerTersedia.addEventListener("click", (e) => {
      e.stopPropagation();
      tampilkanMenuTersedia();
      showToast("Menampilkan menu yang tersedia 🍽️");
    });
  }

  if (bannerHabis) {
    const newBannerHabis = bannerHabis.cloneNode(true);
    bannerHabis.parentNode.replaceChild(newBannerHabis, bannerHabis);
    
    newBannerHabis.addEventListener("click", (e) => {
      e.stopPropagation();
      tampilkanMenuHabis();
      showToast("Menampilkan menu yang habis 😢");
    });
  }
}

// ================= SETUP SEARCH BAR =================

function setupSearchBar() {
  const searchInput = document.getElementById("searchBar");
  if (!searchInput) return;
  
  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    
    if (keyword === "") {
      tampilkanMenu(makanan);
    } else {
      const filtered = makanan.filter(item => item.name.toLowerCase().includes(keyword));
      tampilkanMenu(filtered);
    }
  });
}

// ================= RENDER PEMBAYARAN =================

function renderPembayaran() {
  const pembayaranPanel = document.getElementById("pembayaranPanel");
  const total = keranjang.reduce((total, item) => total + item.food.harga * item.qty, 0);
  const tax = Math.floor(total * 0.1);
  const grandTotal = total + tax;
  
  if (keranjang.length === 0) {
    pembayaranPanel.innerHTML = `
      <div class="payment-empty">
        <span>🛒</span>
        <p>Belum ada pesanan</p>
        <p style="font-size: 12px; margin-top: 8px;">Silahkan pilih menu terlebih dahulu</p>
      </div>
    `;
    return;
  }
  
  pembayaranPanel.innerHTML = `
    <div class="payment-summary">
      <h3>Detail Pembayaran</h3>
      <div class="payment-row">
        <span>Subtotal</span>
        <span>${total}k</span>
      </div>
      <div class="payment-row">
        <span>Pajak (10%)</span>
        <span>${tax}k</span>
      </div>
      <div class="payment-divider"></div>
      <div class="payment-row payment-total-row">
        <span>Total Bayar</span>
        <span>${grandTotal}k</span>
      </div>
      <button class="bayar-btn" id="bayarBtn">💰 Bayar Sekarang</button>
    </div>
  `;
  
  const bayarBtn = document.getElementById("bayarBtn");
  if (bayarBtn) {
    bayarBtn.onclick = () => {
      const nomorPesanan = document.getElementById("nomorPesanan");
      const randomNum = Math.floor(Math.random() * 50) + 1;
      nomorPesanan.innerText = `#${randomNum}`;
      
      const totalItems = keranjang.reduce((sum, item) => sum + item.qty, 0);
      showToast(`✅ Pesanan #${randomNum} (${totalItems} item) berhasil! Ambil di kantin ya 🎉`);
      
      keranjang = [];
      renderKeranjang();
      renderPembayaran();
      updateSidebarBadge();
      
      setTimeout(() => {
        const pesananTabBtn = document.querySelector('.tab-menu button[data-tab="pesanan"]');
        if (pesananTabBtn) pesananTabBtn.click();
      }, 1500);
    };
  }
}

// ================= SETUP TAB =================

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-menu button");
  const pesananTab = document.getElementById("pesananTab");
  const pembayaranPanel = document.getElementById("pembayaranPanel");
  
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const tabType = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      if (tabType === "pesanan") {
        pesananTab.style.display = "block";
        pembayaranPanel.style.display = "none";
        renderKeranjang();
      } else if (tabType === "pembayaran") {
        pesananTab.style.display = "none";
        pembayaranPanel.style.display = "block";
        renderPembayaran();
      }
    });
  });
  
  renderPembayaran();
}

// ================= SETUP TOGGLE SIDEBAR =================

function setupSidebarToggle() {
  const arrowBtn = document.querySelector(".arrow-btn");
  const sidebar = document.querySelector(".sidebar");
  
  if (arrowBtn && sidebar) {
    // Hapus event listener lama dengan clone
    const newArrowBtn = arrowBtn.cloneNode(true);
    arrowBtn.parentNode.replaceChild(newArrowBtn, arrowBtn);
    
    newArrowBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
    
    // Klik pada sidebar yang collapsed juga bisa expand
    sidebar.addEventListener("click", (e) => {
      if (sidebar.classList.contains("sidebar--collapsed") && 
          e.target !== newArrowBtn && 
          !newArrowBtn.contains(e.target)) {
        toggleSidebar();
      }
    });
  }
  
  updateSidebarBadge();
}

// ================= UPDATE TANGGAL =================

function updateDate() {
  const dateElement = document.getElementById("currentDate");
  if (dateElement) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    dateElement.textContent = today;
  }
}

// ================= RESIZE HANDLER =================

function setupResizeHandler() {
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 860 && isSidebarCollapsed) {
      // Di mobile, collapsed sidebar jadi floating
      document.querySelector(".sidebar")?.classList.add("sidebar--collapsed-mobile");
    } else {
      document.querySelector(".sidebar")?.classList.remove("sidebar--collapsed-mobile");
    }
  });
}

// ================= INITIALISASI =================

function init() {
  tampilkanMenu(makanan);
  renderKeranjang();
  setupBanner();
  setupSearchBar();
  setupTabs();
  setupSidebarToggle();
  setupResizeHandler();
  updateDate();
}

// Jalankan saat halaman siap
document.addEventListener("DOMContentLoaded", init);
// ========== FITUR SEARCH ==========

function setupSearchBar() {
  const searchInput = document.getElementById("searchBar");
  
  if (!searchInput) {
    console.log("Search bar tidak ditemukan");
    return;
  }
  
  searchInput.addEventListener("input", function(e) {
    const keyword = e.target.value.toLowerCase().trim();
    
    if (keyword === "") {
      // Tampilkan semua menu
      tampilkanMenu(makanan);
    } else {
      // Filter menu berdasarkan nama
      const filtered = makanan.filter(function(item) {
        return item.name.toLowerCase().includes(keyword);
      });
      tampilkanMenu(filtered);
    }
  });
}

// Panggil fungsi search
setupSearchBar();
// ========== FUNGSI TAMPIL MENU (jika belum ada) ==========

function tampilkanMenu(data) {
  const hasilPencarian = document.getElementById("hasilPencarian");
  
  if (!hasilPencarian) return;
  
  if (data.length === 0) {
    hasilPencarian.innerHTML = `
      <div class="empty-state">
        <span>🔍</span>
        <p>Menu tidak ditemukan</p>
        <p style="font-size: 12px;">Coba kata kunci lain</p>
      </div>
    `;
    return;
  }
  
  hasilPencarian.innerHTML = data.map(function(item) {
    return item.toCardHTML();
  }).join("");
  
  // Pasang ulang event tombol tambah
  pasangButtonTambah();
}
// ========== OVERRIDE PEMBAYARAN TANPA PAJAK ==========

// Simpan fungsi asli jika ada
const originalRenderPembayaran = window.renderPembayaran || function(){};

// Override fungsi renderPembayaran tanpa pajak
renderPembayaran = function() {
  const pembayaranPanel = document.getElementById("pembayaranPanel");
  
  if (!pembayaranPanel) return;
  
  const total = keranjang.reduce(function(total, item) {
    return total + (item.food.harga * item.qty);
  }, 0);
  
  // LANGSUNG PAKAI TOTAL, TANPA PAJAK
  const grandTotal = total;
  
  if (keranjang.length === 0) {
    pembayaranPanel.innerHTML = `
      <div class="payment-empty">
        <span>🛒</span>
        <p>Belum ada pesanan</p>
        <p style="font-size: 12px; margin-top: 8px;">Silahkan pilih menu terlebih dahulu</p>
      </div>
    `;
    return;
  }
  
  pembayaranPanel.innerHTML = `
    <div class="payment-summary">
      <h3>Detail Pembayaran</h3>
      <div class="payment-row">
        <span>Total Pesanan</span>
        <span>${total}k</span>
      </div>
      <div class="payment-divider"></div>
      <div class="payment-row payment-total-row">
        <span>Total Bayar</span>
        <span>${grandTotal}k</span>
      </div>
      <button class="bayar-btn" id="bayarBtn">💰 Bayar Sekarang</button>
    </div>
  `;
  
  const bayarBtn = document.getElementById("bayarBtn");
  if (bayarBtn) {
    bayarBtn.onclick = function() {
      const nomorPesanan = document.getElementById("nomorPesanan");
      const randomNum = Math.floor(Math.random() * 50) + 1;
      if (nomorPesanan) nomorPesanan.innerText = "#" + randomNum;
      
      const totalItems = keranjang.reduce(function(sum, item) {
        return sum + item.qty;
      }, 0);
      
      showToast("✅ Pesanan #" + randomNum + " (" + totalItems + " item) berhasil! Ambil di kantin ya 🎉");
      
      keranjang = [];
      renderKeranjang();
      renderPembayaran();
      
      setTimeout(function() {
        const pesananTabBtn = document.querySelector('.tab-menu button[data-tab="pesanan"]');
        if (pesananTabBtn) pesananTabBtn.click();
      }, 1500);
    };
  }
};