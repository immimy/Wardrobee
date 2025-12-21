import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import seed from './seed.json' with {type: 'json'};

const adminId = process.env.ADMIN_ID!;

// Database (Data)
const db = new PrismaClient();
// Storage (Images)
const bucket = 'product';
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

const uploadImage = async (image:  Buffer, name: string) => {
  const timestamp = Date.now();
  const newName = `${timestamp}-${name}`;
  const { data } = await supabase.storage
    .from(bucket)
    .upload(newName, image, { cacheControl: '3600' });
  if (!data) throw new Error('Image upload failed');
  return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
};

const randomNumber = (min:number,max:number) => {
  return Math.floor(Math.random() * (max-min+1)) + min;
};


async function main() {
  await Promise.all([
    // Clear all data
    db.product.deleteMany({}),db.shippingAddress.deleteMany({}),db.cart.deleteMany({}),db.order.deleteMany({}),
    // Clear all product images in the Supabase's storage
    supabase.storage.emptyBucket('product')])

    // Seed data to the database
  const { products, addresses } = seed;
  // 1. Product
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
    // Create product & variants
    await db.product.create({
      data: {
        ...singleProduct,
        image: url,
        creatorId: adminId,
        variants: {
          createMany: {
            data: variants.map((item) => ({
              ...item,
              creatorId: adminId,
            })),
          },
        },
      },
    });
  }
  // 2. Address
  await db.shippingAddress.createMany({
    data: addresses.map((item) => ({ ...item, userId: adminId })),
  });

  const [dbProducts, dbAddresses] = await Promise.all([
    db.product.findMany({ include: { variants: true } }),
    db.shippingAddress.findMany({
      where: { userId: adminId },
    }),
  ]);
  // Place example orders (15 items)
  for(let i=0; i<15; i++){
    // Random shipping address
    const randomAddress= dbAddresses[randomNumber(0,dbAddresses.length-1)]
    const shippingAddress=[randomAddress.receiver, `(${randomAddress.phoneNumber})`, randomAddress.address].join(
    '\r\n'
  )
  // Create an order
  await db.order.create({data: {
      userId: adminId,
      shippingFee: 100,
      clientSecret: 'clientSecret',
      paymentIntentId: 'paymentIntentId',
      shippingAddress,
      orderItems: {createMany: {
        data: Array.from({ length: randomNumber(1,5) }, () => {
          // Random value
          // 1. Product
          const randomProduct = randomNumber(0,dbProducts.length-1);
          const product = dbProducts[randomProduct];
          // 2. Variant
          const randomVariant = randomNumber(0,product.variants.length-1);
          const variant = product.variants[randomVariant];
          // 3. Quantity
          const quantity = randomNumber(1,3);
          return {
            productId: product.id,
            productVariantId: variant.id,
            productImage: product.image,
            productName: product.name,
            productSize: variant.size,
            productColor: variant.color,
            price: product.price,
            discount: variant.discount,
            quantity,
            total: quantity * (product.price * (1 - variant.discount / 100)),
          };
        })
      }
      }}})
  
  }
}
main()
  .then(async () => {
    console.log('Seed data successfully!');
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
