const fs = require('fs');
const path = require('path');

// SEO-шаблон страницы товара
function renderProductPage(product, products) {
    const similarProducts = products
        .filter(p => p.cat === product.cat && p._id !== product._id)
        .slice(0, 4);
    
    const similarHTML = similarProducts.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" width="200">
            <h3>${p.name}</h3>
            <p>${p.price} сомони</p>
            <a href="/product/${p._id || p.id}">Подробнее</a>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} — купить в ShopXand | Цена ${product.price} сомони</title>
    <meta name="description" content="${product.name} — купить в Таджикистане. ${product.desc || ''}. Цена: ${product.price} сомони. Доставка по Душанбе, Худжанду, Кулябу.">
    <meta property="og:title" content="${product.name} — ShopXand">
    <meta property="og:description" content="${product.desc || product.name}. Цена: ${product.price} с.">
    <meta property="og:image" content="${product.img}">
    <meta property="og:type" content="product">
    <meta property="product:price" content="${product.price}">
    <meta property="product:currency" content="TJS">
    <link rel="canonical" href="https://shopxand-3.onrender.com/product/${product._id || product.id}">
    
    <!-- Стили для поисковика (минимальные) -->
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .product-main { display: flex; gap: 20px; }
        .product-main img { max-width: 300px; height: auto; }
        .price { font-size: 24px; font-weight: bold; color: #0066ff; }
        .old-price { text-decoration: line-through; color: #999; }
        .specs { margin-top: 20px; }
        .specs table { width: 100%; border-collapse: collapse; }
        .specs td { padding: 8px; border-bottom: 1px solid #eee; }
        .similar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 30px; }
        h1 { font-size: 28px; }
        .breadcrumbs { margin-bottom: 15px; color: #666; }
        .breadcrumbs a { color: #0066ff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="breadcrumbs">
        <a href="/">Главная</a> → 
        <a href="/category/${encodeURIComponent(product.cat)}">${product.cat}</a> → 
        ${product.name}
    </div>
    
    <h1>${product.name}</h1>
    
    <div class="product-main">
        <img src="${product.img}" alt="${product.name}">
        <div>
            <p class="price">${product.price.toLocaleString()} сомони</p>
            ${product.oldPrice ? `<p class="old-price">${product.oldPrice.toLocaleString()} сомони</p>` : ''}
            <p>${product.desc || ''}</p>
            
            <div class="specs">
                <h3>Характеристики:</h3>
                <table>
                    ${product.material ? `<tr><td>Материал</td><td>${product.material}</td></tr>` : ''}
                    ${product.season ? `<tr><td>Сезон</td><td>${product.season}</td></tr>` : ''}
                    ${product.style ? `<tr><td>Стиль</td><td>${product.style}</td></tr>` : ''}
                    ${(product.sizes || []).length > 0 ? `<tr><td>Размеры</td><td>${product.sizes.join(', ')}</td></tr>` : ''}
                    ${(product.colors || []).length > 0 ? `<tr><td>Цвета</td><td>${product.colors.join(', ')}</td></tr>` : ''}
                </table>
            </div>
            
            <p>🚚 Доставка по Душанбе и Таджикистану</p>
            <p>📦 Срок доставки: 12-18 дней</p>
        </div>
    </div>
    
    ${similarHTML ? '<h2>Похожие товары</h2><div class="similar">' + similarHTML + '</div>' : ''}
    
    <!-- SPA подгружается после SEO-контента -->
    <script>
        // Перенаправляем на React приложение
        if (!window.location.search.includes('_escaped_fragment_')) {
            window.location.href = '/?product=' + '${product._id || product.id}';
        }
    </script>
</body>
</html>`;
}

// Главная страница для SEO
function renderHomePage(products) {
    const productsHTML = products.slice(0, 20).map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" width="150">
            <h3><a href="/product/${p._id || p.id}">${p.name}</a></h3>
            <p>${p.price} сомони</p>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>ShopXand — Интернет-магазин Таджикистана | Купить товары онлайн</title>
    <meta name="description" content="ShopXand — лучший интернет-магазин в Таджикистане. Купить ноутбуки, одежду, товары для дома с доставкой по Душанбе, Худжанду, Кулябу.">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { text-align: center; }
        .products-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; }
        .product-card { border: 1px solid #eee; padding: 10px; text-align: center; border-radius: 8px; }
        .product-card img { width: 100%; height: auto; }
        .product-card h3 { font-size: 14px; }
        .product-card a { text-decoration: none; color: #333; }
    </style>
</head>
<body>
    <h1>ShopXand — Интернет-магазин Таджикистана</h1>
    <p>Доставка из Китая в Душанбе за 12-20 дней</p>
    
    <div class="products-grid">
        ${productsHTML}
    </div>
    
    <script>
        if (!window.location.search.includes('_escaped_fragment_')) {
            window.location.href = '/';
        }
    </script>
</body>
</html>`;
}

module.exports = { renderProductPage, renderHomePage };