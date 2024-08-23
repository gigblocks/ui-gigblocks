"use client"
import WalletButton from "../components/WalletButton"

export default function Register() {
  return (
    <section>
      <div className="main-title text-center">
        <h2 className="title">Register</h2>
        <p className="paragraph">
          Give your visitor a smooth online experience with a solid UX
          design
        </p>
      </div>
      <div className="bg-white rounded-lg mx-auto w-[50%] px-12 py-16 border-black">
      <div className="mb-4">
        <h4>Let's create your account!</h4>
      </div>
        <WalletButton registerSession={true} />
      </div>
    </section>
  )
}