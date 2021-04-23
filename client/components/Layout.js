import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, logout } from '../helpers/auth';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	const head = () => (
		<Head>
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"
				integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl"
				crossOrigin="anonymous"
			/>
			<link rel="stylesheet" href="/static/css/styles.css" />
		</Head>
	);

	const nav = () => (
		<Nav className="justify-content-center">
			<Nav.Item>
				<Link href="/" passHref>
					<Nav.Link as="a">Home</Nav.Link>
				</Link>
			</Nav.Item>
			<Nav.Item>
				<Link href="/about" passHref>
					<Nav.Link as="a">About</Nav.Link>
				</Link>
			</Nav.Item>
			<Nav.Item>
				<Link href="/user/link/create" passHref>
					<Nav.Link as="a">Submit Link</Nav.Link>
				</Link>
			</Nav.Item>

			{!isAuth() && (
				<React.Fragment>
					<Nav.Item>
						<Link href="/login" passHref>
							<Nav.Link as="a">Login</Nav.Link>
						</Link>
					</Nav.Item>
					<Nav.Item>
						<Link href="/register" passHref>
							<Nav.Link as="a">Register</Nav.Link>
						</Link>
					</Nav.Item>
				</React.Fragment>
			)}

			{isAuth() && isAuth().role === 'admin' && (
				<React.Fragment>
					<Nav.Item>
						<Link href="/admin" passHref>
							<Nav.Link as="a">Admin Dashboard</Nav.Link>
						</Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link style={{ cursor: 'pointer' }} as="a" onClick={logout}>
							Logout
						</Nav.Link>
					</Nav.Item>
				</React.Fragment>
			)}

			{isAuth() && isAuth().role === 'subscriber' && (
				<React.Fragment>
					<Nav.Item>
						<Link href="/user" passHref>
							<Nav.Link as="a">User Dashboard</Nav.Link>
						</Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link style={{ cursor: 'pointer' }} as="a" onClick={logout}>
							Logout
						</Nav.Link>
					</Nav.Item>
				</React.Fragment>
			)}
		</Nav>
	);

	return (
		<>
			<Navbar
				collapseOnSelect
				expand="lg"
				bg="light"
				variant="light"
				className="justify-content-center"
			>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse className="justify-content-center">
					<React.Fragment>
						{head()} {nav()}
					</React.Fragment>
				</Navbar.Collapse>
			</Navbar>
			<Container className="pt-5 pb-5">{children}</Container>
		</>
	);
};

export default Layout;
