// Fetch products from the database
// const products = fetch('http://localhost:3000/api/products')
const products = {
    food: { gst: 20, products: [{ name: 'apple', rate: 150 }, { name: 'banana', rate: 100 }] },
    footwear: { gst: 15, products: [{ name: 'shoes', rate: 700 }, { name: 'socks', rate: 50 }] },
    electronics: { gst: 25, products: [{ name: 'phone', rate: 300 }, { name: 'charger', rate: 50 }] }
}
// const products = [{ name: 'apple', category: 'food', rate: 150, gst: 20 }, { name: 'shoes', category: 'footwear', rate: 700, gst: 15 }, { name: 'phone', category: 'electronics', rate: 300, gst: 25 }]; // Replace with your actual database fetch code
const categories = Object.keys(products);

// Populate the select element with categories
const categorySelect = document.getElementById('categorySelect');
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
});

// Populate the select element with products based on the selected category
const productSelect = document.getElementById('productSelect');

categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    productSelect.innerHTML = '';   // Clear previous options
    products[selectedCategory].products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productSelect.appendChild(option);
    });
});

// Trigger change event on categorySelect to display products of default selected category
categorySelect.dispatchEvent(new Event('change'));

function handleAddToCart(e) {
    const selectedCategory = categorySelect.value;
    const selectedProduct = productSelect.value;
    const quantity = document.getElementById('quantity').value || 1;

    // Find the selected product
    const product = products[selectedCategory].products.find(product => product.name === selectedProduct);
    const rate = product.rate;
    const gst = products[selectedCategory].gst;

    // Create a new row in the table
    const table = document.getElementById('cartTable');
    const newRow = table.insertRow();

    // Insert cells into the new row
    const productNameCell = newRow.insertCell();
    productNameCell.textContent = selectedProduct;

    const categoryCell = newRow.insertCell();
    categoryCell.textContent = selectedCategory;

    const quantityCell = newRow.insertCell();
    quantityCell.textContent = quantity;

    const rateCell = newRow.insertCell();
    rateCell.textContent = rate;

    const gstCell = newRow.insertCell();
    gstCell.textContent = gst;
}

function handleGenerateBill(e) {
    // Iterate over each row of the cartTable and calculate the amount
    const cartTable = document.getElementById('cartTable');
    const billTable = document.getElementById('billTable');
    billTable.innerHTML = '<tr><th> Product Name</th><th>Category</th><th>Quantity</th><th>Price</th><th>GST</th><th>Total</th></tr > ';   // Clear previous bill
    let totalAmount = 0

    for (let i = 1; i < cartTable.rows.length; i++) {
        const productName = cartTable.rows[i].cells[0].textContent;
        const quantity = cartTable.rows[i].cells[2].textContent || 1;
        const category = cartTable.rows[i].cells[1].textContent;
        const rate = cartTable.rows[i].cells[3].textContent;
        const gst = cartTable.rows[i].cells[4].textContent;
        const amount = quantity * rate;
        const gstAmount = (amount * gst) / 100;
        const productAmount = amount + gstAmount;

        totalAmount = totalAmount + productAmount;

        // Create a new row in the billTable
        const newRow = billTable.insertRow();

        // Insert cells into the new row
        const productNameCell = newRow.insertCell();
        productNameCell.textContent = productName;

        const categoryCell = newRow.insertCell();
        categoryCell.textContent = category;

        const quantityCell = newRow.insertCell();
        quantityCell.textContent = quantity;

        const rateCell = newRow.insertCell();
        rateCell.textContent = rate;

        const gstCell = newRow.insertCell();
        gstCell.textContent = gst;

        const gstAmountCell = newRow.insertCell();
        gstAmountCell.textContent = productAmount;

    }
    const totalAmountCell = document.getElementById('totalBill');
    totalAmountCell.textContent = totalAmount;

}

function handleAddProduct(e) {
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('categorySelect').value;
    const productRate = document.getElementById('productRate').value;

    const product = {
        name: productName,
        category: productCategory,
        rate: productRate,
    }

    // Make a POST request to the server with the product data
    fetch('http://localhost:3000/api/addproducts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
        });
}

function handleAddCategory(e) {
    const categoryName = document.getElementById('categoryName').value;
    const categoryGst = document.getElementById('categoryGst').value;
    const category = {
        name: categoryName,
        gst: categoryGst
    }

    // Make a POST request to the server with the product data
    fetch('http://localhost:3000/api/addcategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
        });
}
