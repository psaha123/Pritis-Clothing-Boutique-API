document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const addProductForm = document.getElementById('add-product-form');

    // Function to fetch products
    const fetchProducts = async (query = '') => {
        try {
            const response = await fetch(`/api/products${query ? `?search=${query}` : ''}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
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
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Search products on input change
    searchInput.addEventListener('input', () => {
        fetchProducts(searchInput.value);
    });

    // Add new product form submission
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

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            fetchProducts(); // Refresh product list
            addProductForm.reset(); // Clear form inputs
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Initial fetch of products
    fetchProducts();
});
