'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const usersPerPage = 10;

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delayChildren: 0.3,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: 'spring', stiffness: 80 },
    },
  };

  
  const tableRowVariants = {
    hidden: { opacity: 0, x: -100, y: (i) => i * 10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 120,
        damping: 10,
        bounce: 0.4,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
 
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-300 opacity-30"
            style={{
              width: Math.random() * 120 + 60,
              height: Math.random() * 120 + 60,
              top: `${Math.random() * 110}%`,
              left: `${Math.random() * 110}%`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="p-2 sm:p-4 pt-2 sm:pt-5 min-h-screen mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
         {/* 3d */}
          <div className="absolute inset-0 z-0 opacity-20">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <motion.group
                animate={{ rotateY: [0, 2 * Math.PI] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sphere args={[1.5, 32, 32]}>
                  <meshStandardMaterial
                    color="#4B5EFC"
                    transparent
                    opacity={0.7}
                    gradientMap={null}
                  />
                </Sphere>
              </motion.group>
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
          </div>

          {/* Rotating gradient overlay */}
          <div className="absolute inset-0 rounded-xl overflow-hidden z-5">
            <motion.div
              className="absolute -inset-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-15"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.h1
              className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-800"
              variants={itemVariants}
            >
              User Management
            </motion.h1>

            <motion.div
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2 sm:mb-4 items-center"
              variants={itemVariants}
            >
              <motion.div
                className="relative w-full sm:flex-grow"
                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(99,102,241,0.2)' }}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}
              >
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input input-bordered w-full text-sm sm:text-base rounded-lg shadow-sm bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 pl-10 py-1 sm:py-2"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>
              <motion.button
                onClick={handleSearch}
                whileHover={{
                  scale: 1.1,
                  background: 'linear-gradient(45deg, #4B5EFC, #8B5CF6)',
                  boxShadow: '0 8px 20px rgba(75, 94, 252, 0.4)',
                }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-primary w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </motion.button>
            </motion.div>

            <motion.div
              className="overflow-x-auto rounded-lg"
              variants={itemVariants}
            >
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-sm">
                    {['NAME', 'EMAIL', 'PHONE', 'COMPANY'].map((head) => (
                      <motion.th
                        key={head}
                        className="p-2 sm:p-3 text-left text-gray-700 font-semibold text-xs sm:text-sm"
                        whileHover={{ scale: 1.03, color: '#4B5EFC' }}
                      >
                        {head}
                      </motion.th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          exit={{ opacity: 0, transition: { duration: 0.4 } }}
                          transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
                          className="border-b border-gray-200"
                        >
                          <td className="p-2 sm:p-3" colSpan={4}>
                            <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      currentUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={tableRowVariants}
                          whileHover={{
                            background: 'linear-gradient(90deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)',
                            scale: 1.01,
                            boxShadow: '0 4px 20px rgba(99,102,241,0.1)',
                          }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-gray-200 group cursor-pointer"
                          onClick={() => (window.location.href = `/users/${user.id}`)}
                        >
                          <td className="p-2 sm:p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible">
                            <Link href={`/users/${user.id}`} className="text-black block">
                              <span className="font-medium">{user.name}</span> <br />
                              <span className="text-gray-500 text-[10px] sm:text-xs">@{user.username}</span>
                            </Link>
                          </td>
                          <td className="p-2 sm:p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible group-hover:text-indigo-600 transition-colors duration-300">
                            {user.email}
                          </td>
                          <td className="p-2 sm:p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible">
                            {user.phone}
                          </td>
                          <td className="p-2 sm:p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible font-medium">
                            {user.company.name}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            <motion.div
              className="mt-2 sm:mt-4 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2 text-black"
              variants={itemVariants}
            >
              <p className="text-xs sm:text-sm text-gray-700">
                Showing {currentUsers.length} of {filteredUsers.length} users
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    whileHover={{
                      scale: 1.2,
                      boxShadow: '0 0 10px rgba(99,102,241,0.3)',
                      background: currentPage === i + 1 ? '#4B5EFC' : '#E5E7EB',
                    }}
                    whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-all duration-300 ${
                      currentPage === i + 1
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}