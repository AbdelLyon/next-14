import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { NavItem } from "./types";
import { Tooltip } from "../ui/tooltip";

export const Navigation = ({ navItems }: { navItems: NavItem[] }) => {
  const { itemId } = useStore();

  return (
    <nav className="flex justify-center gap-4">
      {navItems?.map((item) => (
        <>
          {item.tooltip ? (
            <Tooltip key={item.id} content={item.name}>
              <button
                key={item.id}
                className={cn(
                  "flex cursor-pointer items-center gap-1 hover:opacity-80",
                  { "text-sky-600": item.id === itemId },
                )}
                type="button"
                onClick={item.handleClick}
              >
                {item.icon}
              </button>
            </Tooltip>
          ) : (
            <button
              key={item.id}
              className={cn(
                "flex cursor-pointer items-center gap-1 hover:opacity-80",
                { "text-sky-600": item.id === itemId },
              )}
              type="button"
              onClick={item.handleClick}
            >
              {item.icon}
              <p className="font-semibold tracking-tight"> {item.name}</p>
            </button>
          )}
        </>
      ))}
    </nav>
  );
};
