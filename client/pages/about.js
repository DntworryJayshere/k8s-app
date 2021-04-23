import Layout from '../components/Layout';
import Link from 'next/link';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function About() {
	return (
		<Layout>
			<Row>
				<Col md={12}>
					<h1 className="font-weight-bold text-center p-2">
						What is scalableapp.cloud?
					</h1>
				</Col>
			</Row>
			<Row>
				<Col md={10} className="offset-md-1 p-2">
					<p>
						Scalableapp.cloud represents a focal point for all of the{' '}
						<strong>Applications/Projects</strong> I’ve built,{' '}
						<strong>Repositories</strong> I’ve committed to,{' '}
						<strong>Documents</strong> I've earned, <strong>Tutorials</strong>{' '}
						I’ve completed, and <strong>Resources</strong> I frequent.
					</p>
					<p>
						From a technical perspective - scalableapp.cloud originated as a
						full-stack MongoDB <small>Atlas</small>, Express, React, and Node.js
						(<strong>MERN</strong>) application. The registration, reset
						password, and link posting functionalities integrate with AWS Simple
						Email Service(<strong>SES</strong>). AWS Simple Storage Service(
						<strong>S3</strong>) stores all Category images.{' '}
						<strong>Next.js</strong> is utilized to deliver static and
						server-side rendered webpages at runtime, and{' '}
						<strong>React-Bootstrap</strong> provides layout/component structure
						and styling. <strong>PM2</strong> is the production daemon process
						manager. <strong>Nginx</strong> functions as the web server and
						reverse proxy. The application is running on an{' '}
						<strong>Ubuntu</strong> Server{' '}
						<small>Application Machine Image</small>(AMI) on an Elastic Compute
						Cloud(<strong>EC2</strong>) instance. The Domain was purchased
						through <strong>namecheap</strong>, and the SSL Cert obtained
						through <strong>letsencrypt</strong>. You can review the publicly
						available code through the{' '}
						<Link
							href="https://github.com/DntworryJayshere/scalable-mern-app"
							passHref
						>
							<a target="_blank">Github Repo</a>
						</Link>
						.
					</p>
					<p>
						Inorder to view the full <strong>functionality/routing</strong> of
						the application please feel free to use the below User & Admin{' '}
						<strong>login </strong>information.
					</p>
					<p>
						<strong>User: </strong> email: scalableapp.user@gmail.com |
						pw:123456
					</p>
					<p>
						<strong>Admin: </strong> email: sclalableapp.admi@gmail.com |
						pw:123456
					</p>
					<p>
						<strong>PLEASE DO NOT </strong>attempt to change passwords, delete
						categories, or delete links unless <strong>YOU </strong>created them
						previously. Thanks for looking!
					</p>
				</Col>
			</Row>
		</Layout>
	);
}
export default About;
