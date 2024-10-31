"use client";
import { useState } from "react"

export default function DashboardPage() {
    console.log("Dashboard Client Component");
    const [name, setName] = useState('');
    return (
        <div>
            <h1>Dashboard</h1>
            <input type="text" value={name}
                className="border border-gray-300 rounded-md p-2 my-2"
                onChange={(e) => setName(e.target.value)} />
            <p>Hello {name}</p>
        </div>
    )
}
