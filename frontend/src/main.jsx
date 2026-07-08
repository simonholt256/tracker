import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import { UserInfoProvider } from './context/UserInfoContext.jsx'
import { IntentionsProvider } from './context/IntentionsContext.jsx'
import { ChallengesProvider } from './context/ChallengesContext.jsx'
import { StarsProvider } from './context/StarsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <UserInfoProvider>
          <IntentionsProvider>
            <ChallengesProvider>
              <StarsProvider>
                <App />
              </StarsProvider>
            </ChallengesProvider>
          </IntentionsProvider>
        </UserInfoProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
