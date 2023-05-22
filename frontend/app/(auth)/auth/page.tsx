"use client";

import { Eye, EyeSlash, Plus } from "phosphor-react";
import { useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [togglePass, setTogglePass] = useState(false);

  const [islogin, setIslogin] = useState(true);

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (islogin) {
      // login
    } else {
      // register
    }
  };

  return (
    <div className="auth__content">
      <div className="auth__header">
        <h1>{islogin ? "Sign in to continue" : "Create an account"}</h1>
        <div className="subtext">
          {islogin ? "Don't have an account?" : "Already have an account?"}
          <button className="switch-btn" onClick={() => setIslogin(!islogin)}>
            &nbsp;&nbsp;
            {islogin ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>

      {!islogin && (
        <div className="auth__input">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
      )}

      <div className="auth__input">
        <input
          type="text"
          value={email}
          placeholder="Email address"
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="auth__input">
        <input
          value={password}
          placeholder="Password"
          type={togglePass ? "text" : "password"}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="toggle-btn"
          onClick={() => setTogglePass(!togglePass)}
        >
          {togglePass ? (
            <EyeSlash size={14} weight="bold" />
          ) : (
            <Eye size={14} weight="bold" />
          )}
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="c-button c-button--dark has-icon submit-btn"
      >
        <span>{islogin ? "Sign in" : "Create account"}</span>
      </button>

      {error && <p className="warning-text">{error}</p>}
    </div>
  );
}

export default Page;
