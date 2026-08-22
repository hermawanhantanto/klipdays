import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { Toaster } from '@/components/ui/sonner'
import AuthLayout from './layouts/AuthLayout'
import Home from './pages/Home'
import SignUp from './pages/SignUp'

/**
 * Root application component configuring routing and global toast notifications.
 *
 * @returns The root application router tree.
 */
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route index element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="signin" />
          <Route path="login" element={<Navigate to="/signin" replace />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
