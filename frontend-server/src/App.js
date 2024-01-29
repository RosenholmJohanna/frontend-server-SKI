import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

    const result = await response.json();
      //const token = result.access_token; //
      //console.log('before set in storage', result.accessToken)
      //localStorage.setItem('access_token', token); // undefined
      localStorage.setItem('access_token', result.accessToken);
      setAuthenticated(true);
      // console.log(result)
      // console.log(localStorage)
    } catch (error) {
      alert(error.message || 'Login failed!');
    }
  };

    
  const handleLogout = () => {
    localStorage.removeItem('access_token');  
    setAuthenticated(false);  
    setData(null);  
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
          console.log('Token sent from frontend:', token); // token, can be seen in backend-server
      const response = await fetch('http://localhost:3002/data', {
        headers: { Authorization: `Bearer ${token}` }
      },
      console.log(`Bearer ${token}`)
      );
      
      
      if (!response.ok) {
        if (response.status === 401) {  // Unauthorized
          handleLogout();
          alert('Session expired. Please login again.');
          return;
        }
        throw new Error('Failed to fetch data from backend');
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      alert(error.message || 'Failed to fetch data');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated ?
          <>
            {data ? <p>{data}</p> : <button onClick={fetchData}>Fetch Data</button>}
            <button onClick={handleLogout}>Logout</button>
          </> :
          (<div className="login-container">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-field" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-field" />
            <button onClick={handleLogin} className="login-button">Login</button>
          </div>)
        }
      </header>
    </div>
  );
}

export default App;
