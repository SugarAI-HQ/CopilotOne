import React, { useState } from "react";
import classNames from "classnames";
import { PageProps } from "./Page";

// import "~/react/styles/form.css";

// Pages Component
interface PagesProps {
  children: React.ReactElement<PageProps>[];
  config?: { fullScreen?: boolean; width?: string; height?: string };
}

export const Pages = ({
  children,
  config = { fullScreen: false, width: "full", height: "full" },
}: PagesProps) => {
  const [activePage, setActivePage] = useState(0);

  const containerClasses = classNames(
    "sai-pages relative overflow-hidden transition-all duration-300 ",
    {
      "w-screen h-screen": config.fullScreen,
      [`w-${config.width}`]: !config.fullScreen && config.width,
      [`h-${config.height}`]: !config.fullScreen && config.height,
    },
  );

  const goToNextPage = () => {
    if (activePage < children.length - 1) {
      setActivePage(activePage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (activePage > 0) {
      setActivePage(activePage - 1);
    }
  };

  return (
    <div className={containerClasses}>
      <div
        className="sai-pages-container flex transition-transform duration-300"
        style={{ transform: `translateX(-${activePage * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className="sai-page-container h-dvh min-w-full">
            {child}
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-4 flex space-x-4">
        <button
          onClick={goToPreviousPage}
          disabled={activePage === 0}
          className="p-2 bg-gray-200 rounded-md"
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={activePage === children.length - 1}
          className="p-2 bg-gray-200 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};
