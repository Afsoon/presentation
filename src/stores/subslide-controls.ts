import type { ActorRefFrom } from "xstate";

import type { tableOfContentsMachine } from "@/slides/slide_2_table_of_content/slide_2_table_of_content.machine";
import type { reasonsMachine } from "@/slides/slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.machine";
import type { implementationGoalsMachine } from "@/slides/slide_7_implementation_goals/slide_7_implementation_goals.machine";
import type { clientConnectionMachine } from "@/slides/slide_9_client_connection/slide_9_client_connection.machine";
import type { databasePoolStrategyMachine } from "@/slides/slide_10_database_pool_strategy/slide_10_database_pool_strategy.machine";
import type { cleanupDatabaseTriggerMachine } from "@/slides/slide_11_cleanup_database_trigger/slide_11_cleanup_database_trigger.machine";
import type { pocResultsMachine } from "@/slides/slide_12_poc_results/slide_12_poc_results.machine";
import type { extractIoMachine } from "@/slides/slide_14_extract_io_from_manager/slide_14_extract_io_from_manager.machine";
import type { uncappedPoolMachine } from "@/slides/slide_15_not_capping_the_pool/slide_15_not_capping_the_pool.machine";
import type { explicitCleanupMachine } from "@/slides/slide_16_explicit_cleanup_database_command/slide_16_explicit_cleanup_database_command.machine";
import type { v01ResultsMachine } from "@/slides/slide_17_v0_1_results/slide_17_v0_1_results.machine";
import type { v02ChangesMachine } from "@/slides/slide_19_changes_done_for_v0_2/slide_19_changes_done_for_v0_2.machine";
import type { thingsThatDidntWorkMachine } from "@/slides/slide_21_things_that_didnt_work/slide_21_things_that_didnt_work.machine";
import type { resultsMachine } from "@/slides/slide_22_results/slide_22_results.machine";
import type { nextStepsMachine } from "@/slides/slide_23_next_steps/slide_23_next_steps.machine";

type SlideActor =
	| ActorRefFrom<typeof resultsMachine>
	| ActorRefFrom<typeof explicitCleanupMachine>
	| ActorRefFrom<typeof uncappedPoolMachine>
	| ActorRefFrom<typeof nextStepsMachine>
	| ActorRefFrom<typeof thingsThatDidntWorkMachine>
	| ActorRefFrom<typeof v02ChangesMachine>
	| ActorRefFrom<typeof tableOfContentsMachine>
	| ActorRefFrom<typeof reasonsMachine>
	| ActorRefFrom<typeof implementationGoalsMachine>
	| ActorRefFrom<typeof clientConnectionMachine>
	| ActorRefFrom<typeof databasePoolStrategyMachine>
	| ActorRefFrom<typeof cleanupDatabaseTriggerMachine>
	| ActorRefFrom<typeof pocResultsMachine>
	| ActorRefFrom<typeof v01ResultsMachine>
	| ActorRefFrom<typeof extractIoMachine>;

export function createSubslideControlsStore() {
	const actors = new Map<string, SlideActor>();
	const actorListeners = new Set<() => void>();
	return {
		getActor: (id: string) => actors.get(id),
		subscribeActors: (listener: () => void) => {
			actorListeners.add(listener);
			return () => {
				actorListeners.delete(listener);
			};
		},
		registerActor: (actor: SlideActor) => {
			actors.set(actor.id, actor);
			actorListeners.forEach((listener) => listener());
			return () => {
				if (actors.get(actor.id) !== actor) return;
				actors.delete(actor.id);
				actorListeners.forEach((listener) => listener());
			};
		},
	};
}

export const subslideControlsStore = createSubslideControlsStore();
