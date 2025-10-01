import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import products from './seed.json';
import { clearAllImages, uploadImage } from '@/utils/supabase';
const db = new PrismaClient();

async function main() {
  // Clear all product images in the storage
  // Clear products data
  await Promise.all([clearAllImages(), db.product.deleteMany({})]);

  for (const product of products) {
    const { extension, variants, ...singleProduct } = product;

    // Read image file as a Buffer
    const productName = singleProduct.name.toLowerCase().replaceAll(' ', '-');
    const filePath = path.resolve(
      '../public/seed',
      `${productName}.${extension}`
    );
    const fileContent = fs.readFileSync(filePath);
    // Upload images to supabase
    const url = await uploadImage(fileContent, productName);
    // Seed product data
    const { id: productId } = await db.product.create({
      data: { ...singleProduct, image: url },
      select: { id: true },
    });
    // Seed product variants data
    for (const variant of variants) {
      await db.productVariant.create({ data: { ...variant, productId } });
    }
  }
}
main()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
