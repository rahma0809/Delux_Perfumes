const API_URL = 'http://localhost:3000'; 

// ===== Dashboard Stats =====
async function loadDashboard() {
    try {
        // Load orders from file-based API
        const ordersRes = await fetch(`${API_URL}/orders`);
        const ordersData = await ordersRes.json();
        
        // Load products from MongoDB API
        const productsRes = await fetch(`${API_URL}/api/products`);
        const products = await productsRes.json();
        
        // Load users from MongoDB API
        const usersRes = await fetch(`${API_URL}/api/users`);
        const users = await usersRes.json();
        
      
        const orders = ordersData.success ? ordersData.orders : [];
        
        if (document.getElementById('totalProducts')) {
            document.getElementById('totalProducts').textContent = products.length || 0;
        }
        if (document.getElementById('totalOrders')) {
            document.getElementById('totalOrders').textContent = orders.length || 0;
        }
        if (document.getElementById('totalUsers')) {
            document.getElementById('totalUsers').textContent = users.length || 0;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        // Fallback to 0s
        document.getElementById('totalProducts')?.textContent = 0;
        document.getElementById('totalOrders')?.textContent = 0;
        document.getElementById('totalUsers')?.textContent = 0;
    }
}

// ===== Delete Product =====
async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
        await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
        loadProducts(); 
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
}

// ===== Orders Page =====
async function loadOrders() {
    const table = document.getElementById('ordersTable');
    if (!table) return;

    try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        
        const orders = data.success ? data.orders : [];
        
        table.innerHTML = `
            <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total (AED)</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
        `;

        if (orders.length === 0) {
            const row = table.insertRow();
            row.innerHTML = `<td colspan="7" style="text-align:center; padding:20px;">No orders found</td>`;
            return;
        }

        orders.forEach(order => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${order.id || 'N/A'}</td>
                <td>${order.customer || 'Guest'}</td>
                <td>${order.email || 'N/A'}</td>
                <td>${order.phone || 'N/A'}</td>
                <td>${order.total ? 'AED ' + order.total.toFixed(2) : 'N/A'}</td>
                <td>
                    <span class="status-badge status-${order.status ? order.status.toLowerCase() : 'pending'}">
                        ${order.status || 'Pending'}
                    </span>
                </td>
                <td>${order.date || 'N/A'}</td>
            `;
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px; color:red;">
                    Error loading orders. Check console for details.
                </td>
            </tr>
        `;
    }
}

// ===== Users Page =====
async function loadUsers() {
    const table = document.getElementById('usersTable');
    if (!table) return;

    try {
        const response = await fetch(`${API_URL}/api/users`);
        const users = await response.json();
        
        table.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        `;

        if (users.length === 0) {
            const row = table.insertRow();
            row.innerHTML = `<td colspan="3" style="text-align:center; padding:20px;">No users found</td>`;
            return;
        }

        users.forEach(u => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${u.name || 'N/A'}</td>
                <td>${u.email || 'N/A'}</td>
                <td>
                    <button onclick="deleteUser('${u._id || u.id}')">Delete</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error loading users:', error);
        table.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; padding:20px; color:red;">
                    Error loading users. Check console for details.
                </td>
            </tr>
        `;
    }
}

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
        await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// ===== Products Page  =====
async function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_URL}/api/products`);
        const products = await response.json();
        
        // products display logic here
        console.log('Products loaded:', products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// ===== Run page-specific functions =====
document.addEventListener('DOMContentLoaded', () => {
    // Load dashboard stats 
    loadDashboard();
    
    // Only load orders if we're on orders page
    if (document.getElementById('ordersTable')) {
        loadOrders();
    }
    
    // Only load users if we're on users page
    if (document.getElementById('usersTable')) {
        loadUsers();
    }
    
    // Only load products if we're on products page
    if (document.getElementById('productsContainer')) {
        loadProducts();
    }
});