// import 'core-js'
// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from 'react-redux'
// import { HashRouter } from 'react-router-dom'

// import App from './App'
// import store from './store'

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <HashRouter>
//       <App />
//     </HashRouter>
//   </Provider>,
// )

import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'; // Import HashRouter

import App from './App'
import store from './store'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <Provider store={store}>
    <HashRouter>
      {' '}
      {/* Wrap App with HashRouter */}
      <App />
    </HashRouter>
  </Provider>,
)
