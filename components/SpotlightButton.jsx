import React from "react";

const SpotlightButton = React.forwardRef(
  ({ children, as = "button", style = {}, ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref}
        style={{
          background: "linear-gradient(90deg,#d32f2f,#a62639)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: "1.1rem",
          boxShadow: "0 2px 8px rgba(80,60,40,0.10)",
          padding: "0.8rem 2rem",
          cursor: "pointer",
          fontFamily: "'Playfair Display', serif",
          ...style,
        }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

export { SpotlightButton };
export default SpotlightButton;
