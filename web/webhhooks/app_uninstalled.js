import prisma from "../utils/prisma/index.js";

const appUninstallHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  console.log("appUninstallHandler",   topic);
  /** @type {webhookTopic} */
  const webhookBody = JSON.parse(webhookRequestBody);
  console.log("webhookBody", webhookBody);

  // Update store status and delete sessions in a transaction
  // await prisma.$transaction([
  //   prisma.stores.update({
  //     where: { shop },
  //     data: { isActive: false }
  //   }),
  //   prisma.session.deleteMany({
  //     where: { shop }
  //   })
  // ]);
};

export default appUninstallHandler;
