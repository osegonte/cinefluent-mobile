// Quick test to verify API connection
const API_BASE = 'https://cinefluent-api-production-5082.up.railway.app';

async function testAuth() {
    console.log('🧪 Testing authentication...');
    
    try {
        // Test health
        const healthResponse = await fetch(`${API_BASE}/api/v1/health`);
        const health = await healthResponse.json();
        console.log('✅ Health check:', health.status);
        
        // Test login
        const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'enabled@example.com',
                password: 'TestPass123!'
            })
        });
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('✅ Login successful! Token received:', !!loginData.access_token);
            console.log('👤 User:', loginData.user?.email);
        } else {
            console.log('❌ Login failed:', loginResponse.status);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testAuth();
