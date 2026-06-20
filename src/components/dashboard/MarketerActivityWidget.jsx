import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Crown, Award, Gem, Sparkles } from 'lucide-react';
import { topMarketersLeaderboard, aggregateWeeklyTrend, totalActiveLinks, totalCollectedFunds } from "@/mocks/saudiMockData";

const rankMeta = [
  { icon: Crown, color: "from-amber-400 to-yellow-600", glow: "shadow-amber-500/40", bg: "bg-amber-50" },
  { icon: Award, color: "from-slate-300 to-slate-500", glow: "shadow-slate-400/30", bg: "bg-slate-50" },
  { icon: Gem, color: "from-teal-400 to-teal-600", glow: "shadow-teal-500/30", bg: "bg-teal-50" },
];

export default function MarketerActivityWidget() {
  const marketers = topMarketersLeaderboard;
  const trendData = aggregateWeeklyTrend;
  const totalLinks = totalActiveLinks;
  const totalFunds = totalCollectedFunds;

  if (!marketers.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        dir="rtl"
        className="relative overflow-hidden border-0"
        style={{
          background: "linear-gradient(160deg, #0B1120 0%, #0F172A 40%, #0A1628 100%)",
          boxShadow: "0 0 0 1px rgba(45,212,191,0.12), 0 25px 70px -20px rgba(45,212,191,0.18), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Top gold accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(200,150,42,0.5), rgba(45,212,191,0.4), transparent)" }}
        />

        {/* Corner luminescence */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-teal-500/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none" />

        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-5 px-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(45,212,191,0.18), rgba(20,184,166,0.06))",
                border: "1px solid rgba(45,212,191,0.2)",
                boxShadow: "0 0 18px rgba(45,212,191,0.15)",
              }}
            >
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </motion.div>
            <div>
              <CardTitle className="text-lg font-extrabold text-white font-heading tracking-tight">
                أداء المسوقين
              </CardTitle>
              <p className="text-[11px] text-teal-400/60 font-medium tracking-wider">TOP PERFORMERS</p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            <span className="text-[11px] font-bold text-teal-300 tracking-wide">مباشر</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-12 gap-7">
          {/* ── Left: Leaderboard ── */}
          <div className="md:col-span-7 space-y-4">
            {marketers.map((marketer, index) => {
              const meta = rankMeta[index];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={marketer.id}
                  whileHover={{ x: -8, scale: 1.015 }}
                  transition={{ duration: 0.25 }}
                  className="relative group"
                >
                  {/* Rank badge floating */}
                  <div
                    className={`absolute -right-3 -top-2 z-10 w-7 h-7 rounded-lg flex items-center justify-center ${meta.glow}`}
                    style={{
                      background: `linear-gradient(135deg, ${index === 0 ? '#f59e0b,#d97706' : index === 1 ? '#cbd5e1,#94a3b8' : '#2dd4bf,#0d9488'})`,
                      boxShadow: index === 0
                        ? '0 0 14px rgba(245,158,11,0.5)'
                        : index === 1
                          ? '0 0 10px rgba(148,163,184,0.35)'
                          : '0 0 12px rgba(45,212,191,0.4)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>

                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group-hover:border-teal-400/30"
                    style={{
                      background: "rgba(15,23,42,0.7)",
                      border: "1px solid rgba(45,212,191,0.1)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Avatar */}
                    <Avatar className="h-11 w-11 border-2 shrink-0"
                      style={{ borderColor: index === 0 ? 'rgba(245,158,11,0.5)' : index === 1 ? 'rgba(148,163,184,0.4)' : 'rgba(45,212,191,0.4)' }}>
                      <AvatarFallback
                        className="font-extrabold text-sm"
                        style={{
                          background: index === 0
                            ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1))'
                            : index === 1
                              ? 'linear-gradient(135deg, rgba(148,163,184,0.15), rgba(100,116,139,0.08))'
                              : 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(13,148,136,0.1))',
                          color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : '#2dd4bf',
                        }}
                      >
                        {marketer.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-bold text-sm text-white truncate">{marketer.name}</p>
                        <Badge
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border-0"
                          style={{
                            background: index === 0
                              ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))'
                              : index === 1
                                ? 'linear-gradient(135deg, rgba(148,163,184,0.2), rgba(148,163,184,0.05))'
                                : 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(45,212,191,0.05))',
                            color: index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : '#2dd4bf',
                          }}
                        >
                          {marketer.conversion}% تحويل
                        </Badge>
                      </div>

                      {/* Donation bar */}
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: index === 0 ? '70%' : index === 1 ? '55%' : '40%' }}
                          transition={{ duration: 1.2, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{
                            background: index === 0
                              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                              : index === 1
                                ? 'linear-gradient(90deg, #94a3b8, #64748b)'
                                : 'linear-gradient(90deg, #2dd4bf, #0d9488)',
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        <span className="font-bold text-slate-200">{marketer.funds}</span> ريال
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Right: Chart + Stats ── */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Chart */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(45,212,191,0.12)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-300">اتجاه التحويلات</p>
                <Sparkles className="w-3.5 h-3.5 text-teal-400/50" />
              </div>
              <div className="h-40 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="imperialGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
                        <stop offset="50%" stopColor="#c8972a" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5eead4' }} />
                    <YAxis hide domain={[0, 'dataMax + 8']} />
                    <Tooltip
                      contentStyle={{
                        direction: 'rtl',
                        borderRadius: 14,
                        border: '1px solid rgba(45,212,191,0.25)',
                        background: 'rgba(11,17,32,0.92)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        fontSize: 12,
                        color: '#e2e8f0',
                      }}
                      formatter={(value) => [`${value}%`, 'معدل التحويل']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="url(#imperialGradient)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#imperialGradient)"
                      dot={{ r: 3, fill: '#2dd4bf', stroke: '#0B1120', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#c8972a', stroke: '#0B1120', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Active Links */}
              <div
                className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(45,212,191,0.12)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-3xl font-extrabold text-white font-display">{totalLinks}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">رابط نشط</p>
              </div>

              {/* Total Donations */}
              <div
                className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(200,150,42,0.15)",
                }}
              >
                <span className="text-3xl font-extrabold text-amber-400 font-display">{totalFunds}K</span>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">إجمالي التبرعات</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}