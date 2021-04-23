import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { withRouter } from 'next/router';
import Layout from '../../../components/Layout';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const ActivateAccount = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		success: '',
		error: '',
	});
	const { name, token, success, error } = state;

	useEffect(() => {
		let token = router.query.id;
		if (token) {
			const { name } = jwt.decode(token);
			setState({ ...state, name, token });
		}
	}, [router]);

	const clickSubmit = async (e) => {
		e.preventDefault();
		// console.log('activate acccount');
		try {
			const response = await axios.post(`${API}/auth/register/activate`, {
				token,
			});
			// console.log('account activate response', response)
			setState({
				...state,
				name: '',
				token: '',
				success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				error: error.response.data.error,
			});
		}
	};

	return (
		<Layout>
			<Row>
				<Col md={6} className="offset-md-3">
					<h1>Hi {name}, Ready to activate your account?</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					<Button
						onClick={clickSubmit}
						className="btn btn-outline-warning btn-block"
						name="submit"
						type="submit"
						value="Activate"
					>
						Activate
					</Button>
				</Col>
			</Row>
		</Layout>
	);
};

export default withRouter(ActivateAccount);
