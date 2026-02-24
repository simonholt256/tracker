import InUpSwitch from "../components/InUpSwitch"

function SignUp() {
  return (
    <div className="Authentication-box">
      <InUpSwitch/>
      <h1>Sign Up</h1>
      <form>
        <div>
          <label>Username</label>
          <input type="text" />
          <br></br>
          <label>Email</label>
          <input type="text" />
          <br></br>
          <label>Password</label>
          <input type="text" />
          <br></br>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SignUp