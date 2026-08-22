import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import AuthLayout from './layouts/AuthLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="signin" />
          <Route path="signup" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
