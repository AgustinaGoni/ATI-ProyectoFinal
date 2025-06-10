import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import customTheme from './utils/custom-theme/theme.js'
import { ChakraProvider } from '@chakra-ui/react'
import { GlobalStyleComponent } from './utils/custom-theme/GlobalStyleComponent.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider
      theme={customTheme}
      toastOptions={{
        defaultOptions: { position: "bottom", isClosable: true },
      }}
    >
      <GlobalStyleComponent />

          <App />
    </ChakraProvider>
  </React.StrictMode>,
)
