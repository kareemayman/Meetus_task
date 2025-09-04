import { useState } from "react"
import FormInput from "../components/FormInput"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import logo from "../assets/images/logo.png"
import meetus from "../assets/images/meetus.png"

export default function Login() {
  // Input States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Function To Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Use email and password state here
    // e.g., send to API or validate
  }

  return (
     <div className="login">
      <div className="background-container">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
        <div class="blob b3"></div>
        <div class="blob b4"></div>

        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="welcome">
              <h1>Welcome back</h1>
              <p>Step into our shopping metaverse for an unforgettable shopping experience</p>
            </div>

            <div className="form-group">
              <FormInput
                name={"email"}
                type={"email"}
                placeholder={"Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={faEnvelope}>
              </FormInput>

              <FormInput
                name={"password"}
                type={"password"}
                placeholder={"Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={faLock}>
              </FormInput>
            </div>

            <button type="submit" className="login-btn">Login</button>

            <p className="signup-link">Don't have an account? <a href="#">Sign Up</a></p>
          </form>
          <div className="logo">
            <img src={meetus} alt="meetus" />
            <img src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  )
}
