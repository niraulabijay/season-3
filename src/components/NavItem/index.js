import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function NavItem({path, title, active}) {
	return (
		<Link to={path}>
			<span className={active && "active"}>{title}</span>
		</Link>
	)
}
