import React, { useState } from "react";
import classNames from "classnames";

// Page Component
export interface PageProps {
  children: React.ReactNode;
  layout?: "default" | "headingOnly" | "headingWithText";
}

export const Page = ({ children, layout = "default" }: PageProps) => {
  const getPageLayout = () => {
    switch (layout) {
      case "headingOnly":
        return <h1 className="text-4xl text-center">{children}</h1>;
      case "headingWithText":
        return (
          <div className="flex flex-col items-center text-center">
            {Array.isArray(children) && (
              <>
                <h1 className="text-4xl mb-4">{children[0]}</h1>
                <p className="text-xl">{children[1]}</p>
              </>
            )}
          </div>
        );
      default:
        return <div>{children}</div>;
    }
  };

  return <div className="sai-page p-8">{getPageLayout()}</div>;
};
