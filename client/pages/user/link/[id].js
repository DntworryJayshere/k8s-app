// imports
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import withUser from '../../withUser';
import { isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Update = ({ oldLink, token }) => {
	// state
	const [state, setState] = useState({
		title: oldLink.title,
		shortdescription: oldLink.shortdescription,
		description: oldLink.description,
		url: oldLink.url,
		url2: oldLink.url2,
		type: oldLink.type,
		categories: oldLink.categories,
		loadedCategories: [],
		success: '',
		error: '',
	});

	const {
		title,
		shortdescription,
		description,
		url,
		url2,
		type,
		categories,
		loadedCategories,
		success,
		error,
	} = state;

	// load categories when component mounts using useEffect
	useEffect(() => {
		loadCategories();
	}, [success]);

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
		setState({ ...state });

		try {
			const response = await axios.post(
				`${API}/link`,
				{ title, shortdescription, description, url, url2, type, categories },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setState({
				...state,
				title: '',
				shortdescription: '',
				description: '',
				url: '',
				url2: '',
				type: '',
				success: 'Link is created',
				error: '',
				loadedCategories: [],
				categories: [],
			});
		} catch (error) {
			console.log('LINK SUBMIT ERROR', error);
			setState({ ...state, error: error.response.data.error });
		}
	};

	const showTypes = () => (
		<React.Fragment>
			<Form.Group as={Row}>
				<Form.Label as="legend">Type:</Form.Label>
				<Form.Control
					as="select"
					custom
					name="type"
					value={type}
					onChange={onChange}
					type="text"
					required
				>
					<option></option>
					<option>Project</option>
					<option>Personal</option>
					<option>Source Documentation</option>
					<option>Learning Resource</option>
				</Form.Control>
			</Form.Group>
		</React.Fragment>
	);

	// link create form
	const submitLinkForm = () => (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>Title</Form.Label>
				<Form.Control
					value={title}
					onChange={onChange}
					name="title"
					type="text"
					placeholder="enter the title"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Short Description</Form.Label>
				<Form.Control
					value={shortdescription}
					onChange={onChange}
					name="shortdescription"
					type="text"
					placeholder="enter a short description"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Description</Form.Label>
				<Form.Control
					as="textarea"
					rows={5}
					value={description}
					onChange={onChange}
					name="description"
					type="textarea"
					placeholder="enter a full description"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>URL</Form.Label>
				<Form.Control
					value={url}
					onChange={onChange}
					name="url"
					type="url"
					placeholder="enter the url"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Additional URL</Form.Label>
				<Form.Control
					value={url2}
					onChange={onChange}
					name="url2"
					type="url"
					placeholder="enter additional url if neccessary"
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Button disabled={!token} name="submit" type="submit" value="Post">
					{isAuth() || token ? 'Post' : 'Login to post'}
				</Button>
			</Form.Group>
		</Form>
	);

	return (
		<Layout>
			<Row>
				<Col md={12}>
					<h1>Update Link/URL</h1>
					<br />
				</Col>
			</Row>
			<Row>
				<Col md={4}>
					<Form.Group as={Row}>
						<Form.Label as="legend">Category:</Form.Label>

						<ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
							{showCategories()}
						</ul>
					</Form.Group>
					{showTypes()}
				</Col>
				<Col md={8}>
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{submitLinkForm()}
				</Col>
			</Row>
		</Layout>
	);
};

Update.getInitialProps = async ({ req, token, query }) => {
	const response = await axios.get(`${API}/link/${query.id}`);
	return { oldLink: response.data, token };
};

export default withUser(Update);
