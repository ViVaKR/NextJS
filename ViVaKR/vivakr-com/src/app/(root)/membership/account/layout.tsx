import React from 'react';
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col h-screen gap-2">
      <main className="flex flex-col h-screen gap-4 p-4">
        <section>{children}</section>
      </main>
    </div>
  );
};

export default Layout;
