import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Crown, Award, Star } from 'lucide-react';

const MOCK_DATA = {
  marketers: [
    { id: 1, name: "أحمد عبدالله", funds: "45,000", conversion: 14 },
    { id: 2, name: "سارة محمد", funds: "38,200", conversion: 12 },
    { id: 3, name: "خالد فهد", funds: "29,500", conversion: 9 },
  ],
  trendData: [
    { day: 'السبت', value: 12 },
    { day: 'الأحد', value: 19 },
    { day: 'الاثنين', value: 15 },
    { day: 'الثلاثاء', value: 25 },
    { day: 'الأربعاء', value: 22 },
    { day: 'الخميس', value: 30 },
    { day: 'الجمعة', value: 28 },
  ],
};

const rankMeta = [
  { icon: Crown, color: "text-amber-500" },
  { icon: Award, color: "text-slate-400" },
  { icon: Star, color: "text-teal-600" },
];

export default function MarketerActivityWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // TODO: Fetch live referral tracking data via @/api/coreClient from Moeen Cloud Engine.
    setData(MOCK_DATA);
  }, []);

  if (!data) return null;

  return (
    <Card dir="rtl" className="border-teal-100/60 shadow-xl shadow-teal-500/[0.04] bg-white overflow-hidden relative">
      {/* Decorative anti-gravity glow behind card */}
      <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-teal-500/[0.03] blur-3xl pointer-events-none" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-teal-50">
        <CardTitle className="text-xl font-bold flex items-center gap-2 font-heading text-teal-900">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          أداء المسوقين المتصدرين
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ── Left Column: Leaderboard (60%) ── */}
        <div className="md:col-span-7 space-y-3">
          {data.marketers.map((marketer, index) => {
            const RankIcon = rankMeta[index]?.icon || Star;
            const rankColor = rankMeta[index]?.color || "text-teal-600";

            return (
              <motion.div
                key={marketer.id}
                whileHover={{ scale: 1.02, x: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-100/80 hover:border-teal-100 hover:bg-teal-50/30 transition-colors shadow-sm hover:shadow-md"
              >
                {/* Left side: rank + avatar + name + funds */}
                <div className="flex items-center gap-3.5 text-right">
                  <div className="w-8 flex justify-center">
                    <RankIcon className={`w-6 h-6 ${rankColor}`} />
                  </div>

                  <Avatar className="h-10 w-10 border-2 border-teal-50 ring-2 ring-teal-50/50">
                    <AvatarFallback className="bg-teal-50 text-teal-700 font-bold text-sm">
                      {marketer.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-bold text-sm text-teal-900 leading-tight">{marketer.name}</p>
                    <p className="text-[11px] text-teal-600/70 mt-0.5">
                      إجمالي التبرعات: <span className="font-bold text-teal-700">{marketer.funds} ريال</span>
                    </p>
                  </div>
                </div>

                {/* Right side: conversion badge */}
                <Badge
                  variant="secondary"
                  className="bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold px-2.5 py-1"
                >
                  معدل التحويل {marketer.conversion}%
                </Badge>
              </motion.div>
            );
          })}
        </div>

        {/* ── Right Column: Analytics (40%) ── */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Chart */}
          <div className="bg-teal-50/30 rounded-xl p-4 border border-teal-50">
            <p className="text-xs font-semibold text-teal-700 mb-3 text-right">
              اتجاه التحويلات التسويقية
            </p>
            <div className="h-36 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tealAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5eead4' }} />
                  <YAxis hide domain={[0, 'dataMax + 8']} />
                  <Tooltip
                    contentStyle={{
                      direction: 'rtl',
                      borderRadius: 12,
                      border: '1px solid #ccfbf1',
                      boxShadow: '0 4px 20px rgba(13,148,136,0.1)',
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}%`, 'معدل التحويل']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tealAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Links Indicator */}
          <div className="p-4 rounded-xl bg-white border border-teal-100/60 flex items-center justify-between shadow-sm">
            <span className="text-sm font-medium text-teal-800">الروابط النشطة حالياً</span>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="font-extrabold text-lg text-teal-900">12</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}