import { Link } from 'react-router'

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignInForm } from '@/features/authentication/components/SignInForm'

/**
 * Sign in page. Orchestrates the card sections and the sign in form inside
 * the auth layout; all form logic lives in the `SignInForm` component.
 *
 * @returns The sign in page content.
 */
function SignIn() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Masuk</CardTitle>
        <CardDescription>Masuk dengan email dan kata sandi akun Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Belum punya akun?&nbsp;
        <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
          Daftar
        </Link>
      </CardFooter>
    </>
  )
}

export default SignIn

