import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Components/Home/Home.jsx'
import QrScan from './Components/QrScan/QrScan.jsx'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/qr",
    element: <QrScan />
  },
  {
    path: "/map",
    element: <App/>
  }
])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router}/>
  // </StrictMode>,
)
