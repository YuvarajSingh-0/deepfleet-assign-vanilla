// defining a global variable to store the products from the database
let productsFromDB = [];

const productSelect = document.getElementById('productSelect');
const categorySelect = document.getElementById('categorySelect');
// Fetch categories from the database
async function fetchCategories() {
    const response = await fetch('http://localhost:3000/api/categories');
    const categories = await response.json();
    return categories;
}

// Populate the select element with categories
async function populateCategories() {
    const categories = await fetchCategories();
    console.log(categories);
    
    // Populate the select element with categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

populateCategories();

// Fetch products from the database
async function fetchProducts(category) {
    const response = await fetch(`http://localhost:3000/api/products?category=${category}`);
    const products = await response.json();
    return products;
}


// Populate the select element with products based on the selected category
async function populateProducts(category) {
    productsFromDB = await fetchProducts(category);
    console.log(productsFromDB, "products");
    productSelect.innerHTML = '';   // Clear previous options

    // Populate the select element with products
    productsFromDB.forEach(product => {
        const option = document.createElement('option');
        option.value = product.product;
        option.textContent = product.product;
        productSelect.appendChild(option);
    });
}


// Add event listener to categorySelect to populate products when the category is changed
categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    populateProducts(selectedCategory);
});

// Trigger change event on categorySelect to display products of default selected category on page load
categorySelect.dispatchEvent(new Event('change'));

// handleAddToCart function to add the selected product to the cart
async function handleAddToCart(e) {
    const selectedCategory = categorySelect.value;
    const selectedProduct = productSelect.value;
    const quantity = document.getElementById('quantity').value || 1;

    // Find the selected product form all the products of selected category
    const products = productsFromDB;
    const product = products.find(product => product.product === selectedProduct);
    const rate = product.rate;
    const gst = product.gst;

    const table = document.getElementById('cartTable');

    // check if the product is already added to the cart
    for (let i = 1; i < table.rows.length; i++) {
        const productName = table.rows[i].cells[0].textContent;

        // If the product is already added, update the quantity
        if (productName === selectedProduct) {
            const quantityCell = table.rows[i].cells[2];
            quantityCell.textContent = Number(quantityCell.textContent) + Number(quantity);
            return;
        }
    }

    // Create a new row in the table if the product is not already added
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

// generateBill function to calculate the total amount and display the bill
function handleGenerateBill(e) {
    const cartTable = document.getElementById('cartTable');
    const billTable = document.getElementById('billTable');
    billTable.innerHTML = '<tr><th> Product Name</th><th>Category</th><th>Quantity</th><th>Price</th><th>GST</th><th>Total</th></tr > ';   // Clear previous bill
    let totalAmount = 0 // total amount of cart items
    
    // Iterate over each row of the cartTable and calculate the amount
    for (let i = 1; i < cartTable.rows.length; i++) {
        const productName = cartTable.rows[i].cells[0].textContent;
        const quantity = cartTable.rows[i].cells[2].textContent || 1;
        const category = cartTable.rows[i].cells[1].textContent;
        const rate = cartTable.rows[i].cells[3].textContent;
        const gst = cartTable.rows[i].cells[4].textContent;
        const amount = quantity * rate; // amount without gst
        const gstAmount = (amount * gst) / 100;   // gst amount
        const productAmount = amount + gstAmount; // amount with gst

        totalAmount = totalAmount + productAmount; // total amount of cart items

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

    // Display the total amount
    const totalAmountCell = document.getElementById('totalBill');
    totalAmountCell.textContent = totalAmount;

}

// handleAddProduct function to add a new product to the database
function handleAddProduct(e) {
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('categorySelect').value;
    const productRate = document.getElementById('productRate').value;

    // Check if all the fields are filled
    if (productName === '' || productCategory === '' || productRate === '') {
        alert("Please fill all the details");
        return;
    }

    // Create a product object with the data
    const product = {
        name: productName,
        category: productCategory,
        rate: productRate,
    }

    // Make a POST request to the server with the product data
    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json()).then(data => {
            alert("Product Added Successfully");
        })
        .catch(error => {
            console.error(error);
        });
}

// handleAddCategory function to add a new category to the database
function handleAddCategory(e) {
    const categoryName = document.getElementById('categoryName').value;
    const categoryGst = document.getElementById('categoryGst').value;

    // Check if all the fields are filled
    if (categoryName === '' || categoryGst === '') {
        alert("Please fill all the details");
        return;
    }
    const category = {
        name: categoryName,
        gst: categoryGst
    }

    // Make a POST request to the server with the product data
    fetch('http://localhost:3000/api/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(response => response.json()).then(data => {
            alert("Category Added Successfully");
        })
        .catch(error => {
            console.error(error);
        });
}
