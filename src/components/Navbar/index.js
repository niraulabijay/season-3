import React from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import './style.css';
import ConnectWallet from '../ConnectWallet';
import NavItem from '../NavItem';

export default function Navbar({handleConnectWallet, handleDisconnectWallet, selectedAccount, netErr}) {
	const location = useLocation();
	return (
		<div className="navbarContainer">
			<div className="logoWrapper">
				<img alt="logo" src="logo.svg" height="20px" />
			</div>
			<div className="navWrapper">
				{routes.map((route, index) => (
					<NavItem key={index} path={route.path} title={route.title} active={location.pathname === route.path}/>
				))}
				<ConnectWallet
					handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
          selectedAccount={selectedAccount}
          netErr={netErr}
				/>
			</div>
		</div>
	)
}
