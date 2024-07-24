import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useVerifyAuthenticationQuery } from "@/services/auth"
import { loggedOut } from "@/store/auth/auth-slice"
import { RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

import { getValidAuthTokens } from "@/lib/cookies"

type Props = {
  children?: React.ReactNode
}

export const AuthWrapper = ({ children }: Props) => {
  const dispatch = useDispatch()
  const { push } = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  const { token } = getValidAuthTokens()

  const { error, isLoading } = useVerifyAuthenticationQuery(
    { token: token || "" },
    {
      skip: !!user?.email || !token,
    }
  )

  useEffect(() => {
    if (!token) {
      push("/login")
      dispatch(loggedOut())
    }
  }, [token])

  return children
}
