import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Slider } from "./components/ui/slider";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";


export default function LogoAnimation({ onComplete }) {
  const barControls = useAnimation();
  const topControls = useAnimation();
  const bottomControls = useAnimation();
  const [hovered, setHovered] = useState(false);

  // --- Idle looping animation for squircles ---
  useEffect(() => {
    const loopAnimation = async () => {
      while (true) {
        await Promise.all([
          topControls.start({
            borderRadius: ["50%", "25%", "50%"],
            rotate: [0, 15, -15, 0],
            transition: { duration: 6, ease: "easeInOut" },
          }),
          bottomControls.start({
            borderRadius: ["50%", "25%", "50%"],
            rotate: [0, -15, 15, 0],
            transition: { duration: 6, ease: "easeInOut" },
          }),
        ]);
      }
    };
    loopAnimation();
  }, [topControls, bottomControls]);

  // --- Hover in/out behavior ---
  useEffect(() => {
    if (hovered) {
      // Drop bar like a hinge
      barControls.start({
        rotate: [0, 90],
        originX: 0,
        y: [0, 60],
        transition: { duration: 0.9, ease: [0.55, 0, 0.45, 1] },
      });

      // Split squircles into two circles (forming "B")
      topControls.start({
        y: [-40],
        borderRadius: "50%",
        rotate: 0,
        transition: { duration: 0.9, ease: "easeInOut" },
      });

      bottomControls.start({
        y: [40],
        borderRadius: "50%",
        rotate: 0,
        transition: { duration: 0.9, ease: "easeInOut" },
      });
    } else {
      // Reset to initial abstract form
      barControls.start({
        rotate: 0,
        y: 0,
        transition: { duration: 1.2, ease: [0.45, 0, 0.55, 1] },
      });
      topControls.start({
        y: 0,
        transition: { duration: 1.2, ease: "easeInOut" },
      });
      bottomControls.start({
        y: 0,
        transition: { duration: 1.2, ease: "easeInOut" },
      });
    }
  }, [hovered, barControls, topControls, bottomControls]);

  return (
    <motion.div
      className="relative w-48 h-48 flex items-center justify-center cursor-pointer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Invisible hover catcher */}
      <div className="absolute inset-0" />

      {/* Horizontal bar (the future “I”) */}
      <motion.div
        className="absolute bg-yellow-400 rounded-md"
        style={{ width: "100px", height: "16px" }}
        animate={barControls}
      />

      {/* Top squircle */}
      <motion.div
        className="absolute bg-yellow-300"
        style={{ width: "60px", height: "60px" }}
        animate={topControls}
        initial={{ borderRadius: "40%", y: 0, rotate: 0 }}
      />

      {/* Bottom squircle */}
      <motion.div
        className="absolute bg-yellow-500"
        style={{ width: "60px", height: "60px" }}
        animate={bottomControls}
        initial={{ borderRadius: "40%", y: 0, rotate: 0 }}
      />
    </motion.div>
  );
}
