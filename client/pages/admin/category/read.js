import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import Link from 'next/link';
import { showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const Read = ({ token }) => {
	const [state, setState] = useState({
		error: '',
		success: '',
		categories: [],
	});

	const { success, categories } = state;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/category/categories`);
		setState({ ...state, categories: response.data });
	};

	const confirmDelete = (e, slug) => {
		e.preventDefault();
		// console.log('delete > ', slug);
		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			handleDelete(slug);
		}
	};

	const handleDelete = async (slug) => {
		try {
			const response = await axios.delete(`${API}/category/${slug}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log('CATEGORY DELETE SUCCESS ', response);
			loadCategories();
		} catch (error) {
			console.log('CATEGORY DELETE ', error);
		}
	};

	const listCategories = () =>
		categories.map((c, i) => (
			<Col key={i} md={4} style={{ padding: '1rem' }}>
				<Card style={{ flex: 1 }} key={i}>
					<Card.Img
						variant="top"
						src={c.image && c.image.url}
						alt={c.name}
						style={{ margin: 'auto', width: '100px', height: '100px' }}
					/>
					<Card.Body>
						<Link href={`/link/links/${c.slug}`}>
							<Card.Title as="a">{c.name}</Card.Title>
						</Link>
						<Card.Text>{c.text}</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">
							{' '}
							<Link href={`/admin/category/${c.slug}`}>
								<button
									style={{ margin: '.5rem' }}
									className="btn btn-sm btn-outline-success btn-block"
								>
									Update
								</button>
							</Link>
							<button
								style={{ margin: '.5rem' }}
								onClick={(e) => confirmDelete(e, c.slug)}
								className="btn btn-sm btn-outline-danger btn-block"
							>
								Delete
							</button>
						</small>
					</Card.Footer>
				</Card>
			</Col>
		));

	return (
		<Layout>
			<Row>
				<Col>
					<h1>List of categories</h1>
					<br />
					{success && showSuccessMessage(success)}
				</Col>
			</Row>

			<CardGroup style={{ display: 'flex' }}>{listCategories()}</CardGroup>
		</Layout>
	);
};

export default withAdmin(Read);
