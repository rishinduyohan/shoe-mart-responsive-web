const API_URL = 'http://localhost:8080/api';
let products = [];
let orders = [];

async function fetchData(endpoint) {
    try {
        const r = await fetch(`${API_URL}/${endpoint}`);
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return await r.json();
    } catch (e) {
        console.error(`Fetch error for ${endpoint}:`, e);
        return [];
    }
}

async function saveProduct(data) {
    const url = data.id ? `${API_URL}/products/${data.id}` : `${API_URL}/products`;
    const method = data.id ? 'PUT' : 'POST';
    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function deleteItem(endpoint, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
        loadAdminData();
    }
}

async function loadAdminData() {
    try {
        const fetched = await fetchData('products');
        products = Array.isArray(fetched) ? fetched : [];
        const list = document.getElementById('admin-products-list');
        list.innerHTML = '';
        products.forEach(p => {
            list.innerHTML += `
                <tr>
                    <td style="display:flex;align-items:center;gap:12px;">
                        <img src="${p.image}" class="prod-img-adm"><span>${p.name}</span>
                    </td>
                    <td style="text-transform:capitalize;">${p.category}</td>
                    <td style="font-weight:600;">Rs. ${(p.priceValue || 0).toLocaleString()}</td>
                    <td><span class="badge badge-success">In Stock</span></td>
                    <td>
                        <button class="action-btn-adm btn-edit-adm" onclick="editProduct(${p.id})">Edit</button>
                        <button class="action-btn-adm btn-delete-adm" onclick="deleteItem('products', ${p.id})">Delete</button>
                    </td>
                </tr>`;
        });
        document.getElementById('stat-products').textContent = `${products.length} Products`;
    } catch (err) { console.error('Error loading products:', err); }

    try {
        const users = await fetchData('users');
        const userList = document.getElementById('admin-users-list');
        userList.innerHTML = '';
        (Array.isArray(users) ? users : []).forEach(u => {
            userList.innerHTML += `<tr><td>#${u.id}</td><td>${u.username}</td><td>${u.email}</td><td><span class="badge badge-info">${u.role || 'User'}</span></td><td><button class="action-btn-adm btn-delete-adm" onclick="deleteItem('users', ${u.id})">Remove</button></td></tr>`;
        });
        document.getElementById('stat-users').textContent = `${(Array.isArray(users) ? users.length : 0)} Customers`;
    } catch (err) { console.error('Error loading users:', err); }

    try {
        const fetchedOrders = await fetchData('orders');
        orders = Array.isArray(fetchedOrders) ? fetchedOrders : [];
        const orderList = document.getElementById('admin-orders-list');
        orderList.innerHTML = '';
        let total = 0;
        orders.forEach(o => {
            total += o.totalAmount;
            orderList.innerHTML += `<tr><td>#ORD-${o.id}</td><td>${o.customerName}</td><td style="font-weight:600;">Rs. ${o.totalAmount.toLocaleString()}</td><td>${new Date(o.orderDate).toLocaleDateString()}</td><td><span class="badge badge-success">Completed</span></td></tr>`;
        });
        document.getElementById('stat-revenue').textContent = 'Rs. ' + total.toLocaleString();
        initChart(orders);
    } catch (err) { console.error('Error loading orders:', err); }
}

let chartInstance = null;
function initChart(data) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grouped = {};
    (Array.isArray(data) ? data : []).forEach(o => {
        const date = new Date(o.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        grouped[date] = (grouped[date] || 0) + o.totalAmount;
    });
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(grouped),
            datasets: [{ label: 'Revenue', data: Object.values(grouped), borderColor: '#A5956F', backgroundColor: 'rgba(165, 149, 111, 0.1)', fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

window.editProduct = (id) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
        document.getElementById('modal-title').textContent = 'Refine Product';
        document.getElementById('product-id').value = p.id;
        document.getElementById('prod-name').value = p.name;
        document.getElementById('prod-category').value = p.category;
        document.getElementById('prod-price').value = p.priceValue || 0;
        document.getElementById('prod-image-url').value = p.image;
        document.getElementById('product-modal-overlay').classList.add('active');
    }
};

document.getElementById('add-product-btn').addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'New Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-modal-overlay').classList.add('active');
});

document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('product-modal-overlay').classList.remove('active');
});

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    let imageUrl = document.getElementById('prod-image-url').value;
    const file = document.getElementById('prod-image-file').files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'shoemart');
        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dbndqriih/image/upload', { method: 'POST', body: formData });
            const cloudData = await res.json();
            imageUrl = cloudData.secure_url;
        } catch (err) { console.error(err); }
    }

    const data = {
        id: document.getElementById('product-id').value || null,
        name: document.getElementById('prod-name').value,
        category: document.getElementById('prod-category').value,
        priceValue: parseFloat(document.getElementById('prod-price').value),
        image: imageUrl || 'assets/images/shoe-casual.png'
    };
    await saveProduct(data);
    document.getElementById('product-modal-overlay').classList.remove('active');
    saveBtn.textContent = 'Save Product';
    saveBtn.disabled = false;
    loadAdminData();
});

document.querySelectorAll('.nav-link-adm').forEach(link => {
    link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-link-adm').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const target = link.dataset.target;
        document.querySelectorAll('.tab-content-adm').forEach(tc => tc.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        document.getElementById('page-title').textContent = link.textContent.trim();
        document.getElementById('product-action-header').style.display = (target === 'manage-products') ? 'block' : 'none';
        if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('active');
    });
});

document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

window.exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(165, 149, 111);
    doc.text("ShoeMart", 105, 30, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Official Sales & Revenue Report", 105, 40, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 47, { align: 'center' });
    doc.setDrawColor(230);
    doc.line(20, 55, 190, 55);
    const tableData = orders.map(o => [
        `#ORD-${o.id}`,
        o.customerName,
        o.items ? o.items.map(i => {
            if (i.productName) return i.productName;
            const p = products.find(prod => prod.id == i.productId);
            return p ? p.name : 'Unknown Product';
        }).join(', ') : 'N/A',
        new Date(o.orderDate).toLocaleDateString(),
        o.items ? o.items.reduce((sum, item) => sum + item.quantity, 0) : 0,
        `Rs. ${o.totalAmount.toLocaleString()}`
    ]);
    doc.autoTable({
        startY: 65,
        head: [['Order ID', 'Customer', 'Products', 'Date', 'Qty', 'Total (Rs.)']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [165, 149, 111] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: { 2: { cellWidth: 50 } }
    });
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text(`Net Revenue: ${document.getElementById('stat-revenue').textContent}`, 190, finalY, { align: 'right' });
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Confidential ShoeMart Sales Performance Report", 105, finalY + 20, { align: 'center' });
    doc.save(`ShoeMart_Sales_Report_${new Date().getTime()}.pdf`);
};

window.exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products.map(p => ({
        Name: p.name,
        Category: p.category,
        Price: p.priceValue || 0,
        Stock: 'In Stock'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `ShoeMart_Inventory_${new Date().getTime()}.xlsx`);
};

loadAdminData();
