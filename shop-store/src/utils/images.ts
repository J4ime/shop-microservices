export interface ProductImageData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  hasImage?: boolean;
  brand?: string;
  color?: string;
  material?: string;
  categoryName?: string;
  gender?: string;
}

const API_BASE = 'http://localhost:5000';

// Map Spanish colors to English for better LoremFlickr results
const colorMap: Record<string, string> = {
  'Blanco': 'white', 'Negro': 'black', 'Azul': 'blue', 'Rojo': 'red', 'Roja': 'red',
  'Rosa': 'pink', 'Beige': 'beige', 'Gris': 'grey', 'Verde': 'green',
  'Amarillo': 'yellow', 'Naranja': 'orange', 'Morado': 'purple',
  'Marron': 'brown', 'Marrón': 'brown', 'Dorado': 'gold', 'Plateado': 'silver',
};

// Map category to English clothing keywords for LoremFlickr
const categoryKeywords: Record<string, string> = {
  'Camisetas': 't-shirt,clothing',
  'Pantalones': 'pants,jeans,trousers',
  'Vestidos': 'dress,fashion',
  'Chaquetas': 'jacket,outerwear,coat',
  'Zapatos': 'shoes,footwear,sneakers',
  'Accesorios': 'fashion-accessory,hat,cap,bag',
  'Ropa Deportiva': 'sportswear,activewear,fitness',
  'Ropa Infantil': 'kids-clothing,children-fashion',
};

function normalizeText(text?: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

export function getProductImageUrl(product: ProductImageData, width = 600, height = 750): string {
  // If the backend has an uploaded image, serve it directly from the API
  if (product.hasImage) {
    return `${API_BASE}/api/products/${product.id}/image`;
  }

  // Fallback to legacy ImageUrl if set
  if (product.imageUrl) return product.imageUrl;

  // Build deterministic seed from product id so the same product always gets the same image
  let seed = 0;
  for (let i = 0; i < product.id.length; i++) {
    seed = ((seed << 5) - seed) + product.id.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  const colorEn = colorMap[product.color || ''] || normalizeText(product.color);
  const catKeywords = categoryKeywords[product.categoryName || ''] || 'fashion,clothing';

  const extra = product.material
    ? normalizeText(product.material).replace(/sintetico/, 'synthetic')
    : '';

  const keywords = [catKeywords, colorEn, extra]
    .filter(Boolean)
    .join(',');

  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keywords)}?lock=${seed}`;
}
