"use client";

import CardContent from "@/components/CardContent";
import LastOrder from "@/components/LastOrder";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [] = useState(false);

  return (
    <div className="p-2 md:p-5 flex flex-col gap-5 w-full">
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-[1fr_456px]">
        {" "}
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all  lg:grid-cols-[minmax(422px,_1fr)_456px]">
        <CardContent className="py-2 bg-white grid-cols-4 ">
          <div className="flex items-center justify-between space-x-4 pt-[11px] pb-[15px]">
            <Link href={`#`} className="text-[#34CAA5]">
              Todos os Pedidos
            </Link>
          </div>
          <LastOrder />
        </CardContent>
      </section>
    </div>
  );
}
