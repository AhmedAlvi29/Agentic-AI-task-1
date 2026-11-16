import RevealText from "./RevealText";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  intro?: string;
  className?: string;
  align?: "left" | "right";
  /** `md` for narrow columns. */
  size?: "lg" | "md";
};

export default function SectionHeading({ title, intro, className, align = "left", size = "lg" }: Props) {
  return (
    <header className={cn("max-w-4xl", align === "right" && "ml-auto text-right", className)}>
      <RevealText
        text={title}
        as="h2"
        className={cn(
          "font-black",
          size === "lg" ? "text-[clamp(2.2rem,6.2vw,5.5rem)]" : "text-[clamp(2rem,4.3vw,3.9rem)]",
        )}
      />
      {intro && (
        <p
          className={cn(
            "mt-6 max-w-xl text-lg text-white/65",
            align === "right" && "ml-auto",
          )}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
