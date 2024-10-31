"use client";

import CardContent from "@/components/CardContent";
import LastOrder from "@/components/LastOrder";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [] = useState(false);

  return (
    <div className="p-2 md:p-5 flex flex-col gap-5 w-full h-screen overflow-hidden">
      <section className="w-full flex flex-col gap-4">
        {/* Primeira seção (caso haja conteúdo adicional) */}
      </section>

      <section className="w-full flex flex-col gap-4 lg:flex-row overflow-y-auto max-h-[70vh]">
        <CardContent className="w-full max-w-full py-2 bg-white">
          <div className="flex items-center justify-between space-x-4 pt-[11px] pb-[15px] text-center">
            {/* Link comentado */}
          </div>
          <LastOrder />
        </CardContent>
      </section>
    </div>
  );
}
