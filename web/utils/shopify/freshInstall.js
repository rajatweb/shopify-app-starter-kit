/**
 *
 * It's relatively easy to overload this function that will result in a long first open time.
 * If something can happen in the background, don't `await FreshInstall()` and instead just
 * `FreshInstall()` in isInitialLoad function.
 *
 */

import prisma from "../prisma/index.js";
const freshInstall = async ({ shop, accessToken, shopData = {} }) => {
  console.log("This is a fresh install - run functions");
  
  await prisma.stores.upsert({
    where: {
      shop: shop,
    },
    update: {
      isActive: true,
      accessToken: accessToken,
      shopDomain: shop,
      shopId: shopData.shopId || null,
      shopName: shopData.shopName || null,
      email: shopData.email || null,
      updatedAt: new Date(),
    },
    create: {
      shop: shop,
      shopDomain: shop,
      accessToken: accessToken,
      shopId: shopData.shopId || null,
      shopName: shopData.shopName || null,
      email: shopData.email || null,
      isActive: true,
    },
  });
};

export default freshInstall;