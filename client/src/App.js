import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Login from './component/Login'
import { useEffect, useState } from 'react'

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({})

  const accessToken = ()=>{
    axios({
      url: 'http://localhost:8000/getAccessToken',
      method: 'GET',
      withCredentials: true,
    }).then((res)=>{
      if(res.status == 200) {
        window.open('/', '_self')
      }
    })
  }

  const refreshToken = ()=>{
    axios({
      url: 'http://localhost:8000/getRefreshToken',
      method: 'GET',
      withCredentials: true,
    }).then((res)=>{
      window.open('/', '_self')
    })
  }

  const logout = ()=>{
    axios({
      url: 'http://localhost:8000/logout',
      method: 'POST',
      withCredentials: true
    }).then((result)=>{
      if(result.status == 200) {
        window.open('/', "_self")
      }
    })
  } 

  useEffect(()=>{
    try {
      axios({
        url:'http://localhost:8000/login/success',
        method: 'GET',
        withCredentials: true,
      }).then((result)=>{
        console.log(result)
        if(result.status == 200) {
          setIsLogin(true)
          setUser(result.data)
          console.log(isLogin)
          console.log(user)
        } else {
          setIsLogin(false)
          setUser(null)
        }
      }).catch((error)=>{
        console.error(error)
      })
    } catch(error) {
      console.error(error)
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a onClick={accessToken} className='App-link'>
          getAccessToken
        </a>
        <a onClick={refreshToken} className='App-link'>
          refreshToken
        </a>
        {isLogin ? (
          <>
            <h3>{user.username} 님이 로그인했습니다.</h3>
            <button onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Login setIsLogin={setIsLogin} setUser={setUser}/>
        )}
      </header>
    </div>
  );
}

export default App;
