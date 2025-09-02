'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200 to-purple-200 opacity-30"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1 + Math.random() * 0.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 pt-5 min-h-screen mx-auto relative z-10"
      >
        <motion.div 
          className='max-w-7xl mx-auto bg-white/90 backdrop-blur-md p-5 rounded-lg shadow-2xl border border-white/20 relative overflow-hidden'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated border */}
          <div className="absolute inset-0 rounded-lg overflow-hidden z-0">
            <motion.div 
              className="absolute -inset-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.h1 
              className="text-xl sm:text-2xl font-bold mb-4 text-gray-800"
              variants={itemVariants}
            >
              User Management
            </motion.h1>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 mb-6 items-center"
              variants={itemVariants}
            >
              <motion.div 
                className="relative w-full sm:flex-grow"
                whileFocusWithin={{ scale: 1.01 }}
              >
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input input-bordered w-full text-sm sm:text-base rounded-lg shadow-sm bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 pl-10"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </motion.div>
              <motion.button
                onClick={handleSearch}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Search
              </motion.button>
            </motion.div>

            {/* Scrollable table for small screens */}
            <motion.div 
              className="overflow-x-auto rounded-lg"
              variants={itemVariants}
            >
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm">
                    <motion.th 
                      className="p-3 text-left text-gray-700 font-semibold text-xs sm:text-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      NAME
                    </motion.th>
                    <motion.th 
                      className="p-3 text-left text-gray-700 font-semibold text-xs sm:text-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      EMAIL
                    </motion.th>
                    <motion.th 
                      className="p-3 text-left text-gray-700 font-semibold text-xs sm:text-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      PHONE
                    </motion.th>
                    <motion.th 
                      className="p-3 text-left text-gray-700 font-semibold text-xs sm:text-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      COMPANY
                    </motion.th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {isLoading ? (
                      // Loading skeleton with animation
                      Array.from({ length: 5 }).map((_, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          className="border-b border-gray-200"
                        >
                          <td className="p-3" colSpan={4}>
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
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
                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                            scale: 1.005,
                            transition: { duration: 0.2 }
                          }}
                          className="border-b border-gray-200 group cursor-pointer"
                          onClick={() => window.location.href = `/users/${user.id}`}
                        >
                          <td className="p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible">
                            <Link href={`/users/${user.id}`} className="text-black block">
                              <span className="font-medium">{user.name}</span> <br />
                              <span className="text-gray-500 text-[10px] sm:text-xs">@{user.username}</span>
                            </Link>
                          </td>
                          <td className="p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible group-hover:text-blue-600 transition-colors">
                            {user.email}
                          </td>
                          <td className="p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible">
                            {user.phone}
                          </td>
                          <td className="p-3 text-black text-xs sm:text-sm whitespace-normal overflow-visible font-medium">
                            {user.company.name}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>

            {/* Pagination */}
            <motion.div 
              className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-black"
              variants={itemVariants}
            >
              <p className="text-xs sm:text-sm text-gray-700">
                Showing {currentUsers.length} of {filteredUsers.length} users
              </p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: currentPage === i + 1 ? "#3B82F6" : "#E5E7EB"
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${currentPage === i + 1 ? 
                      'bg-blue-500 text-white shadow-md' : 
                      'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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