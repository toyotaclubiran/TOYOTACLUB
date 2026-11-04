const catalog = require("../../data/catalog");
const siteFile = require("../../data/site");
const { handleTorobRequest, verifyTorobToken } = require("../../src/torob");

function site() {
  return {
    ...siteFile,
    url: (process.env.PUBLIC_BASE_URL || siteFile.url).replace(/\/$/, ""),
    showPrices: process.env.SHOW_PRICES === "true" || siteFile.showPrices,
  };
}

exports.handler = async function handler(event) {
  const headers = { "content-type": "application/json; charset=utf-8" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "method not allowed" }) };
  }

  const token = event.headers["x-torob-token"] || event.headers["X-Torob-Token"];
  const host = event.headers.host || event.headers.Host || "";
  try {
    if (token) verifyTorobToken(token, host);
    else if (process.env.TOROB_REQUIRE_TOKEN === "true") {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "missing token" }) };
    }
  } catch (error) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "unauthorized" }) };
  }

  let body = {};
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
    body = raw ? JSON.parse(raw) : {};
  } catch (error) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "invalid json" }) };
  }

  const result = handleTorobRequest(body, catalog, site());
  return { statusCode: result.status, headers, body: JSON.stringify(result.body) };
};
