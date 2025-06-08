// debug-login.js - Complete debugging script
// Run this in your browser console on the login page

async function debugLoginIssue() {
    console.clear();
    console.log('🔍 CineFluent Login Debug Script');
    console.log('='.repeat(50));
    
    // Step 1: Check environment variables
    console.log('\n1️⃣ Environment Variables:');
    console.log('VITE_API_BASE_URL:', import.meta?.env?.VITE_API_BASE_URL || 'undefined');
    console.log('window.location.origin:', window.location.origin);
    
    // Step 2: Test different API base URLs
    const possibleApiUrls = [
        'https://cinefluent-api-production-5082.up.railway.app',
        import.meta?.env?.VITE_API_BASE_URL,
        process?.env?.VITE_API_BASE_URL
    ].filter(Boolean).filter((url, index, arr) => arr.indexOf(url) === index);
    
    console.log('\n2️⃣ Testing API URLs:');
    for (const apiUrl of possibleApiUrls) {
        console.log(`\nTesting: ${apiUrl}`);
        
        try {
            // Test health endpoint
            const healthResponse = await fetch(`${apiUrl}/api/v1/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log(`Health check status: ${healthResponse.status}`);
            
            if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                console.log('✅ Health data:', healthData);
                
                // Test login with this URL
                console.log('\n🔐 Testing login...');
                const loginResponse = await fetch(`${apiUrl}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'enabled@example.com',
                        password: 'TestPass123!'
                    })
                });
                
                console.log(`Login status: ${loginResponse.status}`);
                console.log('Login headers:', Object.fromEntries(loginResponse.headers.entries()));
                
                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    console.log('✅ LOGIN SUCCESS!');
                    console.log('User:', loginData.user?.email);
                    console.log('Token received:', !!loginData.access_token);
                    console.log('Token length:', loginData.access_token?.length);
                    
                    // Test protected route
                    if (loginData.access_token) {
                        console.log('\n🔒 Testing protected route...');
                        const meResponse = await fetch(`${apiUrl}/api/v1/auth/me`, {
                            headers: {
                                'Authorization': `Bearer ${loginData.access_token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (meResponse.ok) {
                            const meData = await meResponse.json();
                            console.log('✅ Protected route works!');
                            console.log('Profile:', meData);
                        } else {
                            const errorText = await meResponse.text();
                            console.log('❌ Protected route failed:', meResponse.status, errorText);
                        }
                    }
                    
                } else {
                    const errorText = await loginResponse.text();
                    console.log('❌ Login failed:', errorText);
                    
                    try {
                        const errorJson = JSON.parse(errorText);
                        console.log('Error details:', errorJson);
                    } catch (e) {
                        console.log('Raw error response:', errorText);
                    }
                }
                
            } else {
                const errorText = await healthResponse.text();
                console.log('❌ Health check failed:', errorText);
            }
            
        } catch (error) {
            console.log('❌ Network error:', error.message);
            console.log('Error type:', error.name);
        }
    }
    
    // Step 3: Check CORS
    console.log('\n3️⃣ CORS Check:');
    try {
        const corsResponse = await fetch('https://cinefluent-api-production-5082.up.railway.app/api/v1/health', {
            method: 'OPTIONS'
        });
        console.log('CORS preflight status:', corsResponse.status);
        console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
    } catch (error) {
        console.log('CORS error:', error.message);
    }
    
    // Step 4: Check localStorage
    console.log('\n4️⃣ Local Storage:');
    console.log('auth_token:', localStorage.getItem('auth_token') || 'not set');
    
    // Step 5: Test with different credentials
    console.log('\n5️⃣ Testing different credentials:');
    const testCredentials = [
        { email: 'enabled@example.com', password: 'TestPass123!' },
        { email: 'test@example.com', password: 'TestPass123!' },
    ];
    
    for (const creds of testCredentials) {
        try {
            console.log(`\nTesting: ${creds.email}`);
            const response = await fetch('https://cinefluent-api-production-5082.up.railway.app/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(creds)
            });
            
            console.log(`Status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Success with:', creds.email);
                console.log('Token:', !!data.access_token);
            } else {
                const errorText = await response.text();
                console.log(`❌ Failed with ${creds.email}:`, errorText);
            }
        } catch (error) {
            console.log(`Error with ${creds.email}:`, error.message);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 Debug Complete! Check the results above.');
}

// Run the debug function
debugLoginIssue();