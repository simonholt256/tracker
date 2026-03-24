import Spring from '../../assets/springitallic.png'

function Header() {

  return (
    <>
      <div className="header-banner">
        
          {/* <div className="tortoise">Brought to you by <span>flying tortoise</span></div> */}
          <div className="green-div-box green-one">
            <div className="green-div"></div>
          </div>
          <div className="main-title">
            <img className='spring' src={Spring}/>
            {/* <h1 className="main-title-text" >Spring</h1> */}
          </div>
          <div className="green-div-box green-two">
            <div className="green-div"></div>
          </div>
          <div className="kindness">accumulate with kindness</div>
          <div className='border-top'></div>
          <div className='border-below'></div>

      </div>
    </>
  )
}

export default Header