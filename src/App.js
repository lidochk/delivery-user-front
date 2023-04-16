import React,{ useState } from 'react';
import './App.css';
import Restaurants from './Component/Restaurants';

const App = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accessToken, setAccessToken] = useState(null);

  const register = async () => {
    try {
      console.log('Attempting registration with data:', {
        name,
        email,
        password,
        role: 'COURIER',
      });

      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'COURIER' }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (data.success) {
        console.log('Registration successful');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Login response data:", data); // Добавьте эту строку для отладки

      if (data.accessToken) {
        console.log('Login successful');
        setAccessToken(data.accessToken);
      } else {
        console.error('Error: Login unsuccessful');
        console.error('Login error details:', data); // Добавьте эту строку для отладки
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistered) {
      login();
    } else {
      register();
    }
  };

  const handleToggle = () => {
    setIsRegistered(!isRegistered);
  };


  return (
      <div className="App">
        {accessToken ? (
            <Restaurants token={accessToken} />
        ) : (
            <>
              <h1>{isRegistered ? 'Login' : 'Sign Up'}</h1>
              <form onSubmit={handleSubmit}>
                {!isRegistered && (
                    <div>
                      <label htmlFor="name">Name:</label>
                      <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                )}
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {!isRegistered && (
                    <div>
                      <label htmlFor="role">Role:</label>
                      <input type="text" id="role" value="COURIER" readOnly />
                    </div>
                )}
                <button type="submit">{isRegistered ? 'Login' : 'Sign Up'}</button>
              </form>
              <button onClick={handleToggle}>
                {isRegistered
                    ? 'Not registered? Sign up here.'
                    : 'Already registered? Login here.'}
              </button>
            </>
        )}
      </div>
  );

};

export default App;