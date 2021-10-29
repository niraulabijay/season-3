import './style.css';

export default function WalletCard({selectedAccount, balance, handleDisconnectWallet}) {
  return (
    <div className="walletContainer">
      <div>
        <h3>
          Wallet
        </h3>
        <div>
          <h5>Address</h5>
          <span>{selectedAccount}</span>
        </div>
        <div>
          <h5>Balance</h5>
          <span>{balance}</span>
        </div>
      </div>
      <button onClick={handleDisconnectWallet}>Disconnect</button>
    </div>
  );
};
