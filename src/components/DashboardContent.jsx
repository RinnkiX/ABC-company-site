import { useAuth, UserButton } from '@clerk/astro/react';
import { useEffect } from 'react';

export default function DashboardContent() {
	const { isSignedIn, isLoaded, userId } = useAuth();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			window.location.href = '/sign-in?redirectTo=%2Fdashboard';
		}
	}, [isLoaded, isSignedIn]);

	if (!isLoaded) {
		return <p>Loading dashboard…</p>;
	}

	if (!isSignedIn) {
		return <p>Redirecting to sign in…</p>;
	}

	return (
		<>
			<h1>Dashboard</h1>
			<p className="welcome">
				Welcome back! Your user ID is: <code>{userId}</code>
			</p>

			<img
				className="dashboard-banner"
				src="/images/viora/dashboard/expected-outcomes.jpg"
				alt="Business outcomes"
			/>

			<section className="stats">
				<h2>Company Overview</h2>
				<div className="stats-grid">
					<div className="stat-card">
						<h3>10+</h3>
						<p>Years of Experience</p>
					</div>
					<div className="stat-card">
						<h3>250+</h3>
						<p>Successful Projects</p>
					</div>
					<div className="stat-card">
						<h3>50+</h3>
						<p>Corporate Clients</p>
					</div>
					<div className="stat-card">
						<h3>98%</h3>
						<p>Client Satisfaction</p>
					</div>
				</div>
			</section>
		</>
	);
}
