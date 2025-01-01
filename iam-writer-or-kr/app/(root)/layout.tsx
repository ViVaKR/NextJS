import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-5xl">
      <h1 className="text-5xl">NAVBAR</h1>
      {children}
    </div>
  );
};

export default Layout;
