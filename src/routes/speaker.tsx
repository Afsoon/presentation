import { createFileRoute } from "@tanstack/react-router";

import { SpeakerView } from "@/components/speaker-view";

export const Route = createFileRoute("/speaker")({
	head: () => ({ meta: [{ title: "Speaker view" }] }),
	component: SpeakerView,
});
