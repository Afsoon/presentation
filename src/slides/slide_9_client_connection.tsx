import { useActorRef, useSelector } from "@xstate/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

import { CodeComparison } from "@/components/ui/code-comparison";
import Typography from "@/components/ui/typography";
import type { SlideMetadata } from "@/slides/types";
import { subslideControlsStore } from "@/stores/subslide-controls";

import { connectionCode, integresql, pgtest } from "./slide_9_client_connection/slide_9_client_connection.data";
import { clientConnectionMachine } from "./slide_9_client_connection/slide_9_client_connection.machine";

export const metadata = {
	Id: "client-connection",
	name: "Client connection",
	hasSubslides: true,
} satisfies SlideMetadata;

export const SlideClientConnection = () => {
	const actor = useActorRef(clientConnectionMachine, { id: metadata.Id });
	useEffect(() => subslideControlsStore.registerActor(actor), [actor]);
	const state = useSelector(actor, (snapshot) => snapshot.value);
	const reduceMotion = useReducedMotion();
	const hidden = { opacity: 0, y: reduceMotion ? 0 : 16 };
	const visible = { opacity: 1, y: 0 };
	const transition = { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" as const };

	return (
		<div className="space-y-10">
			<header className="space-y-3">
				<Typography level="p-small">PoC Implementation</Typography>
				<Typography level="h2">Client connection</Typography>
			</header>
			<div className="h-[32rem] overflow-hidden">
				<AnimatePresence initial={false} mode="wait">
					{state === "codeComparison" ? (
						<motion.div
							key="code"
							className="h-full"
							initial={hidden}
							animate={visible}
							exit={hidden}
							transition={transition}
						>
							<CodeComparison
								beforeCode={connectionCode.integresql}
								afterCode={connectionCode.pgtest}
								language={connectionCode.language}
								filename={connectionCode.filename}
								beforeLabel="IntegreSQL"
								afterLabel="PgTest"
								lightTheme="github-light"
								darkTheme="github-dark"
							/>
						</motion.div>
					) : state !== "heading" ? (
						<motion.div
							key="columns"
							className="grid items-start gap-8 lg:grid-cols-2"
							initial={hidden}
							animate={visible}
							exit={hidden}
							transition={transition}
						>
							<section aria-label="IntegreSQL" className="space-y-5 rounded-2xl border bg-card p-6">
								<Typography level="h3">{integresql.title}</Typography>
								<Typography level="p">{integresql.content}</Typography>
								<Typography level="p">
									<span className="font-semibold text-foreground">Problem:</span> {integresql.problem}
								</Typography>
							</section>
							<AnimatePresence initial={false}>
								{state === "bothClients" && (
									<motion.section
										key="pgtest"
										aria-label="PgTest"
										className="space-y-5 rounded-2xl border bg-card p-6"
										initial={hidden}
										animate={visible}
										exit={hidden}
										transition={transition}
									>
										<Typography level="h3">{pgtest.title}</Typography>
										<Typography level="p">{pgtest.content}</Typography>
										<Typography level="p">
											<span className="font-semibold text-foreground">Problem:</span> {pgtest.problem}
										</Typography>
									</motion.section>
								)}
							</AnimatePresence>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</div>
	);
};
