export const SlideWhatIsPgtest = () => {
	return (
		<div className="space-y-10">
			<div className="max-w-3xl space-y-5">
				<p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">Example overview</p>
				<h2 className="text-3xl font-semibold text-balance sm:text-5xl lg:text-6xl">What is pgtest?</h2>
				<p className="text-lg leading-relaxed text-muted-foreground sm:text-2xl">
					Start with a simple database testing workflow: prepare your data, run an operation, and check the result.
				</p>
			</div>
			<ol className="grid gap-6 md:grid-cols-3">
				<li className="space-y-3 rounded-xl border bg-card p-6">
					<p className="text-sm font-medium text-muted-foreground">01</p>
					<h3 className="text-2xl font-semibold">Arrange</h3>
					<p className="leading-relaxed text-muted-foreground">
						Create a small, predictable dataset that captures the scenario you want to test.
					</p>
				</li>
				<li className="space-y-3 rounded-xl border bg-card p-6">
					<p className="text-sm font-medium text-muted-foreground">02</p>
					<h3 className="text-2xl font-semibold">Act</h3>
					<p className="leading-relaxed text-muted-foreground">
						Execute the query or database operation against your prepared data.
					</p>
				</li>
				<li className="space-y-3 rounded-xl border bg-card p-6">
					<p className="text-sm font-medium text-muted-foreground">03</p>
					<h3 className="text-2xl font-semibold">Assert</h3>
					<p className="leading-relaxed text-muted-foreground">
						Compare the actual result with your expectations, including an edge case or two.
					</p>
				</li>
			</ol>
		</div>
	);
};
