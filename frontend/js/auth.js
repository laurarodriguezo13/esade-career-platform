// Cognito Authentication using AWS SDK
const poolData = {
    UserPoolId: CONFIG.cognito.userPoolId,
    ClientId: CONFIG.cognito.clientId
};

let currentUser = null;
let userPool = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already signed in
    initializeAuth();
});

function initializeAuth() {
    // For demo, we'll check localStorage for a simple auth flag
    const authToken = localStorage.getItem('esade_auth_token');
    if (authToken) {
        currentUser = JSON.parse(localStorage.getItem('esade_user') || '{}');
        showDashboard();
        loadRecommendations();
    } else {
        showWelcome();
    }
}

function showWelcome() {
    document.getElementById('welcomeSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('authModal').style.display = 'none';
}

function showDashboard() {
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('authModal').style.display = 'none';
    
    // Update user info if available
    if (currentUser && currentUser.email) {
        document.getElementById('userEmail').textContent = currentUser.email;
    }
}

function showAuthModal(mode) {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('authTitle').textContent = mode === 'signup' ? 'Sign Up' : 'Sign In';
    document.getElementById('authMode').value = mode;
    
    // Show/hide verification section
    document.getElementById('verificationSection').style.display = 'none';
    document.getElementById('authForm').style.display = 'block';
    
    // Clear form
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('verificationCode').value = '';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Sign Up Function
async function handleSignUp(email, password) {
    try {
        // Validate ESADE email
        if (!email.endsWith('@esade.edu') && !email.endsWith('@alumni.esade.edu')) {
            throw new Error('Please use an ESADE email address (@esade.edu or @alumni.esade.edu)');
        }

        // For demo: simulate signup
        document.getElementById('authMessage').innerHTML = 
            '<div class="success-message">✅ Account created! Check your email for verification code.</div>';
        
        // Store email temporarily
        localStorage.setItem('pending_email', email);
        localStorage.setItem('pending_password', password);
        
        // Show verification section
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('verificationSection').style.display = 'block';
        
        return true;
    } catch (error) {
        document.getElementById('authMessage').innerHTML = 
            `<div class="error-message">❌ ${error.message}</div>`;
        return false;
    }
}

// Verify Email Function
async function handleVerifyEmail(code) {
    try {
        const email = localStorage.getItem('pending_email');
        
        // For demo: accept any 6-digit code
        if (code.length === 6) {
            document.getElementById('authMessage').innerHTML = 
                '<div class="success-message">✅ Email verified! Please sign in.</div>';
            
            // Clear pending data
            localStorage.removeItem('pending_email');
            localStorage.removeItem('pending_password');
            
            // Switch to sign in mode
            setTimeout(() => {
                showAuthModal('signin');
            }, 2000);
            
            return true;
        } else {
            throw new Error('Please enter a valid 6-digit code');
        }
    } catch (error) {
        document.getElementById('authMessage').innerHTML = 
            `<div class="error-message">❌ ${error.message}</div>`;
        return false;
    }
}

// Sign In Function
async function handleSignIn(email, password) {
    try {
        // Validate ESADE email
        if (!email.endsWith('@esade.edu') && !email.endsWith('@alumni.esade.edu')) {
            throw new Error('Please use an ESADE email address');
        }

        // For demo: accept any password
        if (password.length >= 8) {
            // Store auth token
            localStorage.setItem('esade_auth_token', 'demo_token_' + Date.now());
            localStorage.setItem('esade_user', JSON.stringify({ email: email }));
            
            currentUser = { email: email };
            
            document.getElementById('authMessage').innerHTML = 
                '<div class="success-message">✅ Signed in successfully!</div>';
            
            setTimeout(() => {
                showDashboard();
                loadRecommendations();
            }, 1000);
            
            return true;
        } else {
            throw new Error('Password must be at least 8 characters');
        }
    } catch (error) {
        document.getElementById('authMessage').innerHTML = 
            `<div class="error-message">❌ ${error.message}</div>`;
        return false;
    }
}

// Sign Out Function
function handleSignOut() {
    localStorage.removeItem('esade_auth_token');
    localStorage.removeItem('esade_user');
    currentUser = null;
    showWelcome();
}

// Event Listeners
document.getElementById('loginBtn').addEventListener('click', () => {
    showAuthModal('signin');
});

document.getElementById('signupBtn').addEventListener('click', () => {
    showAuthModal('signup');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    handleSignOut();
});

document.getElementById('closeModal').addEventListener('click', () => {
    closeAuthModal();
});

document.getElementById('switchMode').addEventListener('click', () => {
    const currentMode = document.getElementById('authMode').value;
    showAuthModal(currentMode === 'signin' ? 'signup' : 'signin');
});

document.getElementById('authFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const mode = document.getElementById('authMode').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    
    if (mode === 'signup') {
        await handleSignUp(email, password);
    } else {
        await handleSignIn(email, password);
    }
});

document.getElementById('verifyBtn').addEventListener('click', async () => {
    const code = document.getElementById('verificationCode').value;
    await handleVerifyEmail(code);
});

document.getElementById('resendCode').addEventListener('click', async () => {
    document.getElementById('authMessage').innerHTML = 
        '<div class="success-message">✅ Verification code resent!</div>';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('authModal');
    if (e.target === modal) {
        closeAuthModal();
    }
});
