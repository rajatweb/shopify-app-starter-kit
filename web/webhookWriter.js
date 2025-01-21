import shopify from "./shopify.js";

/**
 * @typedef {Object} ApiEndpoint
 * @property {string} topic - The API endpoint topic.
 * @property {string} graphql_topic - The topic's GraphQL topic name.
 * @property {string[]} scopes - The required scopes for accessing the endpoint.
 * @property {boolean} approval - Indicates if the endpoint requires approval from Shopify.
 * @property {boolean} pii - Indicates if the endpoint requires customer data access.
 */

const webhookWriter = (config) => {
    let subscriptionsArray = [];
    for (const entry in shopify.user.webhooks) {
        const subscription = {
            topics: shopify.user.webhooks[entry].topics,
            uri: shopify.user.webhooks[entry].url.startsWith("/api/webhooks/")
                ? `${process.env.SHOPIFY_APP_URL}${shopify.user.webhooks[entry].url}`
                : shopify.user.webhooks[entry].url,
        };

        if (shopify.user.webhooks[entry].include_fields) {
            subscription.include_fields = shopify.user.webhooks[entry].include_fields;
        }

        if (shopify.user.webhooks[entry].filter) {
            subscription.filter = shopify.user.webhooks[entry].filter;
        }

        subscriptionsArray.push(subscription);
    }

    config.webhooks.subscriptions = [...subscriptionsArray];
};

export default webhookWriter;