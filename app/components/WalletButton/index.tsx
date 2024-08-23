import { useAccount, useDisconnect } from 'wagmi'
import Link from 'next/link';
import { config } from '@/app/config'


export default function WalletButton({ registerSession }: Readonly<{ registerSession: boolean }>) {
  const { disconnect } = useDisconnect();
  const account = useAccount({
      config,
  })

  if (registerSession && account.isConnected) {
    return (
      <div className="dropdown">
        <a className="dropdown-button">
          {account.address}
        </a>
        <div className="dropdown-content cursor-pointer" style={{ width: 400 /* need to set width manually*/ }}>
            <a onClick={() => disconnect()}>
              <span className="title">Disconnect</span>
            </a>
        </div>
      </div>
    )
  }
  if (account.isConnected) {
    return (
      <div className="dropdown">
        <a className="dropdown-button">
          <span className="title">{account.address && account.address.slice(0,10)}...</span>{" "}
        </a>
        <div className="dropdown-content">
            <Link href={"/my-profile"}>
              <span className="title">Profile</span>
            </Link>
            <a onClick={() => disconnect()}>
                <span className="title">Disconnect</span>
            </a>
        </div>
      </div>
    )
  }
  return <w3m-button />
}