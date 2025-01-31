import PouchDB from "pouchdb";
import MemoryAdapter from "pouchdb-adapter-memory";

PouchDB.plugin(MemoryAdapter);

let db = new PouchDB("goods", { adapter: "memory" });

const goodsData = [
  {
    _id: '1',
    title: "Mechanical Gaming Keyboard",
    description: "RGB backlit, Cherry MX Blue switches, Full size",
    amount: 129.99,
    currency: "AUD",
    category: "keyboard",
    image: "/images/keyboard.jpg"
  },
  {
    _id: '2',
    title: "Wireless Gaming Mouse",
    description: "25K DPI, RGB, 7 programmable buttons",
    amount: 89.99,
    currency: "AUD",
    category: "mouse",
    image: "/images/mouse.jpg"
  },
  {
    _id: '3',
    title: "Gaming Headset",
    description: "7.1 Surround Sound, Noise Cancelling Mic",
    amount: 149.99,
    currency: "AUD",
    category: "audio",
    image: "/images/headset.jpg"
  },
  {
    _id: '4',
    title: "4K Gaming Monitor",
    description: "27-inch, 144Hz, 1ms response time, HDR",
    amount: 599.99,
    currency: "AUD",
    category: "monitor",
    image: "/images/monitor.jpg"
  },
  {
    _id: '5',
    title: "Gaming Mouse Pad",
    description: "XL size, RGB edges, Anti-slip base",
    amount: 39.99,
    currency: "AUD",
    category: "accessories",
    image: "/images/mousepad.jpg"
  },
  {
    _id: '6',
    title: "Webcam 4K",
    description: "Auto focus, Built-in mic, Privacy cover",
    amount: 199.99,
    currency: "AUD",
    category: "camera",
    image: "/images/webcam.jpg"
  },
  {
    _id: '7',
    title: "USB Microphone",
    description: "Studio quality, RGB lighting, Plug & Play",
    amount: 159.99,
    currency: "AUD",
    category: "audio",
    image: "/images/microphone.jpg"
  },
  {
    _id: '8',
    title: "Mechanical Numpad",
    description: "Cherry MX Brown switches, Programmable",
    amount: 49.99,
    currency: "AUD",
    category: "keyboard",
    image: "/images/numpad.jpg"
  },
  {
    _id: '9',
    title: "Gaming Controller",
    description: "Wireless, Rechargeable, Compatible with PC/Console",
    amount: 79.99,
    currency: "AUD",
    category: "controller",
    image: "/images/controller.jpg"
  },
  {
    _id: '10',
    title: "Capture Card",
    description: "1080p 60fps, USB 3.0, Low latency",
    amount: 169.99,
    currency: "AUD",
    category: "streaming",
    image: "/images/capture-card.jpg"
  },
  {
    _id: '11',
    title: "Stream Deck",
    description: "15 LCD keys, Customizable buttons",
    amount: 249.99,
    currency: "AUD",
    category: "streaming",
    image: "/images/stream-deck.jpg"
  },
  {
    _id: '12',
    title: "Gaming Chair",
    description: "Ergonomic design, Lumbar support, Reclining",
    amount: 299.99,
    currency: "AUD",
    category: "furniture",
    image: "/images/gaming-chair.jpg"
  },
  {
    _id: '13',
    title: "Desk Mat",
    description: "900x400mm, Water-resistant, Non-slip",
    amount: 34.99,
    currency: "AUD",
    category: "accessories",
    image: "/images/desk-mat.jpg"
  },
  {
    _id: '14',
    title: "Cable Management Kit",
    description: "Sleeves, Clips, and Ties, Complete set",
    amount: 29.99,
    currency: "AUD",
    category: "accessories",
    image: "/images/cable-kit.jpg"
  },
  {
    _id: '15',
    title: "Monitor Stand",
    description: "Dual monitor, Adjustable height, Cable management",
    amount: 89.99,
    currency: "AUD",
    category: "accessories",
    image: "/images/monitor-stand.jpg"
  }
].map(item => ({
  ...item,
  _id: item._id.toString()
}));

// Initialize database
async function initDB() {
  try {
    await db.destroy();
    db = new PouchDB("goods", { adapter: "memory" });
    const result = await db.bulkDocs(goodsData);
    console.log('DB initialized with', result.length, 'items');
    return result;
  } catch (err) {
    console.error('Error initializing DB:', err);
    return [];
  }
}

// Get all goods
async function getAllGoods() {
  try {
    const result = await db.allDocs({
      include_docs: true
    });
    console.log('Found', result.rows.length, 'items in DB');
    return result.rows.map(row => ({
      id: row.id,
      ...row.doc
    }));
  } catch (err) {
    console.error('Error getting goods:', err);
    return [];
  }
}

// Initialize DB on module load
initDB();

// Export functions
export { initDB, getAllGoods };
