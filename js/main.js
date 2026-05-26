// menu data
const Menu = [
  {
    id: 1,
    name: es - jeruk,
    harga: 5,
    tersedia: true,
    gambar: url("Img/Es-jeruk.png"),
  },
  {
    id: 2,
    name: kopi,
    harga: 5,
    tersedia: true,
    gambar: url("Img/Es-Kopi2.png"),
  },
  {
    id: 3,
    name: es - coklat,
    harga: 5,
    tersedia: true,
    gambar: url("Img/Es-Kopi1.png"),
  },
  {
    id: 4,
    name: jus - jambu,
    harga: 5,
    tersedia: true,
    gambar: url("Img/JusJambu.png"),
  },
  {
    id: 5,
    name: es - kulkul,
    harga: 2,
    tersedia: true,
    gambar: url("Img/eskulkul.jpg"),
  },
  {
    id: 6,
    name: nanas,
    harga: 2,
    tersedia: true,
    gambar: url("Img/nanas.jpg"),
  },
  {
    id: 7,
    name: semangka,
    harga: 2,
    tersedia: false,
    gambar: url("Img/semangka.webp"),
  },
  {
    id: 8,
    name: risol - coklat,
    harga: 3,
    tersedia: false,
    gambar: url("Img/RisolCoklat.png"),
  },
  {
    id: 9,
    name: risol - matcha,
    harga: 3,
    tersedia: false,
    gambar: url("Img/risolmatcha.jpg"),
  },
  {
    id: 10,
    name: pie - susu,
    tersedia: false,
    gambar: url("Img/PieSusu.jpg"),
  },
  {
    id: 11,
    name: piscok,
    tersedia: false,
    gambar: url("Img/piscok.jpg"),
  },
  {
    id: 12,
    name: sosis,
    tersedia: true,
    gambar: url("Img/sosisbakar.png"),
  },
  {
    id: 13,
    name: nasi - bakar,
    harga: 8,
    tersedia: true,
    gambar: url("Img/nasibakar.jpg"),
  },
  {
    id: 14,
    name: Baso,
    harga: 10,
    tersedia: true,
    gambar: url("Img/Baso.png"),
  },
  {
    id: 15,
    name: mie,
    harga: 10,
    tersedia: false,
    gambar: url("Img/MieAyam.png"),
  },
];

class FoodItem {
  constructor({ id, nama, harga, tersedia }) {
    this.id = id;
    this.nama = nama;
    this.harga = harga;
    this.tersedia = tersedia;
  }

  get textHarga() {
    return `${this.harga}k`;
  }

  toCardHTML() {
    const unavailableClass = this.tersedia ? "" : "food-card--unavailable";
    const disabledAttr = this.tersedia ? "" : "disabled";
    const oosOverlay = this.tersedia
      ? ""
      : `
      <div class="food-oos-overlay">Habis</div>
    `;

    return `
        <div class="food-card ${unavailableClass}" data-id="${this.id}">
            <div class="food-img-wrap">
                <span class="food-emoji">${this.emoji}</span>
                ${oosOverlay}
            </div>
            <div class="food-details">
              <div class="food-name-row">
                <span class="food-name">${this.name}</span>
                <button class="add-btn" data-id="${this.id}" ${disabledAttr} title="Tambah ke pesanan">+</button>
              </div>
              <span class="food-price">${this.priceText}</span>
            </div>
        </div>
    `.trim();
  }
}

class CartItem {
  constructor(FoodItem, qty = 1) {
    this.food = FoodItem;
    this.qty = qty;
  }
}

let belanjaan = [];

const searchBar = document.getElementById("searchBar");
const hasilPencarian = document.getElementById("hasilPencarian");

function keranjangBelanja() {}

// search makanan
function filter() {
  return Menu.filter();
}
