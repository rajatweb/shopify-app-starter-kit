import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });


import fs from 'fs';
import toml from '@iarna/toml';
import webhookWriter from './webhookWriter.js';
import path from 'path';


// Load environment variables
dotenv.config();

// Read the existing TOML file
const shopifyFilePath = path.join(process.cwd(), "./", "shopify.app.toml");
const tomlFile = fs.readFileSync(shopifyFilePath, 'utf-8');
const config = toml.parse(tomlFile);


let appUrl = process.env.SHOPIFY_APP_URL;
if (appUrl.endsWith("/")) {
    appUrl = appUrl.slice(0, -1);
}
// Globals
config.name = process.env.APP_NAME;
config.handle = process.env.APP_HANDLE;
config.client_id = process.env.SHOPIFY_API_KEY;
config.application_url = appUrl;
config.embedded = true;


// Auth
config.auth = {};
config.auth.redirect_urls = [`${appUrl}/api/`];

// Scopes
config.access_scopes = {};
config.access_scopes.scopes = process.env.SHOPIFY_API_SCOPES;
if (process.env.SHOPIFY_API_OPTIONAL_SCOPES?.trim()) {
    config.access_scopes.optional_scopes =
        process.env.SHOPIFY_API_OPTIONAL_SCOPES.split(",")
            .map((scope) => scope.trim())
            .filter(Boolean);
}
config.access_scopes.use_legacy_install_flow = false;

// Access
if (
    process.env.DIRECT_API_MODE &&
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
) {
    config.access = {};
    config.access.admin = {};
    process.env.DIRECT_API_MODE
        ? (config.access.admin.direct_api_mode = process.env.DIRECT_API_MODE)
        : null;
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
        ? (config.access.admin.embedded_app_direct_api_access =
            process.env.EMBEDDED_APP_DIRECT_API_ACCESS === "true")
        : null;
}

// Webhook event version to always match the app API version
config.webhooks = {};
config.webhooks.api_version = process.env.SHOPIFY_API_VERSION;


// Webhooks
webhookWriter(config);

// GDPR URLs
config.webhooks.privacy_compliance = {};
config.webhooks.privacy_compliance.customer_data_request_url = `${appUrl}/api/gdpr/customers_data_request`;
config.webhooks.privacy_compliance.customer_deletion_url = `${appUrl}/api/gdpr/customers_redact`;
config.webhooks.privacy_compliance.shop_deletion_url = `${appUrl}/api/gdpr/shop_redact`;

// App Proxy
if (
    process.env.APP_PROXY_PREFIX?.length > 0 &&
    process.env.APP_PROXY_SUBPATH?.length > 0
) {
    config.app_proxy = {};
    config.app_proxy.url = `${appUrl}/api/proxy_route`;
    config.app_proxy.prefix = process.env.APP_PROXY_PREFIX;
    config.app_proxy.subpath = process.env.APP_PROXY_SUBPATH;
}

// PoS
if (process.env.POS_EMBEDDED?.length > 1) {
    config.pos = {};
    config.pos.embedded = process.env.POS_EMBEDDED === "true";
}

//Build
config.build = {};
config.build.include_config_on_deploy = true;




// // Update only specific values from .env while preserving the rest
// if (process.env.SHOPIFY_CLIENT_ID) {
//     config.client_id = process.env.SHOPIFY_CLIENT_ID;
// }

// if (process.env.SHOPIFY_APP_URL) {
//     const baseUrl = process.env.SHOPIFY_APP_URL.replace(/\/$/, ''); // Remove trailing slash if present
//     config.application_url = baseUrl;

//     // Update redirect URLs with new HOST
//     config.auth = config.auth || {};
//     config.auth.redirect_urls = [
//         `${process.env.SHOPIFY_APP_URL}/auth/callback`,
//         `${process.env.SHOPIFY_APP_URL}/auth/shopify/callback`,
//         `${process.env.SHOPIFY_APP_URL}/api/auth/callback`
//     ];

//      // Update webhook configurations with full URLs
//     //  config.webhooks = config.webhooks || {};
//     //  config.webhooks = {
//     //      ...config.webhooks,
//     //      api_version: process.env.SHOPIFY_API_VERSION,
//     //      app_uninstalled: {
//     //          topics: ["app/uninstalled"],
//     //          uri: `${baseUrl}/api/webhooks/app_uninstalled`,
//     //      }
//     //  };
// }

// if (process.env.APP_NAME) {
//     config.name = process.env.APP_NAME;
// }

// if (process.env.SCOPES) {
//     config.access_scopes = config.access_scopes || {};
//     config.access_scopes.scopes = process.env.SCOPES;
// }

// if (process.env.DEV_STORE) {
//     config.build = config.build || {};
//     config.build.dev_store_url = process.env.DEV_STORE;
// }

// // Preserve existing webhooks and other configurations
// config.embedded = config.embedded || true;
// config.webhooks = config.webhooks || { api_version: "2024-10" };
// config.access = config.access || {};
// config.access.admin = config.access.admin || {
//     direct_api_mode: "online",
//     embedded_app_direct_api_access: true
// };

// Write the updated TOML file
fs.writeFileSync(shopifyFilePath, toml.stringify(config));
console.log('TOML file updated successfully'); 