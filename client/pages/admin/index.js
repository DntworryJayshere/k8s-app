import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Admin = ({ user }) => (
	<Layout>
		<h1>Admin Dashboard</h1>
		<br />
		<Row className="row">
			<Col md={3}>
				<ul>
					<li>
						<Link href="/admin/category/read">
							<a>All categories</a>
						</Link>
					</li>
					<li>
						<Link href="/admin/link/read">
							<a>All Links</a>
						</Link>
					</li>
					<li>
						<Link href="/admin/category/create">
							<a>Create category</a>
						</Link>
					</li>
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
			<Col md={9}>
				<Row>
					<Col md={3}>
						<div>Total Categories:</div>
					</Col>
					<Col md={3}>
						<div>Total Links Clicked:</div>
					</Col>
					<Col md={3}>
						<div>Top 5 Links:</div>
					</Col>
					<Col md={3}>
						<div>New Users:</div>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<div>Some Graph</div>
					</Col>
					<Col md={6}>
						<div>Some Chart</div>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<div>Some Table</div>
					</Col>
				</Row>
			</Col>
		</Row>
	</Layout>
);

export default withAdmin(Admin);
