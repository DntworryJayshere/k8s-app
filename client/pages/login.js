import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//fully tested for unauthenticated user - login functional for admin and user
const Login = () => {
	const [state, setState] = useState({
		email: '',
		password: '',
		error: '',
		success: '',
	});

	const { email, password, error, success } = state;

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const onChange = (e) =>
		setState({ ...state, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state });
		try {
			const response = await axios.post(`${API}/auth/login`, {
				email,
				password,
			});
			// console.log(response); // data > token / user
			authenticate(response, () =>
				isAuth() && isAuth().role === 'admin'
					? Router.push('/admin')
					: Router.push('/user')
			);
		} catch (error) {
			console.log(error);
			setState({
				...state,
				error: error.response.data.error,
			});
		}
	};

	const loginForm = () => (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>Email Address</Form.Label>
				<Form.Control
					value={email}
					onChange={onChange}
					type="email"
					name="email"
					placeholder="enter your email address..."
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					value={password}
					onChange={onChange}
					type="password"
					name="password"
					placeholder="enter your password..."
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Button className="btn" name="submit" type="submit" value="Login">
					Login
				</Button>
			</Form.Group>
		</Form>
	);

	return (
		<Layout>
			<Col md={6} className="offset-md-3">
				<h1>Login</h1>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{loginForm()}
				<br />
				<Link href="/auth/password/forgot">
					<a className="text-danger float-right">Forgot Password</a>
				</Link>
			</Col>
		</Layout>
	);
};

export default Login;
