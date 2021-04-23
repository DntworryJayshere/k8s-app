import { useState } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import Layout from '../../../components/Layout';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ForgotPassword = () => {
	const [state, setState] = useState({
		email: '',
		success: '',
		error: '',
	});
	const { email, success, error } = state;

	const onChange = (e) =>
		setState({ ...state, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(`${API}/auth/forgot-password`, {
				email,
			});
			// console.log('FORGOT PASSWORD', response);
			setState({
				...state,
				email: '',
				success: response.data.message,
			});
		} catch (error) {
			console.log('FORGOT PW ERROR', error);
			setState({
				...state,
				error: error.response.data.error,
			});
		}
	};

	const passwordForgotForm = () => (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					value={email}
					onChange={onChange}
					name="email"
					type="email"
					placeholder="Type your email"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Button name="submit" type="submit" value="submit">
					Submit
				</Button>
			</Form.Group>
		</Form>
	);

	return (
		<Layout>
			<Row>
				<Col md={6} className="offset-md-3">
					<h1>Forgot Password</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{passwordForgotForm()}
				</Col>
			</Row>
		</Layout>
	);
};

export default ForgotPassword;
