// Cognito authentication handler
let currentUser = null;

function checkAuthStatus() {
    const token = localStorage.getItem('idToken');
    if (token) {
        currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        showDashboard();
        loadRecommendations();
    } else {
        showWelcome();
    }
}

function showWelcome() {
    document.getElementById('welcomeSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showDashboard() {
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
}

document.getElementById('loginBtn').addEventListener('click', () => {
    const redirectUri = window.location.origin;
    const cognitoLoginUrl = `https://${CONFIG.cognito.domain}.auth.${CONFIG.cognito.region}.amazoncognito.com/login?client_id=${CONFIG.cognito.clientId}&response_type=token&redirect_uri=${redirectUri}`;
    window.location.href = cognitoLoginUrl;
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    const redirectUri = window.location.origin;
    const cognitoLogoutUrl = `https://${CONFIG.cognito.domain}.auth.${CONFIG.cognito.region}.amazoncognito.com/logout?client_id=${CONFIG.cognito.clientId}&logout_uri=${redirectUri}`;
    window.location.href = cognitoLogoutUrl;
});

// Handle OAuth callback
if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');
    
    if (idToken) {
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('accessToken', accessToken);
        
        // Parse token to get user info (simplified)
        try {
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            localStorage.setItem('user', JSON.stringify({
                email: payload.email,
                sub: payload.sub
            }));
        } catch (e) {
            console.error('Error parsing token:', e);
        }
        
        // Remove hash from URL
        window.location.hash = '';
        checkAuthStatus();
    }
}

// Initialize auth on page load
checkAuthStatus();
