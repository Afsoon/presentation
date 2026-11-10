import { SlideContent } from "@/slides/slide-content";
import { PreviewContext } from "@/stores/use-slide-actor";

export function SlidePreview({ id, snapshot, revision }: { id: string; snapshot: unknown; revision: number }) {
	return (
		<div
			aria-label={`Preview of ${id}`}
			className="@container/preview relative aspect-[8/5] overflow-hidden rounded-lg border bg-background"
		>
			<div
				inert
				className="@container/slide pointer-events-none absolute left-0 top-0 isolate grid grid-rows-[minmax(0,1fr)] overflow-hidden bg-background text-foreground"
				// Keep the slide canvas consistent; CSS scales it to the preview's available width.
				style={{ width: 1600, height: 1000, transform: "scale(calc(100cqw / 1600px))", transformOrigin: "top left" }}
			>
				<section className="min-h-0 overflow-hidden p-6 @min-[640px]/slide:p-12 @min-[1024px]/slide:p-20">
					<div className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center">
						<PreviewContext value={{ id, snapshot }}>
							<SlideContent key={`${id}-${revision}`} id={id} />
						</PreviewContext>
					</div>
				</section>
			</div>
		</div>
	);
}
