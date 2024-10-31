"use client"; // Adicionando esta linha para marcar o componente como cliente

import React from "react";
import PageTitle from "@/components/PageTitle";

export default function UsersPage() {
  return (
    <div className="flex-1 p-5">
      <div className="flex flex-col bg-white p-5 rounded-md">
        <div className="flex items-center justify-between">
          <main className="mx-4 flex flex-col gap-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Pedidos
            </h1>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
              With Keyboard Controls and Screen Reader interactions.
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
