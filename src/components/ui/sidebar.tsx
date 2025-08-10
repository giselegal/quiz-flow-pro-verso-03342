"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const sidebarVariants = cva(
  "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all dark:border-slate-700 lg:left-0",
  {
    variants: {
      size: {
        sm: "w-14",
        md: "w-64",
      },
      isMobile: {
        true: "translate-x-0",
        false: "",
      },
      isCollapsed: {
        true: "lg:w-14",
        false: "lg:w-64",
      },
    },
    defaultVariants: {
      size: "md",
      isMobile: false,
      isCollapsed: false,
    },
  }
);

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  isCollapsed?: boolean;
  isMobile?: boolean;
  size?: "sm" | "md";
}

interface SidebarContextValue {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if the device is a mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobile,
        setIsMobile,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export function SidebarTrigger() {
  const { isCollapsed, setIsCollapsed, isMobile, isOpen, setIsOpen } = useSidebar();

  return (
    <button
      onClick={() => (isMobile ? setIsOpen(!isOpen) : setIsCollapsed(!isCollapsed))}
      className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="sr-only">Toggle Sidebar</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="15" y1="3" y2="3" />
        <line x1="9" x2="15" y1="21" y2="21" />
        <line x1="9" y1="9" x2="9" y2="15" />
        <line x1="15" y1="9" x2="15" y2="15" />
      </svg>
    </button>
  );
}

export function Sidebar({
  className,
  isCollapsed = false,
  isMobile = false,
  size = "md",
  ...props
}: SidebarProps) {
  const { isCollapsed: isContextCollapsed, isOpen, isMobile: isContextMobile } = useSidebar();

  const collapsed = isCollapsed || isContextCollapsed;
  const mobile = isMobile || isContextMobile;

  return (
    <aside
      className={cn(
        sidebarVariants({
          isCollapsed: collapsed,
          isMobile: mobile && !isOpen ? false : mobile && isOpen ? true : false,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-14 items-center border-b px-4 transition-all dark:border-slate-700",
        isCollapsed ? "lg:justify-center lg:px-0" : "",
        className
      )}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex items-center border-t p-4 transition-all dark:border-slate-700",
        isCollapsed ? "lg:justify-center lg:px-0" : "",
        className
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2 py-2", className)} {...props} />;
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return <span className="sr-only" {...props} />;
  }

  return (
    <p
      className={cn("mx-2 text-xs font-medium tracking-tight text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("", className)} role="list" {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />;
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function SidebarMenuButton({
  className,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const { isCollapsed } = useSidebar();
  const Comp = asChild ? React.Fragment : "div";

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Comp
              className={cn(
                "group inline-flex h-9 w-9 items-center justify-center rounded-md px-0 py-2 hover:bg-accent hover:text-accent-foreground",
                className
              )}
              {...props}
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {props.children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Comp
      className={cn(
        "group flex h-9 items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

interface SidebarMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

export function SidebarMenuLink({ className, active, icon: Icon, ...props }: SidebarMenuLinkProps) {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <a
              className={cn(
                "group inline-flex h-9 w-9 items-center justify-center rounded-md px-0 py-2 hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent",
                className
              )}
              {...props}
            >
              {Icon && <Icon className={cn("h-5 w-5")} />}
              <span className="sr-only">{props.children}</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {props.children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <a
      className={cn(
        "group flex h-9 items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent",
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn("mr-2 h-5 w-5")} />}
      <span>{props.children}</span>
    </a>
  );
}
