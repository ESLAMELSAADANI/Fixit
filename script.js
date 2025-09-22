// Smart Home Services Marketplace JavaScript

// DOM Elements
const serviceModal = document.getElementById('service-modal');
const authModal = document.getElementById('auth-modal');
const customerDashboard = document.getElementById('customer-dashboard');
const providerDashboard = document.getElementById('provider-dashboard');

// Modal Functions
function showCustomerRequest() {
    serviceModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showAuthModal() {
    authModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showProviderRegister() {
    showAuthModal();
    document.getElementById('account-type').value = 'provider';
    showRegister();
}

function closeModal() {
    serviceModal.style.display = 'none';
    authModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.querySelectorAll('.auth-tab')[0].classList.remove('active');
}

function showNewRequest() {
    showCustomerRequest();
}

function toggleAvailability() {
    const indicator = document.querySelector('.status-indicator');
    const button = event.target;
    
    if (indicator.classList.contains('online')) {
        indicator.classList.remove('online');
        indicator.style.background = '#dc3545';
        button.textContent = 'تفعيل التوفر';
        showNotification('تم إلغاء تفعيل التوفر', 'warning');
    } else {
        indicator.classList.add('online');
        indicator.style.background = '#28a745';
        button.textContent = 'إلغاء تفعيل التوفر';
        showNotification('تم تفعيل التوفر', 'success');
    }
}

function viewEarnings() {
    showNotification('سيتم عرض تفاصيل الأرباح قريباً', 'info');
}

function selectService(serviceType) {
    showCustomerRequest();
    document.getElementById('service-type').value = serviceType;
    
    const serviceNames = {
        'plumbing': 'السباكة',
        'electrical': 'الكهرباء',
        'carpentry': 'النجارة',
        'cleaning': 'التنظيف',
        'painting': 'الدهان',
        'ac': 'المكيفات'
    };
    
    showNotification(`تم اختيار خدمة ${serviceNames[serviceType]}`, 'success');
}

// Form Submissions
document.getElementById('service-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        serviceType: document.getElementById('service-type').value,
        description: document.getElementById('problem-description').value,
        address: document.getElementById('address').value,
        time: document.getElementById('preferred-time').value,
        budget: document.getElementById('budget').value
    };

    // Simulate API call
    showLoading();

    setTimeout(() => {
        hideLoading();
        showNotification('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً', 'success');
        closeModal();

        // Update dashboard stats
        updateDashboardStats('customer');

        // Clear form
        this.reset();
    }, 2000);
});

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };

    // Simulate API call
    showLoading();

    setTimeout(() => {
        hideLoading();
        showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');

        // Clear form
        this.reset();
    }, 1500);
});

document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isLogin = document.getElementById('login-form').style.display !== 'none';
    
    if (isLogin) {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
            closeModal();
            
            // Show appropriate dashboard
            const accountType = document.getElementById('account-type')?.value || 'customer';
            showDashboard(accountType);
        }, 1500);
    } else {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const accountType = document.getElementById('account-type').value;
        
        showLoading();
        
        setTimeout(() => {
            hideLoading();
            showNotification('تم إنشاء الحساب بنجاح!', 'success');
            closeModal();
            showDashboard(accountType);
        }, 1500);
    }
});

// Dashboard Functions
function showDashboard(type) {
    if (type === 'customer') {
        customerDashboard.style.display = 'block';
        providerDashboard.style.display = 'none';
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.services').style.display = 'none';
        document.querySelector('.how-it-works').style.display = 'none';
    } else {
        customerDashboard.style.display = 'none';
        providerDashboard.style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.services').style.display = 'none';
        document.querySelector('.how-it-works').style.display = 'none';
    }
    
    // Scroll to dashboard
    customerDashboard.scrollIntoView({ behavior: 'smooth' });
}

// Update Dashboard Statistics
function updateDashboardStats(type) {
    if (type === 'customer') {
        const activeRequests = document.getElementById('active-requests');
        const completedRequests = document.getElementById('completed-requests');
        
        activeRequests.textContent = parseInt(activeRequests.textContent) + 1;
        completedRequests.textContent = parseInt(completedRequests.textContent) + 1;
    } else {
        const todayRequests = document.getElementById('today-requests');
        const monthlyEarnings = document.getElementById('monthly-earnings');
        
        todayRequests.textContent = parseInt(todayRequests.textContent) + 1;
        
        const currentEarnings = parseInt(monthlyEarnings.textContent.replace(/[^0-9]/g, ''));
        const newEarnings = currentEarnings + 150; // Assume 150 EGP per service
        monthlyEarnings.textContent = newEarnings.toLocaleString() + ' ج.م';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Loading States
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 4000;
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 10px;
                text-align: center;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p>جاري المعالجة...</p>
            </div>
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.remove();
}

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
document.querySelector('.hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
});

// Add CSS for mobile menu
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 1rem;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = mobileMenuStyles;
document.head.appendChild(style);

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === serviceModal || e.target === authModal) {
        closeModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add some sample data to dashboard
    updateDashboardStats('customer');
    updateDashboardStats('provider');
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('مرحباً بك في منصة بيتك الذكي!', 'info');
    }, 1000);
});
