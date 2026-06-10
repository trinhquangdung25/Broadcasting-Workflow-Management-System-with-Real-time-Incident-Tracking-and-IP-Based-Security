import { cn } from "@/utils/index"

function AspectRatio({
  ratio,
  className,
  ...props
}) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio
        }
      }
      className={cn("relative aspect-(--ratio)", className)}
      {...props} />
  );
}

export { AspectRatio }
