import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, strokeWidth = 2, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowLeft = (p: P) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </Svg>
);

export const SearchIcon = (p: P) => (
  <Svg strokeWidth={1.8} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5l4.5 4.5" />
  </Svg>
);

export const Plus = (p: P) => (
  <Svg strokeWidth={2.4} {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
);

export const Redo = (p: P) => (
  <Svg {...p}>
    <path d="M15 4l5 5-5 5" />
    <path d="M20 9H10a6 6 0 0 0 0 12h2" />
  </Svg>
);

export const Download = (p: P) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M12 4v11" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 20h14" />
  </Svg>
);

export const Trash = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13h10l1-13" />
  </Svg>
);

export const ChevronDown = (p: P) => (
  <Svg strokeWidth={3} {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const ChevronRight = (p: P) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

export const Close = (p: P) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Svg>
);

export const Check = (p: P) => (
  <Svg strokeWidth={2.6} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const Power = (p: P) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M12 3v8" />
    <path d="M6.3 7.5a8 8 0 1 0 11.4 0" />
  </Svg>
);

export const UserIcon = ({ size = 20, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6z" />
  </svg>
);
