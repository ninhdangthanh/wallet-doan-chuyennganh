"use client";

import "../css/bootstrap.min.css"
import "../css/login.css"

export default function ForgotPassword() {

  return (
    <div className="app-container">
        <h1 className="wallet-logo">
            U2MYA BLOCKCHAIN WALLET
        </h1>

        <div className="login-container">
            <h3 className="login-container-title">Welcome to U2MYA blockchain wallet, a wallet for ethereum ecosystem</h3>
            <div className="login-container-form">
                <form>
                    <h4>Forgot Password</h4>
                    <div className="form-group">
                      <input type="email" className="form-control login-container-input" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
                    </div>
                    <button type="submit" className="btn btn-primary login-container-button-login">Send temporary password</button>
                    <div className="create-account-success">Send temporary password succes, that password valid for 30 minutes, please login and change password immediately</div>
                </form>
                <a href="" className="login-container-create-new-account">Login</a>
            </div>
        </div>

    </div>
  );
}
