import { useClient } from '@vocdoni/react-providers'

export const useFaucet = () => {
  const { connected, signer, client } = useClient()

  const oAuthSignInURL = async (
    provider: string,
    redirectURLParams?: { param: string; value: any }[]
  ): Promise<string> => {
    if (!connected) throw new Error('Wallet not connected')

    const redirectURL = new URL(window.location.href)
    redirectURL.searchParams.append('provider', provider)
    redirectURL.searchParams.append('recipient', await signer.getAddress())
    if (redirectURLParams) {
      for (const p of redirectURLParams) {
        redirectURL.searchParams.append(p.param, p.value)
      }
    }

    const response = await fetch(`${import.meta.env.FAUCET_URL}/oauth/authUrl/${provider}`, {
      method: 'POST',
      body: JSON.stringify({
        redirectURL: redirectURL.toString(),
      }),
    })

    const res = await response.json()
    if (res.error) throw new Error(res.error)
    return res.url
  }

  const oAuthFaucetReceipt = async (
    provider: string,
    code: string,
    recipient: string
  ): Promise<{ amount: string; faucetPackage: string }> => {
    const response = await fetch(`${import.meta.env.FAUCET_URL}/oauth/claim/${provider}/${code}/${recipient}`)
    const res = await response.json()
    if (res.error) throw new Error(res.error)
    return res
  }

  const aragonDaoReceipt = async (): Promise<{ amount: string; faucetPackage: string }> => {
    const data = JSON.stringify({
      message: 'aragonDAO',
      date: new Date().toISOString().split('T')[0],
    })

    const response = await fetch(`${import.meta.env.FAUCET_URL}/aragondao/claim`, {
      method: 'POST',
      body: JSON.stringify({
        signature: await client.wallet?.signMessage(data),
        data,
      }),
    })

    const res = await response.json()
    if (res.error) throw new Error(res.error)
    return res.data
  }

  return {
    oAuthSignInURL,
    oAuthFaucetReceipt,
    aragonDaoReceipt,
  }
}
