'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UserDetails({ params }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`)
            .then((res) => res.json())
            .then((data) => setUser(data));
    }, [params.id]);

    // Beautiful loading animation
    if (!user)
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f3f4f6]">
                <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-4 h-4 bg-blue-500 rounded-full"
                            animate={{ scale: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-5 bg-[#f3f4f6]"
        >
            <div className="max-w-7xl mx-auto bg-white p-5 sm:p-8 rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <Link href="/">
                        <button className="p-2 rounded-lg bg-gray-100 btn-sm text-black font-light hover:bg-gray-200 transition-all">
                            &larr; Back to Users
                        </button>
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                        User Details
                    </h1>
                </div>


                {/* User Info Sections */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Personal Information */}
                        <motion.section
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-2">
                                Personal Information
                            </h2>
                            <div className="space-y-2 text-gray-800">
                                <div>
                                    <small className="text-gray-500">Name</small>
                                    <p>{user.name}</p>
                                </div>
                                <div>
                                    <small className="text-gray-500">Username</small>
                                    <p>@{user.username}</p>
                                </div>
                                <div>
                                    <small className="text-gray-500">Email</small>
                                    <p>@{user.email}</p>
                                </div>
                                <div>
                                    <small className="text-gray-500">Phone</small>
                                    <p>{user.phone}</p>
                                </div>
                                <div>
                                    <small className="text-gray-500">Website</small>
                                    <p>
                                        <a
                                            href={`https://${user.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {user.website}
                                        </a>
                                    </p>
                                </div>

                            </div>
                        </motion.section>

                        {/* Address */}
                        <motion.section
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                            <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-2">
                                Address
                            </h2>
                            <div className="space-y-2 text-gray-800">
                                <small className="text-gray-500">Street</small>
                                <p>{user.address.street}</p>
                                <small className="text-gray-500">Suite</small>
                                <p>{user.address.suite}</p>
                                <small className="text-gray-500">City</small>
                                <p>{user.address.city}</p>
                                <small className="text-gray-500">Zipcode</small>
                                <p>{user.address.zipcode}</p>
                                <small className="text-gray-500">Geo Location</small>
                                <p>{user.address.geo.lat}, {user.address.geo.lng}</p>
                            </div>
                        </motion.section>
                    </div>

                    {/* Company */}
                    <motion.section
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                    >
                        <h2 className="text-base sm:text-lg font-bold text-gray-700 mb-4">
                            Company
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800">
                            <div>
                                <small className="text-gray-500">Company Name</small>
                                <p>{user.company.name}</p>
                            </div>
                            <div>
                                <small className="text-gray-500">Catch Phrase</small>
                                <p>{user.company.catchPhrase}</p>
                            </div>
                            <div>
                                <small className="text-gray-500">Business</small>
                                <p>{user.company.bs}</p>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </div>
        </motion.div>
    );
}
