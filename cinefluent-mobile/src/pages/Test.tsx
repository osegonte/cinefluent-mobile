// src/pages/Test.tsx - Absolute minimal test
function Test() {
  const handleClick = () => {
    console.log('Button clicked!');
    alert('Test button works!');
  };

  return (
    <div>
      <h1>Test Page</h1>
      <p>If you can see this, React is working.</p>
      <button onClick={handleClick}>
        Test Button
      </button>
      <div>
        <h2>Environment Check:</h2>
        <p>NODE_ENV: {import.meta.env.MODE}</p>
        <p>API URL: {import.meta.env.VITE_API_BASE_URL || 'Not set'}</p>
      </div>
    </div>
  );
}

export default Test;