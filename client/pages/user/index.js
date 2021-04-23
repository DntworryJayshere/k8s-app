import Layout from '../../components/Layout';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import moment from 'moment';
import { API } from '../../config';
import withUser from '../withUser';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//fully tested (unauthenticated, authenticated user)

const User = ({ user, userLinks, token }) => {
	// tested delete popup from window
	const confirmDelete = (e, id) => {
		e.preventDefault();
		// console.log('delete > ', slug);
		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			handleDelete(id);
		}
	};

	const handleDelete = async (id) => {
		console.log('delete link > ', id);
		try {
			const response = await axios.delete(`${API}/link/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log('LINK DELETE SUCCESS ', response);
			Router.replace('/user');
		} catch (error) {
			console.log('LINK DELETE ', error);
		}
	};

	const listOfLinks = () =>
		userLinks.map((l, i) => (
			<Row key={i} className="alert alert-primary">
				<Col md={8}>
					<h5>Title: {l.title}</h5>

					<h6 style={{ fontSize: '1rem' }}>
						Main Url: {'   '}
						<a href={l.url} target="_blank">
							{l.url}
						</a>
					</h6>

					<h6 style={{ fontSize: '1rem' }}>
						Supplemental Url: {'   '}
						<a href={l.url2} target="_blank">
							{l.url2}
						</a>
					</h6>
				</Col>
				<Col md={4} style={{ textAlign: 'right' }}>
					<span>
						{moment(l.createdAt).fromNow()} by {l.postedBy.name}
					</span>
				</Col>
				<Row>
					<Col md={12}>
						<p>Short Description: {l.shortdescription}</p>
						<p>Description: {l.description}</p>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<p className="text-dark" style={{ fontSize: '.9rem' }}>
							<span>
								Type: {'   '}
								{l.type}
							</span>
						</p>
						<p className="text-dark" style={{ fontSize: '.9rem' }}>
							<span>
								Categories: {'   '}
								{l.categories.map((c, i) => (
									<span key={i}>
										{c.name} , {'   '}
									</span>
								))}
							</span>
						</p>
					</Col>

					<Col md={8}>
						<span className="text-secondary" style={{ textAlign: 'left' }}>
							{l.clicks} clicks
						</span>{' '}
					</Col>
					<Col md={4} style={{ textAlign: 'right', cursor: 'pointer' }}>
						<Link href={`/user/link/${l._id}`}>
							<span className="text-warning">Update</span>
						</Link>{' '}
						<span
							onClick={(e) => confirmDelete(e, l._id)}
							className="text-danger"
						>
							Delete
						</span>
					</Col>
				</Row>
			</Row>
		));

	return (
		<Layout>
			<h1>{user.name}</h1>
			<hr />
			<Row>
				<Col md={2}>
					<ul>
						<li>
							<Link href="/user/link/create">
								<a>Create Link</a>
							</Link>
						</li>
						<li>
							<Link href="/user/profile/update">
								<a>Update Profile</a>
							</Link>
						</li>
					</ul>
				</Col>
				<Col md={10}>
					<h2>Your links</h2>
					<br />
					{listOfLinks()}
				</Col>
			</Row>
		</Layout>
	);
};

export default withUser(User);
