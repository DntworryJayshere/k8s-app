import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	showSuccessMessage,
	showErrorMessage,
} from '../../../../helpers/alerts';
import { API } from '../../../../config';
import { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		newPassword: '',
		success: '',
		error: '',
	});
	const { name, token, newPassword, success, error } = state;

	useEffect(() => {
		console.log(router);
		const decoded = jwt.decode(router.query.id);
		if (decoded)
			setState({ ...state, name: decoded.name, token: router.query.id });
	}, [router]);

	const onChange = (e) =>
		setState({ ...state, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state });
		try {
			const response = await axios.put(`${API}/auth/reset-password`, {
				resetPasswordLink: token,
				newPassword,
			});
			console.log('FORGOT PASSWORD', response);
			setState({
				...state,
				newPassword: '',
				success: response.data.message,
			});
		} catch (error) {
			console.log('RESET PW ERROR', error);
			setState({
				...state,
				error: error.response.data.error,
			});
		}
	};

	const passwordResetForm = () => (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					value={newPassword}
					onChange={onChange}
					name="newPassword"
					type="password"
					placeholder="Type new password"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Button name="submit" type="submit" value="Reset">
					Reset
				</Button>
			</Form.Group>
		</Form>
	);

	return (
		<Layout>
			<Row>
				<Col md={6} className="offset-md-3">
					<h1>Hi {name}, Ready to Reset Password?</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{passwordResetForm()}
				</Col>
			</Row>
		</Layout>
	);
};

export default withRouter(ResetPassword);
