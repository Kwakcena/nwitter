import { authService, firebaseInstance } from 'fbase';
import React, { useState } from 'react';

const Auth = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [newAccount, setNewAccount] = useState(true)
  const [error, setError] = useState('');

  const onChange = (event) => {
    const {target: {name, value}} = event;
    setForm({
      ...form,
      [name]: value,
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if(newAccount) {
        data = await authService.createUserWithEmailAndPassword(email, password);
      }
      else {
        data = await authService.signInWithEmailAndPassword(email, password)
      }
      console.log(data);
    } catch(error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount(prev => !prev)
  const onSocialClick = async (event) => {
    const { target : { name } } = event;
    let provider;
    if(name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    else if(name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  }
  
  const { email, password } = form;

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={email} placeholder="Email" onChange={onChange} name="email" required />
        <input type="password" value={password} placeholder="Password" onChange={onChange} name="password" required />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
      <div>{error}</div>
      <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button>
        <button name="github" onClick={onSocialClick}>Continue with Github</button>
      </div>
    </div>
  )
}
export default Auth;