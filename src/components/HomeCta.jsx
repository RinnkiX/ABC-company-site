import { useAuth } from '@clerk/astro/react';

export default function HomeCta() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded || isSignedIn) {
		return null;
	}

	return (
		<section className="cta-section">
			<h2>Ready To Take Your Business Further?</h2>
			<p>Sign in to access your dashboard and business insights.</p>
			<a href="/sign-in" className="btn btn--primary">Sign In / Register</a>
		</section>
	);
}
