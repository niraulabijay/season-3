import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function NavItem({path, title, active}) {
	return (
		<div className="navWrapper">
			<Link to={path} className={active ? "active" : null}>
				<span>{title}</span>
			</Link>
		</div>
	)
}
