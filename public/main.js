document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const addProductForm = document.getElementById('add-product-form');

    // Fetch and display products
    const fetchProducts = async (query = '') => {
        const response = await fetch(`/api/products${query ? `?search=${query}` : ''}`);
        const products = await response.json();
        productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price}</p>
                    <p>Quantity: ${product.quantity}</p>
                </div>
            `;
            productList.appendChild(productItem);
        });
    };

    // Search products
    searchInput.addEventListener('input', () => {
        fetchProducts(searchInput.value);
    });

    // Add new product
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const image = document.getElementById('image').value;

        const newProduct = {
            name,
            price,
            quantity,
            image,
        };

        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        fetchProducts();
        addProductForm.reset();
    });

    // Initial fetch
    fetchProducts();
});
