import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { MockFleetProvider } from './context/MockFleetProvider'
import { store } from './store/store'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MockFleetProvider>
        <App />
      </MockFleetProvider>
    </Provider>
  </StrictMode>,
)
