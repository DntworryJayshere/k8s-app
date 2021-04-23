import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { updateUser } from '../../../helpers/auth';
import withUser from '../../withUser';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Profile = ({ user, token }) => {
	const [state, setState] = useState({
		name: user.name,
		email: user.email,
		password: '',
		error: '',
		success: '',
		loadedCategories: [],
		categories: user.categories,
	});

	const {
		name,
		email,
		password,
		error,
		success,
		loadedCategories,
		categories,
	} = state;

	// load categories when component mounts using useEffect
	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/category/categories`);
		setState({ ...state, loadedCategories: response.data });
	};

	const handleToggle = (c) => () => {
		// return the first index or -1
		const clickedCategory = categories.indexOf(c);
		const all = [...categories];

		if (clickedCategory === -1) {
			all.push(c);
		} else {
			all.splice(clickedCategory, 1);
		}
		console.log('all >> categories', all);
		setState({ ...state, categories: all, success: '', error: '' });
	};

	// show categories > checkbox
	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map((c, i) => (
				<li className="list-unstyled" key={c._id}>
					<Form.Check
						label={c.name}
						type="checkbox"
						onChange={handleToggle(c._id)}
					/>
				</li>
			))
		);
	};

	const onChange = (e) =>
		setState({ ...state, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		console.table({
			name,
			email,
			password,
			categories,
		});
		setState({ ...state });

		try {
			const response = await axios.put(
				`${API}/user`,
				{
					name,
					password,
					categories,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response);
			updateUser(response.data, () => {
				setState({
					...state,
					success: 'Profile updated successfully',
				});
			});
		} catch (error) {
			console.log(error);
			setState({
				...state,
				error: error.response.data.error,
			});
		}
	};

	const updateForm = () => (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>Full Name</Form.Label>
				<Form.Control
					value={name}
					onChange={onChange}
					name="name"
					type="text"
					placeholder="enter your full name..."
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control
					value={email}
					onChange={onChange}
					name="email"
					type="email"
					placeholder="enter your address..."
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control
					value={password}
					onChange={onChange}
					name="password"
					type="password"
					placeholder="enter your password..."
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Category</Form.Label>
				<ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
					{showCategories()}
				</ul>
			</Form.Group>
			<Form.Group>
				<Button name="submit" type="submit" value="Register">
					Register
				</Button>
			</Form.Group>
		</Form>
	);

	return (
		<Layout>
			<Col md={6} className="offset-md-3">
				<h1>Update Profile</h1>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{updateForm()}
			</Col>
		</Layout>
	);
};

export default withUser(Profile);
