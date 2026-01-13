import { ReactKeycloakProvider } from '@react-keycloak/web'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import keycloak, { keycloakInit, isDevMode } from './auth/keycloak'

// Check if we're running inside an iframe
const isInIframe = window.self !== window.top

// In dev mode without Keycloak configured, render without auth
if (isDevMode) {
  console.log('🔧 Dev Mode: Keycloak authentication bypassed')
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={keycloakInit}
      LoadingComponent={<LoadingScreen />}
      onEvent={(event) => {
        // If login is required and we're in an iframe, show the login prompt
        if (event === 'onAuthError' && isInIframe) {
          console.log('Auth error in iframe - showing login button')
        }
      }}
    >
      <App />
    </ReactKeycloakProvider>
  )
}

function LoadingScreen() {
  // If we're in an iframe, show a button to open in new tab for login
  if (isInIframe) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h2>Authentication Required</h2>
          <p style={{ marginBottom: '24px', opacity: 0.8 }}>
            Keycloak login doesn't work in Replit's preview iframe.<br />
            Please open the app in a new tab to log in.
          </p>
          <button
            onClick={() => window.open(window.location.href, '_blank')}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            Open in New Tab →
          </button>
          <p style={{ fontSize: '12px', opacity: 0.6 }}>
            After logging in, you can return to this preview.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>Connecting to Noumena Cloud...</h2>
        <p>Authenticating with Keycloak</p>
      </div>
    </div>
  )
}
