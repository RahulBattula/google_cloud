"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="hero" className="relative overflow-hidden py-20 md:py-32">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-1] h-full w-full"
        >
          <div
            style={{
              animation: "moveVertical 30s ease infinite",
            }}
            className="absolute bottom-auto left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-10 blur-3xl"
          ></div>
          <div
            style={{
              animation: "moveInCircle 20s reverse infinite",
            }}
            className="absolute bottom-auto left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 opacity-10 blur-3xl"
          ></div>
        </div>
      </div>

      <motion.div
        className="container mx-auto px-4 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center gap-8">
          <motion.div variants={itemVariants}>
            <Image
              src="https://tse4.mm.bing.net/th/id/OIP.Kk4i-k-7bOfsgPv0SJtj5AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Profile Photo"
              width={150}
              height={150}
              className="rounded-full border-4 border-slate-200/80 shadow-lg"
              priority
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.1)]"
            variants={itemVariants}
          >
            Hi there! I'm Rahul
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg md:text-xl text-slate-700 [text-shadow:0_1px_2px_rgb(0_0_0_/_0.1)]"
            variants={itemVariants}
          >
            I'm a passionate developer creating modern and intuitive web
            applications. Explore my work and get in touch!
          </motion.p>

          <motion.div className="flex gap-4" variants={itemVariants}>
            <Button asChild size="lg">
              <Link href="#projects">View My Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}