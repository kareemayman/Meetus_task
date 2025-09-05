import { useEffect, useState } from "react"
import FormInput from "../../components/FormInput.jsx"
import logo from "../../assets/images/logo.png"
import meetus from "../../assets/images/meetus.png"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "../../store/slices/authSlice"
import { emailValid } from "../../util/validation"
import toast from "react-hot-toast"
import "./Login.css"
import sms from "../../assets/images/sms.png"
import lock from "../../assets/images/lock.png"

export default function Login() {
  // Input States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [disableLoginButton, setDisableLoginButton] = useState(false)

  // Redux and Router Hooks
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // Redirect to Dashboard if token is present
  useEffect(() => {
    if (auth.user) {
      navigate("/", { replace: true })
    }
  }, [auth.user, navigate])

  // Input Validation & Disabling Login Button
  useEffect(() => {
    if (email.trim() === "" || password.trim() === "" || !emailValid(email)) {
      setDisableLoginButton(true)
      return
    }
    setDisableLoginButton(false)
  }, [email, password])

  // Function To Print Error Toast when Email or Password is Incorrect
  const printErrorToast = () => {
    if (email.trim() === "") {
      toast.error("Email is required")
      return true
    }
    if (!emailValid(email)) {
      toast.error("Enter a valid email")
      return true
    }
    if (password.trim() === "") {
      toast.error("Password is required")
      return true
    }
  }

  // Function To Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (printErrorToast()) return
    try {
      await dispatch(login({ email, password, isEmployee: true })).unwrap()
      // success -> go to dashboard
      navigate("/", { replace: true })
    } catch (err) {
      // error message available in auth.error
      console.error("login error", err)
      toast.error(err?.message || "Login failed")
    }
  }

  return (
    <div className="login">
      <div className="background-container">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
        <div className="blob b4"></div>

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
                icon={sms}
              ></FormInput>

              <FormInput
                name={"password"}
                type={"password"}
                placeholder={"Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={lock}
              ></FormInput>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={auth.status === "loading"}
              style={{
                opacity: auth.status === "loading" || disableLoginButton ? 0.3 : 1,
                cursor: auth.status === "loading" || disableLoginButton ? "not-allowed" : "pointer",
              }}
            >
              {auth.status === "loading" ? "Logging in..." : "Login"}
            </button>

            <p className="signup-link">
              Don't have an account? <a href="#">Sign Up</a>
            </p>
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
