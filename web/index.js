import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import '@shopify/shopify-api/adapters/node';
import shopify from "./shopify.js";
import webhookHandler from "./webhhooks/_index.js";

import sessionHandler from "./utils/shopify/sessionHandler.js";
import csp from "./middleware/csp.js";
import verifyRequest from "./middleware/verifyRequest.js";
import verifyHmac from "./middleware/verifyHmac.js";
import verifyProxy from "./middleware/verifyProxy.js";
import {
  customerDataRequest,
  customerRedact,
  shopRedact,
} from "./controllers/gdpr.js";

import { readFileSync } from "fs";
import express from "express";
import isInitialLoad from "./middleware/isInitialLoad.js";
import userRoutes from "./routes/index.js";
import proxyRouter from "./routes/app_proxy/index.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.disable("x-powered-by");

// Incoming webhook requests
app.post(
  "/api/webhooks/:webhookTopic*",
  express.text({ type: "*/*" }),
  webhookHandler
);

app.use(express.json());

app.post("/api/graphql", verifyRequest, async (req, res) => {
  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });
    const session = await sessionHandler.loadSession(sessionId);
    const response = await shopify.clients.graphqlProxy({
      session,
      rawBody: req.body,
    });
    res.status(200).send(response.body);
  } catch (e) {
    console.error(`---> An error occured at GraphQL Proxy`, e);
    res.status(403).send(e);
  }
});

app.use(csp);
app.use(isInitialLoad);

// If you're making changes to any of the routes, please make sure to add them in `./client/vite.config.js` or it'll not work.
app.use("/api/apps", verifyRequest, userRoutes); //Verify user route requests
app.use("/api/proxy_route", verifyProxy, proxyRouter); //MARK:- App Proxy routes

app.post("/api/gdpr/:topic", verifyHmac, async (req, res) => {
  const { body } = req;
  const { topic } = req.params;
  const shop = req.body.shop_domain;

  console.warn(`--> GDPR request for ${shop} / ${topic} recieved.`);

  let response;
  switch (topic) {
    case "customers_data_request":
      response = await customerDataRequest(topic, shop, body);
      break;
    case "customers_redact":
      response = await customerRedact(topic, shop, body);
      break;
    case "shop_redact":
      response = await shopRedact(topic, shop, body);
      break;
    default:
      console.error(
        "--> Congratulations on breaking the GDPR route! Here's the topic that broke it: ",
        topic
      );
      response = "broken";
      break;
  }

  if (response.success) {
    res.status(200).send();
  } else {
    res.status(403).send("An error occured");
  }
});


app.use("/*", async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
