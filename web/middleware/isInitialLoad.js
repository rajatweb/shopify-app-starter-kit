import { RequestedTokenType } from "@shopify/shopify-api";
import shopify from "../shopify.js";
import sessionHandler from "../utils/shopify/sessionHandler.js";
import freshInstall from "../utils/shopify/freshInstall.js";
import prisma from "../utils/prisma/index.js";

const isInitialLoad = async (req, res, next) => {
  try {
    const shop = req.query.shop;
    const idToken = req.query.id_token;

    if (shop && idToken) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });
      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      });

      await sessionHandler.storeSession(offlineSession);
      await sessionHandler.storeSession(onlineSession);

      const webhookRegistrar = await shopify.webhooks.register({
        session: offlineSession,
      });

      const isFreshInstall = await prisma.stores.findUnique({
        where: {
          shop: onlineSession.shop,
        },
      });

      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        // !isFreshInstall -> New Install
        // isFreshInstall?.isActive === false -> Reinstall
        await freshInstall({ shop: onlineSession.shop, accessToken: onlineSession.accessToken, shopData: onlineSession.onlineAccessInfo?.associated_user });
      }

      console.dir(webhookRegistrar, { depth: null });
    }
    next();
  } catch (e) {
    console.error(`---> An error occured in isInitialLoad`, e);
    return res.status(403).send({ error: true });
  }
};

export default isInitialLoad;
