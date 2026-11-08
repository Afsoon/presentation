import type React from "react";

type TypographyProps = {
	children: React.ReactNode;
	level: "h1" | "h2" | "h3" | "h4" | "p" | "p-small" | "quote" | "code";
};

const variants = {
	h1: { tag: "h1", className: "text-3xl font-extrabold text-balance md:text-4xl" },
	h2: { tag: "h2", className: "text-3xl font-semibold" },
	h3: { tag: "h3", className: "text-2xl font-semibold max-sm:w-full" },
	h4: { tag: "h4", className: "text-xl font-semibold" },
	p: { tag: "p", className: "leading-relaxed text-muted-foreground" },
	"p-small": { tag: "p", className: "text-sm font-medium text-muted-foreground" },
	quote: { tag: "blockquote", className: "max-w-2xl border-l-2 pl-6 italic" },
	code: { tag: "code", className: "bg-muted rounded-md px-1 py-0.5 font-mono text-sm font-semibold" },
} as const;

const Typography = ({ children, level }: TypographyProps) => {
	const { tag: Tag, className } = variants[level];

	return <Tag className={className}>{children}</Tag>;
};

export default Typography;
