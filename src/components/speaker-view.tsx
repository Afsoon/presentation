import { SlidePreview } from "@/components/slide-preview";
import { SpeakerNavigation } from "@/components/speaker-navigation";
import { SpeakerTimer } from "@/components/speaker-timer";
import { useSpeakerConnection } from "@/hooks/use-speaker-connection";

export function SpeakerView() {
	const { presentation, initialTimer, disconnected, navigate, saveTimer } = useSpeakerConnection();
	if (!presentation)
		return (
			<main className="min-h-screen bg-neutral-200 p-6 text-foreground dark:bg-neutral-800">
				<p role="status">
					{disconnected ? "Open speaker view from the presentation with Alt + S." : "Connecting to presentation…"}
				</p>
			</main>
		);
	const { current, upcoming: next, notes, available, revision } = presentation;
	return (
		<main className="min-h-screen space-y-5 bg-neutral-200 p-6 text-foreground dark:bg-neutral-800">
			{disconnected && <p role="status">Presentation disconnected.</p>}
			<header className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-semibold">Speaker view</h1>
				{initialTimer && <SpeakerTimer initialState={initialTimer} onChange={saveTimer} />}
			</header>
			<div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start gap-5">
				<section>
					<h2 className="mb-2 font-semibold">Current · {current.name}</h2>
					<SlidePreview revision={revision} id={current.id} snapshot={current.snapshot} />
				</section>
				<div className="space-y-5">
					<section>
						<h2 className="mb-2 font-semibold">Upcoming{next ? ` · ${next.name}` : ""}</h2>
						{next ? (
							<SlidePreview revision={revision} id={next.id} snapshot={next.snapshot} />
						) : (
							<p className="rounded border p-10">End of presentation</p>
						)}
					</section>
					<section className="rounded-lg border border-neutral-300 bg-white p-5 text-neutral-900 shadow-sm dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
						<h2 className="mb-3 text-xl font-semibold">Speaker notes</h2>
						<p className="whitespace-pre-wrap text-lg leading-relaxed">{notes}</p>
					</section>
				</div>
			</div>
			<SpeakerNavigation
				available={disconnected ? { left: false, right: false, up: false, down: false } : available}
				onNavigate={navigate}
			/>
		</main>
	);
}
