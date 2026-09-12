import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
)

// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { HashRouter } from 'react-router-dom'
// import AppRoutes from './routes/AppRoutes.tsx'

// createRoot(document.getElementById('root')!).render(
//   <HashRouter>
//     <AppRoutes />
//   </HashRouter>,
// )
