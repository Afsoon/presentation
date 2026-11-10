export type SlideMetadata = {
	Id: string;
	name: string;
	hasSubslides: boolean;
	notes?: string;
	/** Machine state keys, e.g. "heading" or "strategies.transactions". */
	subslideNotes?: Readonly<Record<string, string>>;
};
