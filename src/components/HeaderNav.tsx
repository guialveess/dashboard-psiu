"use client";

import React, { useEffect, useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import PageTitle from "./PageTitle";
import Modal from "./Modal";
import SidebarNav from "./SidebarNav";
import UserMenu from "./UserMenu";

type Props = {
  // Definindo a função como uma propriedade
};

export default function HeaderNav({}: Props) {
  // Agora aceitando toggleDarkMode como props
  const [isModalOpen, setModalOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // A função toggleDarkMode já está sendo passada como props

  const [windowSize, setWindowSize] = useState<any>({
    width: null,
    height: null,
  });

  type HeaderNavProps = {
    toggleDarkMode: () => void; // Adicionando a definição para a propriedade toggleDarkMode
  };

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode)); // Converter isDarkMode para string
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollPosition || !!windowSize.width) {
      setModalOpen(false);
    }
  }, [scrollPosition, windowSize.width]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="w-full py-[0.5625rem] border-b px-2 lg:px-5 ">
          <>
            <button
              type="button"
              title="close modal"
              onClick={closeModal}
              className={`absolute h-10 w-10 flex items-center border border-black  justify-center z-[50] p-2 top-5 right-5 text-2xl rounded-full hover:bg-black hover:text-white ${
                isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <X />
            </button>
            <aside
              className={`bg-white h-screen z-[100] absolute left-0 top-0 border-r transition-all duration-300  ${
                isModalOpen
                  ? "opacity-100 visible ml-0"
                  : "opacity-0 invisible  ml-[-100%]"
              }`}
            >
              <SidebarNav />
            </aside>
          </>

          <>
            <div
              className={`flex items-center justify-between lg:hidden ${
                openSearch ? "block" : "hidden"
              }`}
            >
              <label
                htmlFor="search"
                className="flex flex-1  ml-auto bg-white border rounded-full px-2 items-center gap-x-2  focus:outline-none focus:border-blue-500 focus:shadow-outline-blue "
              >
                <img
                  src="images/search.png"
                  alt="search"
                  className="h-4 w-4 cursor-pointer  object-contain"
                />
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Procurar..."
                  className="placeholder:text-[#A3A3A3] bg-transparent focus:outline-none rounded-full w-full p-3 placeholder:text-sm py-[0.5rem]  "
                />
              </label>

              <Button
                onClick={() => setOpenSearch(false)}
                className="bg-transparent rounded-full text-black hover:bg-muted size-default p-2 h-10 w-10 lg:hidden"
              >
                <X />
              </Button>
            </div>

            <div className="flex items-center gap-2 justify-between md:gap-4 py-[0.5625rem] px-2 lg:px-5">
              <Button
                onClick={openModal}
                className={`bg-transparent rounded-full text-black hover:bg-muted size-default p-2 h-10 w-10 lg:hidden ${
                  openSearch ? "hidden" : "block"
                }`}
              >
                <Menu />
              </Button>

              {!openSearch && (
                <PageTitle className="hidden mr-auto md:flex md:text-lg">
                  Psiuu Dashboard !
                </PageTitle>
              )}

              <label
                htmlFor="search"
                className="hidden lg:flex ml-auto bg-white border rounded-full px-2 items-center gap-x-2 cursor-pointer focus:outline-none focus:border-blue-500 focus:shadow-outline-blue "
              >
                <img
                  src="images/search.png"
                  alt="search"
                  className="h-4 w-4 object-contain"
                />
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Procurar..."
                  className="placeholder:text-[#A3A3A3] bg-transparent focus:outline-none rounded-full w-full lg:w-auto p-3 placeholder:text-sm py-[0.5rem]  "
                />
              </label>

              <div
                className={`flex items-center space-x-3 lg:space-x-5 ${
                  openSearch ? "hidden" : "block"
                }`}
              >
                <div className="hidden lg:flex items-center space-x-2">
                  <img
                    src="images/calendar.png"
                    alt="calendar"
                    className="w-4 h-4"
                  />
                  <span className="hidden lg:block text-sm">
                    {new Date().toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <label
                  onClick={() => setOpenSearch(true)}
                  htmlFor="search"
                  className="lg:hidden h-10 w-10 flex justify-center ml-auto bg-white border rounded-full px-2 items-center cursor-pointer focus:outline-none focus:border-blue-500 focus:shadow-outline-blue "
                >
                  <img
                    src="images/search.png"
                    alt="search"
                    className="object-contain"
                  />
                </label>

                <Button className="bg-transparent rounded-full lg:flex w-10 h-10 items-center justify-between border border-[#DADDDD] text-black hover:bg-transparent px-2">
                  <Bell />
                </Button>

                <UserMenu />
              </div>
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}
