const test = require('node:test');
const assert = require('node:assert/strict');
const pages = require('../src/pages');
const catalog = require('../data/catalog');
const site = require('../data/site');

for (const extension of ['jpg', 'png', 'webp']) {
  test(`uploaded ${extension} is the main image on both card and detail page`, () => {
    const image = `/images/products/new-upload.${extension}`;
    const old = '/images/products/old.jpg';
    const product = { ...catalog.products[0], image, images: [{ src: old }] };
    const files = new Set([image, old]);
    const detail = pages.renderProduct(site, catalog, files, product);
    const shop = pages.renderShop(site, { ...catalog, products: [product] }, files);
    assert.ok(detail.indexOf(`data-zoom="${image}"`) >= 0);
    assert.ok(detail.indexOf(`data-zoom="${image}"`) < detail.indexOf(`data-zoom="${old}"`));
    if (extension === 'webp') {
      assert.ok(shop.includes(`src="${image}"`));
      assert.ok(!shop.includes('new-upload-640.webp'));
    } else {
      assert.ok(shop.includes('src="/images/products/new-upload-640.webp"'));
    }
    const single = pages.renderProduct(site, catalog, files, { ...product, images: [] });
    assert.ok(single.includes(`data-zoom="${image}"`));
  });
}

test('missing main photo falls back to an existing gallery image', () => {
  const old = '/images/products/old.jpg';
  const product = { ...catalog.products[0], image: '/images/products/missing.jpg', images: [{ src: old }] };
  const detail = pages.renderProduct(site, catalog, new Set([old]), product);
  assert.ok(detail.includes(`data-zoom="${old}"`));
  assert.ok(!detail.includes('data-zoom="/images/products/missing.jpg"'));
});
