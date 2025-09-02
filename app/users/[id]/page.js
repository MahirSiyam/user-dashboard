'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float } from '@react-three/drei';


function BackgroundParticles() {
  const pointsRef = useRef();
  const particles = useRef([]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0005;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    
    particles.current = positions;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.current.length / 3}
          array={particles.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#4B5EFC" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
// 3d
function FloatingElements() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.3, 16, 16]} position={[-2, 1, 0]}>
          <meshStandardMaterial color="#FF6B6B" transparent opacity={0.7} />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={0.8} floatIntensity={0.8}>
        <Sphere args={[0.2, 16, 16]} position={[2, -1, 0]}>
          <meshStandardMaterial color="#4ECDC4" transparent opacity={0.7} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.6}>
        <Sphere args={[0.25, 16, 16]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#FFE66D" transparent opacity={0.7} />
        </Sphere>
      </Float>
    </>
  );
}
function ThreeDText({ text, position, color }) {
  return (
    <Text
      position={position}
      color={color}
      fontSize={0.5}
      maxWidth={10}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
    >
      {text}
      <meshStandardMaterial metalness={0.5} roughness={0.2} />
    </Text>
  );
}

export default function UserDetails({ params }) {
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState({});
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [params.id]);

  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* 3D Loading Animation */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <BackgroundParticles />
            <motion.group
              animate={{ 
                rotateY: [0, 2 * Math.PI],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sphere args={[1, 32, 32]}>
                <meshStandardMaterial color="#4B5EFC" transparent opacity={0.6} wireframe />
              </Sphere>
            </motion.group>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>
        <div className="flex space-x-2 z-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 h-4 bg-blue-400 rounded-full"
              animate={{
                rotate: 360,
                scale: [0.5, 1.5, 0.5],
                y: [0, -15, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.6, 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      },
    },
    hover: {
      y: -10,
      rotateZ: 1,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const glowVariants = {
    rest: { 
      boxShadow: "0 0 0px rgba(59, 130, 246, 0)" 
    },
    hover: { 
      boxShadow: "0 0 20px 5px rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-2 sm:pt-5 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden"
    >
      
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <directionalLight position={[0, 5, 5]} intensity={0.5} />
          <BackgroundParticles />
          <FloatingElements />
          <motion.group
            animate={{ rotateY: [0, 2 * Math.PI] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#4B5EFC"
                transparent
                opacity={0.1}
                wireframe
                wireframeLinewidth={1}
              />
            </Sphere>
          </motion.group>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={true} 
            autoRotate 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      <motion.div
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-3 sm:p-6 rounded-2xl shadow-2xl border border-white/10 relative z-10"
        variants={containerVariants}
      >
     
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/">
              <button className="p-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Users
              </button>
            </Link>
          </motion.div>
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
          >
            User <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Details</span>
          </motion.h1>
        </div>

        <div className="space-y-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
          
            <motion.section
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden"
              onHoverStart={() => setIsHovered({...isHovered, personal: true})}
              onHoverEnd={() => setIsHovered({...isHovered, personal: false})}
            >
            
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0"
                animate={isHovered.personal ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
              
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h2>
              <div className="space-y-3 text-white/90 relative z-10">
                {[
                  { label: 'Name', value: user.name },
                  { label: 'Username', value: `@${user.username}` },
                  { label: 'Email', value: user.email, link: `mailto:${user.email}` },
                  { label: 'Phone', value: user.phone },
                  { label: 'Website', value: user.website, link: `https://${user.website}` },
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <small className="text-white/70">{item.label}</small>
                    {item.link ? (
                      <motion.a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300 font-medium"
                        whileHover={{ x: 5 }}
                      >
                        {item.value}
                      </motion.a>
                    ) : (
                      <p className="font-medium">{item.value}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              variants={cardVariants}
              whileHover="hover"
              className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden"
              onHoverStart={() => setIsHovered({...isHovered, address: true})}
              onHoverEnd={() => setIsHovered({...isHovered, address: false})}
            >
            {/* .......................... */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0"
                animate={isHovered.address ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
              
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address
              </h2>
              <div className="space-y-3 text-white/90 relative z-10">
                {[
                  { label: 'Street', value: user.address.street },
                  { label: 'Suite', value: user.address.suite },
                  { label: 'City', value: user.address.city },
                  { label: 'Zipcode', value: user.address.zipcode },
                  { label: 'Geo Location', value: `${user.address.geo.lat}, ${user.address.geo.lng}` },
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <small className="text-white/70">{item.label}</small>
                    <p className="font-medium">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>

          {/* ............................... */}
          <motion.section
            variants={cardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden"
            onHoverStart={() => setIsHovered({...isHovered, company: true})}
            onHoverEnd={() => setIsHovered({...isHovered, company: false})}
          >
           
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0"
              animate={isHovered.company ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90 relative z-10">
              {[
                { label: 'Company Name', value: user.company.name },
                { label: 'Catch Phrase', value: user.company.catchPhrase },
                { label: 'Business', value: user.company.bs },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col p-3 bg-white/5 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <small className="text-white/70">{item.label}</small>
                  <p className="font-medium">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </motion.div>
  );
}