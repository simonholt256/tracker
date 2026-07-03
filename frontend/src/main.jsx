import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import { UserInfoProvider } from './context/UserInfoContext.jsx'
import { IntentionsProvider } from './context/IntentionsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <UserInfoProvider>
          <IntentionsProvider>
            <App />
          </IntentionsProvider>
        </UserInfoProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
