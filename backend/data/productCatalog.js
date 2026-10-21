
const products = [
  { id: "1", name: "Celeste Gold Ring", category: "Rings", price: 24999 },
  { id: "2", name: "Élan Pearl Necklace", category: "Necklaces", price: 18499 },
  { id: "3", name: "Luna Gold Earrings", category: "Earrings", price: 12999 },
  { id: "4", name: "Serene Gold Bracelet", category: "Bracelets", price: 21999 },
  { id: "5", name: "Aurora Diamond Ring", category: "Rings", price: 54999 },
  { id: "6", name: "Pearl Grace Necklace", category: "Necklaces", price: 28999 },
  { id: "7", name: "Seraphina Diamond Earrings", category: "Earrings", price: 39999 },
  { id: "8", name: "Elara Silver Bracelet", category: "Bracelets", price: 9999 },
  { id: "9", name: "Amara Gold Necklace", category: "Necklaces", price: 32999 },
  { id: "10", name: "Isla Pearl Earrings", category: "Earrings", price: 14999 },
  { id: "11", name: "Valentina Gold Ring", category: "Rings", price: 27999 },
  { id: "12", name: "Elysia Silver Necklace", category: "Necklaces", price: 11999 },
];

const productCatalog = new Map(
  products.map((product) => [product.id, product])
);

module.exports = productCatalog;
