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

export function getProductImageUrl(product: ProductImageData, width = 600, height = 750): string {
  if (product.imageUrl) return product.imageUrl;

  const parts: string[] = [];
  if (product.color) parts.push(product.color);
  if (product.material) parts.push(product.material);
  if (product.categoryName) parts.push(product.categoryName);
  parts.push(product.name);
  if (product.brand) parts.push(`by ${product.brand}`);

  const basePrompt = parts.join(' ');
  const prompt = `${basePrompt}, fashion product photography, clean white background, professional e-commerce photo, centered, high quality`;

  // Deterministic seed from product id
  let seed = 0;
  for (let i = 0; i < product.id.length; i++) {
    seed = ((seed << 5) - seed) + product.id.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  const encodedPrompt = encodeURIComponent(prompt);
  return `https://enter.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}
