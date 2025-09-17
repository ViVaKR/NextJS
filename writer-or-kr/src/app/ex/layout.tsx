import React from "react";
// import Analytics from "./@analytics/page";
// import Team from "./@team/page";

export default function ExLayout({
  children,
  team,
  analytics

}: Readonly<{
  children: React.ReactNode,
  team: React.ReactNode,
  analytics: React.ReactNode
}>) {

  return (

    <div className="w-full min-h-screen flex flex-col gap-8 p-2">

      <div className="bg-yellow-50 flex justify-center items-center p-2 h-96">
        {children}
      </div>

      <div className="flex flex-row gap-8 w-full h-96 p-2">
        <div className="basis-1/2 bg-amber-200 flex justify-center rounded-2xl">
          {team}
        </div>
        <div className="basis-1/2 bg-amber-200 flex justify-center rounded-2xl">
          {analytics}
        </div>
      </div>

    </div>

  )
}
