'use client'

import ControlPanel from "@/app/components/ControlPanel";
import LogViewer from "@/app/components/LogViewer";
import PriceTicker from "@/app/components/PriceTicker"
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState('IDLE')

  return (
    <main className="max-w-6xl mx-auto py-2 px-4">
      <h1 className="text-2xl font-bold mb-6">Fyers Trading Bot Dashboard</h1>
      <ControlPanel status={status} setStatus={setStatus} />
      <LogViewer status={status} />
      <PriceTicker />
    </main>
  );
}
