import { ImSpinner3 } from "@/components/icons/reactIcons";
import { cn } from "@/lib/utils";

export const LoadingSpinner = (props: React.ComponentProps<"svg">) => {
  return (
    <ImSpinner3
      {...props}
      className={cn(
        "animate-[spin_0.5s_linear_infinite]  ml-2",
        props.className
      )}
    />
  );
};
