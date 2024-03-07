"use client";

import "../css/bootstrap.min.css"
import "../css/login.css"

export default function SignIn() {

  return (
    <div className="app-container">
        <h1 className="wallet-logo">
            U2MYA BLOCKCHAIN WALLET
        </h1>

        <div className="login-container">
            <h3 className="login-container-title">Welcome to U2MYA blockchain wallet, a wallet for ethereum ecosystem</h3>
            <div className="login-container-form">
                <h4>Sign In</h4>
                <form>
                    <div className="form-group">
                      <input type="email" className="form-control login-container-input" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
                    </div>
                    <div className="form-group">
                      <input type="password" className="form-control login-container-input" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control login-container-input" id="exampleInputPassword1" placeholder="Confirm Password" />
                      </div>
                    <button type="submit" className="btn btn-primary login-container-button-login">Create</button>
                    <span className="create-account-success">Create success, please navigate to login page to continue!!!</span>
                </form>
                <a href="" className="login-container-create-new-account">Already had an account?</a>
            </div>
        </div>

    </div>
  );
}
