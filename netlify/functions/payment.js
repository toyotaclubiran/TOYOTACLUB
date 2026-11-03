const payment = require("../../config/payment.json");

// Ready for Zarinpal or IDPay. No merchant credentials are stored in the repo.
// The storefront does not call this while prices are unpublished.
exports.handler = async function handler(event) {
  const headers = { "content-type": "application/json; charset=utf-8" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "method not allowed" }) };
  }
  const provider = process.env.PAYMENT_PROVIDER || payment.provider || "mock";
  const merchant = process.env.ZARINPAL_MERCHANT_ID || payment.zarinpal.merchantId;
  const apiKey = process.env.IDPAY_API_KEY || payment.idpay.apiKey;
  if (provider === "zarinpal" && !merchant) {
    return { statusCode: 501, headers, body: JSON.stringify({ error: "Zarinpal merchant id is empty" }) };
  }
  if (provider === "idpay" && !apiKey) {
    return { statusCode: 501, headers, body: JSON.stringify({ error: "IDPay api key is empty" }) };
  }
  return {
    statusCode: 501,
    headers,
    body: JSON.stringify({
      error: "Online payment stays off until product prices are published.",
      provider,
    }),
  };
};
