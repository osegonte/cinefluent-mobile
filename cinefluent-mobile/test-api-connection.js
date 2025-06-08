// test-api-connection.js - Quick API test script
// Run this in your browser console to test API connection

const API_BASE = 'https://cinefluent-api-production-5082.up.railway.app';

async function testApiConnection() {
    console.log('🧪 Testing CineFluent API Connection...');
    console.log(`API Base: ${API_BASE}`);
    
    try {
        // Test 1: Health Check
        console.log('\n1️⃣ Testing health endpoint...');
        const healthResponse = await fetch(`${API_BASE}/api/v1/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);
        
        // Test 2: Login with your credentials
        console.log('\n2️⃣ Testing login with enabled@example.com...');
        const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'enabled@example.com',
                password: 'TestPass123!'
            })
        });
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('✅ Login successful!');
            console.log('User:', loginData.user?.email);
            console.log('Token received:', !!loginData.access_token);
            
            // Test 3: Get user profile with token
            if (loginData.access_token) {
                console.log('\n3️⃣ Testing protected route with token...');
                const profileResponse = await fetch(`${API_BASE}/api/v1/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${loginData.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    console.log('✅ Profile fetch successful!');
                    console.log('Profile:', profileData);
                } else {
                    console.log('❌ Profile fetch failed:', profileResponse.status);
                }
            }
            
        } else {
            const errorData = await loginResponse.json();
            console.log('❌ Login failed:', loginResponse.status, errorData);
        }
        
        // Test 4: Movies endpoint
        console.log('\n4️⃣ Testing movies endpoint...');
        const moviesResponse = await fetch(`${API_BASE}/api/v1/movies`);
        if (moviesResponse.ok) {
            const moviesData = await moviesResponse.json();
            console.log('✅ Movies endpoint working!');
            console.log(`Found ${moviesData.movies?.length || 0} movies`);
        } else {
            console.log('❌ Movies endpoint failed:', moviesResponse.status);
        }
        
        console.log('\n🎉 API Connection Test Complete!');
        
    } catch (error) {
        console.error('❌ API Test Error:', error);
        console.log('\n🔧 Debugging tips:');
        console.log('1. Check if Railway service is running');
        console.log('2. Verify CORS is properly configured');
        console.log('3. Check browser network tab for details');
    }
}

// Run the test
testApiConnection();