function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function faNum(value) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function toman(value) {
  return `${faNum(value)} تومان`;
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n\n+/)
    .filter(Boolean)
    .map((part) => `<p>${esc(part)}</p>`)
    .join("");
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function waLink(phoneIntl, text) {
  return `https://wa.me/${phoneIntl}?text=${encodeURIComponent(text)}`;
}

module.exports = { esc, faNum, toman, paragraphs, jsonLd, waLink };
