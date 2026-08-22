import { Link } from 'react-router'

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignUpForm } from '@/features/authentication/components/SignUpForm'

/**
 * Sign up page. Orchestrates the card sections and the sign up form inside
 * the auth layout; all form logic lives in the `SignUpForm` component.
 *
 * @returns The sign up page content.
 */
function SignUp() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl">Buat akun</CardTitle>
        <CardDescription>Daftar sebagai Creator atau Brand untuk mulai menggunakan Klipday.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Sudah punya akun?&nbsp;
        <Link to="/signin" className="text-primary underline-offset-4 hover:underline">
          Masuk
        </Link>
      </CardFooter>
    </>
  )
}

export default SignUp
