import React from 'react'
import axios from "axios"
import { useState } from 'react'

export default function Login({ setIsLogin, setUser }) {
  const [name, setName] = useState({})
  const [email, setEmail] = useState({})
  const [password, setPassword] = useState({})

  const login = ()=>{
    axios({
      url: 'http://localhost:8000/login',
      method: 'POST',
      withCredentials: true,
      data: {
        name: name,
        email: email,
        password: password
      }
    }).then((result)=>{
      console.log('login', result)
      if(result.status == 200) {
        window.open('./', '_self')
      }
    })
  }

  const register = ()=>{
    axios({
      url: 'http://localhost:8000/register',
      method: 'POST',
      withCredentials: true,
      data: {
        name: name,
        email: email,
        password: password
      }
    }).then((res)=>{
      if(res.status == 200) {
        window.open('/', '_self')
      }
    })
  }

  return (
    <div className="login">
      <table>
        <tr>
          <td>Name</td>
          <td><input 
                type='text'
                placeholder='Name'
                onChange={(e)=>{setName(e.target.value)}}>
                </input></td>
        </tr>
        <tr>
          <td>Email</td>
          <td><input 
                type="text" 
                placeholder="Email"
                onChange={(e)=>{setEmail(e.target.value)}}>
              </input></td>
        </tr>
        <tr>
          <td>Password</td>
          <td><input 
                type="password" 
                placeholder="Password"
                onChange={(e)=>{setPassword(e.target.value)}}>
              </input></td>
        </tr>
        <tr>
          <td><a onClick={login}>로그인</a></td>
          <td><a onClick={register}>회원가입</a></td>
        </tr>
      </table>
    </div>
  )
}