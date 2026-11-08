import { createServerFn } from "@tanstack/react-start";

import { getInitialPresentationState } from "@/stores/slide-search";

export const getInitialPresentation = createServerFn({ method: "GET" })
	.validator((search: string) => search)
	.handler(({ data }) => getInitialPresentationState(data));
