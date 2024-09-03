import React from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const VoiceFormBreadcrumbs: React.FC = () => {
  const router = useRouter();
  const pathnames = router.asPath.split("/").filter((x) => x);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
  ) => {
    event.preventDefault();
    router.push(href);
  };

  console.log(`pathnames: `, pathnames);

  return (
    <Breadcrumbs aria-label="breadcrumb" className="sai-breadcrumbs">
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <Typography color="textPrimary" key={to}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            href={to}
            onClick={(event) => handleClick(event, to)}
            key={to}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default VoiceFormBreadcrumbs;
