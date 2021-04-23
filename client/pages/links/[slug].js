import { useState, useEffect, Fragment } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import axios from 'axios';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API, APP_NAME } from '../../config';
import InfiniteScroll from 'react-infinite-scroller';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Links = ({ query, category, links, totalLinks, linksLimit }) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);
	const [popular, setPopular] = useState([]);

	const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, '');

	const head = () => (
		<Head>
			<title>
				{category.name} | {APP_NAME}
			</title>
			<meta
				name="description"
				content={stripHTML(category.content.substring(0, 160))}
			/>
			<meta property="og:title" content={category.name} />
			<meta
				property="og:description"
				content={stripHTML(category.content.substring(0, 160))}
			/>
			<meta property="og:image" content={category.image.url} />
			<meta property="og:image:secure_url" content={category.image.url} />
		</Head>
	);

	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/link/popular/${category.slug}`);
		// console.log(response);
		setPopular(response.data);
	};

	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/link/click-count`, { linkId });
		loadPopular();
	};

	// const loadUpdatedLinks = async () => {
	// 	const response = await axios.post(`${API}/category/${query.slug}`);
	// 	setAllLinks(response.data.links);
	// };

	const listOfPopularLinks = () =>
		popular.map((l, i) => (
			<Row key={i} className="alert alert-primary">
				<Col md={12}>
					<h5>Title: {l.title}</h5>
					<h6 onClick={(e) => handleClick(l._id)} style={{ fontSize: '1rem' }}>
						Main Url: {'   '}
						<a href={l.url} target="_blank">
							{l.url}
						</a>
					</h6>
					<p>Short Description: {l.shortDescription}</p>
				</Col>
				<Row>
					<Col md={12}>
						<span className="text-secondary" style={{ textAlign: 'left' }}>
							{l.clicks} clicks
						</span>{' '}
					</Col>
				</Row>
			</Row>
		));

	const listOfLinks = () =>
		allLinks.map((l, i) => (
			<Row key={i} className="alert alert-primary">
				<Row>
					<Col md={8}>
						<h5>Title: {l.title}</h5>

						<h6
							onClick={(e) => handleClick(l._id)}
							style={{ fontSize: '1rem' }}
						>
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
				</Row>
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
				</Row>
			</Row>
		));

	const loadMore = async () => {
		let toSkip = skip + limit;
		const response = await axios.post(`${API}/category/${query.slug}`, {
			skip: toSkip,
			limit,
		});
		setAllLinks([...allLinks, ...response.data.links]);
		console.log('allLinks', allLinks);
		console.log('response.data.links.length', response.data.links.length);
		setSize(response.data.links.length);
		setSkip(toSkip);
	};

	return (
		<Fragment>
			{head()}
			<Layout>
				<Row>
					<Col md={8}>
						<h1 className="font-weight-bold">{category.name} - URL/Links</h1>
						<div className="lead alert alert-secondary">
							{renderHTML(category.content || '')}
						</div>
					</Col>
					<Col md={4}>
						<img
							src={category.image.url}
							alt={category.name}
							style={{ width: 'auto', maxHeight: '200px' }}
						/>
					</Col>
				</Row>
				<br />
				<InfiniteScroll
					pageStart={0}
					loadMore={loadMore}
					hasMore={size > 0 && size >= limit}
					loader={
						<img key={0} src="/static/images/loading.gif" alt="loading" />
					}
				>
					<Row>
						<Col md={8}>{listOfLinks()}</Col>
						<Col md={4}>
							<h2 className="lead">Most popular in {category.name}</h2>
							<div className="p-3">{listOfPopularLinks()}</div>
						</Col>
					</Row>
				</InfiniteScroll>
			</Layout>
		</Fragment>
	);
};

Links.getInitialProps = async ({ query, req }) => {
	let skip = 0;
	let limit = 2;

	const response = await axios.post(`${API}/category/${query.slug}`, {
		skip,
		limit,
	});
	return {
		query,
		category: response.data.category,
		links: response.data.links,
		totalLinks: response.data.links.length,
		linksLimit: limit,
		linkSkip: skip,
	};
};

export default Links;
