import { useAuth, UserButton } from '@clerk/astro/react';

export default function AuthLinks() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<div className="auth-links">
				<span className="auth-link">Loading…</span>
			</div>
		);
	}

	return (
		<div className="auth-links">
			{isSignedIn ? (
				<>
					<a href="/dashboard" className="auth-link">Dashboard</a>
					<UserButton afterSignOutUrl="/" />
				</>
			) : (
				<>
					<a href="/sign-in" className="auth-link">Login</a>
					<a href="/sign-up" className="auth-link signup">Sign Up</a>
				</>
			)}
		</div>
	);
}
