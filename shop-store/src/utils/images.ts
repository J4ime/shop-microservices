export interface ProductImageData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  brand?: string;
  color?: string;
  material?: string;
  categoryName?: string;
  gender?: string;
}

const categoryKeywords: Record<string, string> = {
  'Camisetas': 't-shirt,apparel',
  'Pantalones': 'pants,trousers',
  'Vestidos': 'dress,fashion',
  'Chaquetas': 'jacket,outerwear',
  'Zapatos': 'shoes,footwear',
  'Accesorios': 'fashion-accessory',
  'Ropa Deportiva': 'sportswear,activewear',
  'Ropa Infantil': 'kids-clothing,children-fashion',
};

export function getProductImageUrl(product: ProductImageData, width = 600, height = 750): string {
  if (product.imageUrl) return product.imageUrl;

  // Build deterministic seed from product id so the same product always gets the same image
  let seed = 0;
  for (let i = 0; i < product.id.length; i++) {
    seed = ((seed << 5) - seed) + product.id.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  // Use category-mapped keywords for relevant clothing images
  const keywords = categoryKeywords[product.categoryName || ''] || 'fashion,clothing';
  return `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keywords)}?lock=${seed}`;
}
