import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h3 className="text-slate-500 text-5xl">DASHBOARD</h3>
      {children}
    </div>
  );
};
