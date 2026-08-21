import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-aos="fade-up"
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-xl font-medium tracking-tight text-brand-navy md:text-[1.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/75">
          {description}
        </p>
      )}
    </div>
  );
}
