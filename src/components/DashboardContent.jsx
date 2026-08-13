import { useAuth } from '@clerk/astro/react';
import { useEffect } from 'react';
import './dashboard.css';

const KPIS = [
	{ value: '12+', label: 'Years of Experience' },
	{ value: '45', label: 'Successful Projects' },
	{ value: '15', label: 'Corporate Clients' },
	{ value: '98%', label: 'Client Satisfaction' },
	{ value: '94%', label: 'Client Retention' },
	{ value: '72', label: 'Avg. NPS Score' },
];

// Quarterly revenue in USD thousands.
const REVENUE_TREND = [
	{ label: "Q1 '25", value: 100 },
	{ label: "Q2 '25", value: 112 },
	{ label: "Q3 '25", value: 124 },
	{ label: "Q4 '25", value: 140 },
	{ label: "Q1 '26", value: 120 },
	{ label: "Q2 '26", value: 132 },
];
const MAX_REV = Math.max(...REVENUE_TREND.map((q) => q.value));

// FY2026 YTD (H1) revenue split by service line — sums to $250K.
const SERVICE_LINES = [
	{ name: 'Web Development', pct: 30, amount: 75 },
	{ name: 'Business Strategy', pct: 27, amount: 68 },
	{ name: 'Digital Marketing', pct: 23, amount: 58 },
	{ name: 'Branding & Identity', pct: 20, amount: 49 },
];

// Delivered project counts across service lines — sums to 45.
const PROJECT_MIX = [
	{ name: 'Web Development', count: 17 },
	{ name: 'Business Strategy', count: 11 },
	{ name: 'Digital Marketing', count: 9 },
	{ name: 'Branding & Identity', count: 8 },
];
const TOTAL_PROJECTS = PROJECT_MIX.reduce((sum, p) => sum + p.count, 0);

const CLIENTS = [
	{ name: 'Apex Financial', industry: 'Finance', engagement: 'Business Strategy', value: '$48K', status: 'Closing Q4', tone: 'blue' },
	{ name: 'NovaTech Group', industry: 'Fintech', engagement: 'Web Development', value: '$42K', status: 'Active', tone: 'green' },
	{ name: 'BluePeak Energy', industry: 'Energy', engagement: 'Web Development', value: '$34K', status: 'Onboarding', tone: 'amber' },
	{ name: 'MedCore Health', industry: 'Healthcare', engagement: 'Branding & Identity', value: '$29K', status: 'Active', tone: 'green' },
	{ name: 'Northwind Logistics', industry: 'Logistics', engagement: 'Web Development', value: '$24K', status: 'Active', tone: 'green' },
	{ name: 'Vertice Retail', industry: 'E-commerce', engagement: 'Digital Marketing', value: '$19K', status: 'Renewal Q3', tone: 'amber' },
];

// Headcount by department — sums to 12.
const TEAM_DEPTS = [
	{ name: 'Engineering', count: 5 },
	{ name: 'Strategy & Consulting', count: 2 },
	{ name: 'Design', count: 2 },
	{ name: 'Marketing', count: 2 },
	{ name: 'Client Success', count: 1 },
];
const TEAM_MAX = Math.max(...TEAM_DEPTS.map((d) => d.count));

const OPS_STATS = [
	{ value: '76%', label: 'Capacity Utilization' },
	{ value: '2.8 mo', label: 'Avg. Project Duration' },
	{ value: '7 mo', label: 'Avg. Engagement Length' },
	{ value: '1', label: 'Open Roles' },
];

const MILESTONES = [
	{ date: 'Jul 2026', text: 'Signed Apex Financial to a 12-month business strategy engagement ($48K).' },
	{ date: 'Jun 2026', text: 'Launched the BluePeak Energy client portal — first-month organic traffic +42%.' },
	{ date: 'May 2026', text: 'Renewed the MedCore Health brand program for a third consecutive year.' },
	{ date: 'Apr 2026', text: 'Named "Best B2B Agency" at the Regional Digital Excellence Awards.' },
	{ date: 'Feb 2026', text: 'Crossed $24M in cumulative client revenue impact since 2018.' },
];

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
		<div className="dash">
			<div className="dash-head">
				<h1>Dashboard</h1>
				<p className="dash-sub">
					Welcome back. Account <code>{userId}</code> — ABC Company performance overview.
				</p>
			</div>

			<img
				className="dash-banner"
				src="/images/viora/dashboard/expected-outcomes.jpg"
				alt="Business outcomes"
			/>

			<section className="dash-section">
				<div className="dash-section-head">
					<h2>Company Overview</h2>
					<span className="dash-hint">Updated Aug 2026</span>
				</div>
				<div className="dash-kpis">
					{KPIS.map((k) => (
						<div className="dash-kpi" key={k.label}>
							<div className="dash-kpi-value">{k.value}</div>
							<div className="dash-kpi-label">{k.label}</div>
						</div>
					))}
				</div>
			</section>

			<section className="dash-section">
				<div className="dash-section-head">
					<h2>Revenue Trend</h2>
					<span className="dash-hint">
						FY2025 total $480K · FY2026 projected $540K (+13% YoY)
					</span>
				</div>
				<div className="dash-card">
					<div className="dash-chart">
						{REVENUE_TREND.map((q) => (
							<div className="dash-col" key={q.label}>
								<span className="dash-bar-value">${q.value}K</span>
								<div className="dash-bar-zone">
									<div
										className="dash-bar"
										style={{ height: `${(q.value / MAX_REV) * 100}%` }}
									/>
								</div>
								<span className="dash-col-label">{q.label}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="dash-section">
				<div className="dash-section-head">
					<h2>Book of Business</h2>
					<span className="dash-hint">FY2026 YTD · $250K</span>
				</div>
				<div className="dash-grid-2">
					<div className="dash-card">
						<h3>Revenue by Service Line</h3>
						{SERVICE_LINES.map((s) => (
							<div className="dash-progress-item" key={s.name}>
								<div className="dash-progress-head">
									<span>{s.name}</span>
									<span>
										${s.amount}K · {s.pct}%
									</span>
								</div>
								<div className="dash-progress-track">
									<div
										className="dash-progress-fill"
										style={{ width: `${s.pct}%` }}
									/>
								</div>
							</div>
						))}
					</div>
					<div className="dash-card">
						<h3>Project Portfolio</h3>
						<p className="dash-card-sub">
							{TOTAL_PROJECTS} projects delivered since 2014
						</p>
						{PROJECT_MIX.map((p) => (
							<div className="dash-progress-item" key={p.name}>
								<div className="dash-progress-head">
									<span>{p.name}</span>
									<span>{p.count}</span>
								</div>
								<div className="dash-progress-track">
									<div
										className="dash-progress-fill dash-progress-fill--alt"
										style={{ width: `${(p.count / TOTAL_PROJECTS) * 100}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="dash-section">
				<div className="dash-section-head">
					<h2>Key Client Accounts</h2>
					<span className="dash-hint">Top accounts by contract value</span>
				</div>
				<div className="dash-card dash-table-wrap">
					<table className="dash-table">
						<thead>
							<tr>
								<th>Client</th>
								<th>Industry</th>
								<th>Engagement</th>
								<th>Contract Value</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{CLIENTS.map((c) => (
								<tr key={c.name}>
									<td>
										<strong>{c.name}</strong>
									</td>
									<td>{c.industry}</td>
									<td>{c.engagement}</td>
									<td className="dash-mono">{c.value}</td>
									<td>
										<span className={`dash-badge dash-badge-${c.tone}`}>{c.status}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section className="dash-section">
				<div className="dash-section-head">
					<h2>Team &amp; Operations</h2>
					<span className="dash-hint">{TEAM_DEPTS.reduce((s, d) => s + d.count, 0)} team members</span>
				</div>
				<div className="dash-grid-2">
					<div className="dash-card">
						<h3>Headcount by Department</h3>
						{TEAM_DEPTS.map((d) => (
							<div className="dash-progress-item" key={d.name}>
								<div className="dash-progress-head">
									<span>{d.name}</span>
									<span>{d.count}</span>
								</div>
								<div className="dash-progress-track">
									<div
										className="dash-progress-fill dash-progress-fill--green"
										style={{ width: `${(d.count / TEAM_MAX) * 100}%` }}
									/>
								</div>
							</div>
						))}
					</div>
					<div className="dash-card">
						<h3>Operational Metrics</h3>
						<div className="dash-mini-stats">
							{OPS_STATS.map((o) => (
								<div className="dash-mini" key={o.label}>
									<strong>{o.value}</strong>
									<span>{o.label}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="dash-section">
				<div className="dash-section-head">
					<h2>Recent Milestones</h2>
					<span className="dash-hint">H1 2026</span>
				</div>
				<div className="dash-card">
					<div className="dash-timeline">
						{MILESTONES.map((m) => (
							<div className="dash-timeline-item" key={m.date}>
								<div className="dash-timeline-date">{m.date}</div>
								<div className="dash-timeline-text">{m.text}</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
