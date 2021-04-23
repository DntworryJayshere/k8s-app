import { useState } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Update = ({ oldCategory, token }) => {
	const [state, setState] = useState({
		name: oldCategory.name,
		content: oldCategory.content,
		image: '',
		imagePreview: oldCategory.image.url,
		error: '',
		success: '',
	});

	const { name, content, image, success, error } = state;

	const onChange = (e) =>
		setState({ ...state, [e.target.name]: e.target.value });

	const handleImage = (event) => {
		let fileInput = false;
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				'JPEG',
				100,
				0,
				(uri) => {
					// console.log(uri);
					setState({ ...state, image: uri, success: '', error: '' });
				},
				'base64'
			);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state });
		console.table({ name, content, image });
		try {
			const response = await axios.put(
				`${API}/category/${oldCategory.slug}`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log('CATEGORY UPDATE RESPONSE', response);
			setState({
				...state,
				name: '',
				content: '',
				error: '',
				imagePreview: response.data.image.url,
				success: `${response.data.name} is updated`,
			});
		} catch (error) {
			console.log('CATEGORY UPDATE ERROR', error);
			setState({ ...state, error: error.response.data.error });
		}
	};

	const updateCategoryForm = () => (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>Name</Form.Label>
				<Form.Control
					value={name}
					onChange={onChange}
					name="name"
					type="text"
					placeholder="enter the name"
					required
				/>
			</Form.Group>

			<br />
			<Form.Group>
				<Form.Label>Description</Form.Label>
				<Form.Control
					as="textarea"
					rows={5}
					value={content}
					onChange={onChange}
					name="content"
					type="text"
					placeholder="enter a short description"
					required
				/>
			</Form.Group>
			<br />
			<Form.Group>
				<Form.Label>Upload Image: </Form.Label>
				<Form.File onChange={handleImage} type="file" accept="image/*" />
			</Form.Group>
			<br />
			<Form.Group>
				<Button name="submit" type="submit" value="Update">
					Update
				</Button>
			</Form.Group>
		</Form>
	);

	return (
		<Layout>
			<Row>
				<Col md={6} className="offset-md-3">
					<h1>Update category</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{updateCategoryForm()}
				</Col>
			</Row>
		</Layout>
	);
};

Update.getInitialProps = async ({ req, query, token }) => {
	const response = await axios.post(`${API}/category/${query.slug}`);
	return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);
