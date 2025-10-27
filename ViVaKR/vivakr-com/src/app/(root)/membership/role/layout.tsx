import React from 'react';
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="grid grid-cols-1  min-h-screen p-0 m-0">
      <main className="flex flex-col h-screen gap-4 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
