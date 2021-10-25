import React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './style.module.scss';

export default function NavItem({path, title, active}) {
	return (
		<Link to={path} className={active ? styles.active : null}>
			<span>{title}</span>
		</Link>
	)
}
