import type { SlideMetadata } from "@/slides/types";

export const metadata = {
	Id: "title",
	name: "PgTest",
	hasSubslides: false,
} satisfies SlideMetadata;

export const SlideTitle = () => {
	return <h1 className="text-4xl font-extrabold text-balance sm:text-6xl lg:text-8xl">PgTest</h1>;
};
