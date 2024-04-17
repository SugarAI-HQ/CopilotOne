import { NextPage } from "next";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { NextPageWithLayout } from "~/pages/_app";
import SwaggerUI from "swagger-ui-react";

// const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const Swagger: NextPageWithLayout = () => {
  // Serve Swagger UI with our OpenAPI schema
  return <SwaggerUI url="/api/openapi.json" />;
};

// Swagger.getLayout = getLayout

export default Swagger;
