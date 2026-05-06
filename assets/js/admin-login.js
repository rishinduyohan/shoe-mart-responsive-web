document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-password').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/users/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
        });

        if (response.ok) {
            const adminUser = await response.json();
            if (adminUser) {
                sessionStorage.setItem('shoeMartAdmin', JSON.stringify(adminUser));
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Access denied! Incorrect credentials or you are not an Admin.');
            }
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Backend server is not responding. Make sure your Spring Boot app is running.');
    }
});
