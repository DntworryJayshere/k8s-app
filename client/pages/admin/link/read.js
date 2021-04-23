import { useState } from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import moment from 'moment';
import { API } from '../../../config';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Links = ({ token, links, totalLinks, linksLimit }) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);

	const confirmDelete = (e, id) => {
		e.preventDefault();
		// console.log('delete > ', slug);
		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			handleDelete(id);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(`${API}/link/admin/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log('LINK DELETE SUCCESS ', response);
			process.browser && window.location.reload();
		} catch (error) {
			console.log('LINK DELETE ', error);
		}
	};

	const listOfLinks = () =>
		allLinks.map((l, i) => (
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

	const loadMore = async () => {
		let toSkip = skip + limit;

		const response = await axios.post(
			`${API}/link/links`,
			{ skip: toSkip, limit },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		setAllLinks([...allLinks, ...response.data]);
		// console.log('allLinks', allLinks);
		// console.log('response.data.links.length', response.data.links.length);
		setSize(response.data.length);
		setSkip(toSkip);
	};

	return (
		<Layout>
			<Row>
				<Col md={12}>
					<h1 className="display-4 font-weight-bold">All Links</h1>
				</Col>
			</Row>
			<br />
			<InfiniteScroll
				pageStart={0}
				loadMore={loadMore}
				hasMore={size > 0 && size >= limit}
				loader={<img key={0} src="/static/images/loading.gif" alt="loading" />}
			>
				<Row>
					<Col md={12}>{listOfLinks()}</Col>
				</Row>
			</InfiniteScroll>
		</Layout>
	);
};

Links.getInitialProps = async ({ req }) => {
	let skip = 0;
	let limit = 2;

	const token = getCookie('token', req);

	const response = await axios.post(
		`${API}/link/links`,
		{ skip, limit },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return {
		links: response.data,
		totalLinks: response.data.length,
		linksLimit: limit,
		linkSkip: skip,
		token,
	};
};

export default withAdmin(Links);
