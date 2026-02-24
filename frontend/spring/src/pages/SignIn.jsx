import InUpSwitch from "../components/InUpSwitch"

function SignIn() {
  return (
    <div className="Authentication-box">
      <InUpSwitch/>
      <h1>Sign In</h1>
      <form>
        <div>
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

export default SignIn