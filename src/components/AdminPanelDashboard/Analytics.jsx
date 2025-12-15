import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { TrendingUp, Users, DollarSign, Code, Award } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Analytics() {
  const [analytics] = useState({
    totalHires: 120,
    topCompanies: ["TCS", "Google", "Infosys"],
    avgPlacement: "6.5 LPA",
    mostPopularTech: "React.js",
    bestMentor: "Dr. Reddy",
    hireTrend: [
      { month: "Jan", hires: 10 },
      { month: "Feb", hires: 15 },
      { month: "Mar", hires: 20 },
      { month: "Apr", hires: 12 },
      { month: "May", hires: 18 },
      { month: "Jun", hires: 25 },
    ],
    placementDistribution: {
      "3-5 LPA": 30,
      "5-8 LPA": 50,
      "8-12 LPA": 25,
      "12+ LPA": 15,
    },
  });

  const hireTrendData = {
    labels: analytics.hireTrend.map((data) => data.month),
    datasets: [
      {
        label: "Hires per Month",
        data: analytics.hireTrend.map((data) => data.hires),
        backgroundColor: "rgba(254, 109, 53,0.6)",
        borderColor: "rgba(254, 109, 53,1)",
        borderWidth: 1,
      },
    ],
  };

  const placementDistributionData = {
    labels: Object.keys(analytics.placementDistribution),
    datasets: [
      {
        label: "Placement Distribution",
        data: Object.values(analytics.placementDistribution),
        backgroundColor: [
          "#9370DB",
          "rgba(0, 208, 181,1)",
          "rgba(254, 109, 53,0.6)",
          "#FF6384",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const analyticsCards = [
    { title: "Total Hires", value: analytics.totalHires, icon: Users, color: "primary" },
    { title: "Avg. Package", value: analytics.avgPlacement, icon: DollarSign, color: "secondary" },
    { title: "Most Popular Tech", value: analytics.mostPopularTech, icon: Code, color: "accent" },
    { title: "Top Mentor", value: analytics.bestMentor, icon: Award, color: "success" },
  ];

  return (
    <section className="mb-8">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Analytics Overview
      </motion.h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="stat-card p-6 flex items-center gap-4 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <motion.div
              className={`p-3 rounded-2xl bg-gradient-${card.color}`}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <card.icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-muted-foreground">{card.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Companies Card */}
      <motion.div
        className="stat-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Top Hiring Companies
        </h3>
        <div className="flex flex-wrap gap-3">
          {analytics.topCompanies.map((company, i) => (
            <motion.span
              key={i}
              className="px-4 py-2 bg-gradient-primary text-white rounded-xl font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {company}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="stat-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-4">Monthly Hire Trend</h3>
          <div className="h-64">
            <Bar 
              data={hireTrendData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </motion.div>

        <motion.div
          className="stat-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-4">Placement Distribution</h3>
          <div className="h-64">
            <Pie 
              data={placementDistributionData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false 
              }} 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Analytics;

