import React from "react";

function Navbar() {
    return (
        <>
            <nav>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center h-16">
                        <div className="flex flex-1 items-center">
                            <div className="flex-shrink-0">
                                <a href="/" title="add a logo here soon pls">
                                    Nurse Joy
                                </a>
                            </div>
                            <div className="ml-10 items-baseline space-x-4">
                                <a href="#" className="hover:shadow-xl px-3 py-2 rounded-md text-sm font-medium">
                                    🏡 Dashboard
                                </a>

                                <a href="/calendar" className="hover:shadow-xl px-3 py-2 rounded-md text-sm font-medium">
                                    🗓️ Calendar
                                </a>

                                <a href="#" className="hover:shadow-xl px-3 py-2 rounded-md text-sm font-medium">
                                    👥 Section
                                </a>

                                <a href="#" className="hover:shadow-xl px-3 py-2 rounded-md text-sm font-medium">
                                    📝 Reports
                                </a>

                                <a href="#" className="hover:shadow-xl px-3 py-2 rounded-md text-sm font-medium">
                                    👮 Adminland
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-10 flex items-baseline space-x-1">
                                <span className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                                    🚨 0
                                </span>
                                <span className="px-3 py-2 text-indigo-500 underline">
                                    Tadhg Boyle
                                </span>
                                <a href="http://localhost:9000/auth/logout" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <hr/>
        </>
    )
}

export default Navbar
