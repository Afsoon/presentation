import type { ActorRefFrom } from "xstate";

import type { tableOfContentsMachine } from "@/slides/slide_2_table_of_content/slide_2_table_of_content.machine";
import type { reasonsMachine } from "@/slides/slide_5_reasons_for_building_pgtest/slide_5_reasons_for_building_pgtest.machine";
import type { implementationGoalsMachine } from "@/slides/slide_7_implementation_goals/slide_7_implementation_goals.machine";
import type { clientConnectionMachine } from "@/slides/slide_9_client_connection/slide_9_client_connection.machine";
import type { databasePoolStrategyMachine } from "@/slides/slide_10_database_pool_strategy/slide_10_database_pool_strategy.machine";

type SlideActor =
	| ActorRefFrom<typeof tableOfContentsMachine>
	| ActorRefFrom<typeof reasonsMachine>
	| ActorRefFrom<typeof implementationGoalsMachine>
	| ActorRefFrom<typeof clientConnectionMachine>
	| ActorRefFrom<typeof databasePoolStrategyMachine>;

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
