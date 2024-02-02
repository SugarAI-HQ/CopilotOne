import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Link as MUILink,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Button,
  CardActionArea,
} from "@mui/material";
import { CreatePackage } from "~/components/create_package";
import UpdatePackage from "~/components/update_package";
import { api } from "~/utils/api";
import { MutationObserverSuccessResult } from "@tanstack/react-query";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import toast from "react-hot-toast";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { useRouter } from "next/router";

function Packages({
  packages,
  setPackages,
}: {
  packages: Array<pp>;
  setPackages: any;
}) {
  const [open, setOpen] = useState(false);
  const [packageId, setPackageId] = useState("");

  const mutation = api.prompt.updatePackage.useMutation();

  const handleOpen = (id: string) => {
    setOpen(!open);
    setPackageId(id);
  };

  const updateArray = (id: string, description: string) => {
    const obj = packages?.find((item) => item!.id === id);
    obj!.description = description;
    const newArray: pp[] = [];
    packages?.forEach((item) => {
      if (item?.id === id) {
        newArray.push(obj!);
      } else {
        newArray.push(item);
      }
    });

    const input = {
      id: id,
      name: obj!.name,
      description: obj!.description,
      visibility: obj!.visibility,
    };

    mutation.mutate(input, {
      onSuccess() {
        toast.success("Package Updated Successfully");
        setPackages([...newArray]);
        setOpen(false);
      },
      onError(error) {
        const errorData = JSON.parse(error.message);
        console.log("error for already existing name", errorData);
      },
    });
  };

  return (
    <Grid container spacing={1}>
      {/* {packages && packages.length > 0 ? ( */}
      {packages.map((pkg, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardActionArea href={`/dashboard/prompts/${pkg?.id}`}>
              <CardHeader
                title={pkg?.name}
                action={
                  <Chip
                    sx={{ mr: 2 }}
                    size="small"
                    label={pkg?.visibility}
                    // variant="conti"
                  />
                }
              />

              <CardContent>
                <Typography
                  sx={{
                    height: "3em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    "&:hover": {
                      height: "10rem",
                      overflow: "auto",
                      WebkitLineClamp: "unset",
                    },
                  }}
                >
                  {pkg?.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" onClick={() => handleOpen(pkg!.id)}>
                Edit
              </Button>
              <Button size="small" href={`/dashboard/prompts/${pkg?.id}/logs`}>
                Logs
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      {/* ) : (
<Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '80vh' }}
    >
      </Grid>
      )} */}

      {open === true ? (
        <>
          <UpdatePackage
            open={open}
            setOpen={setOpen}
            packageId={packageId}
            updateArray={updateArray}
          ></UpdatePackage>
        </>
      ) : (
        <></>
      )}
    </Grid>
  );
}

const PackageHome = () => {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [customError, setCustomError] = useState({});

  function handlePackageCreationSuccess(createdPackage: pp) {
    setStatus("success");
    toast.success("Package Created Successfully");
    router.push("/dashboard/prompts/" + createdPackage?.id);
  }

  const mutation = api.prompt.createPackage.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (createdPackage) => {
      if (createdPackage !== null) {
        setCustomError({});
        handlePackageCreationSuccess(createdPackage);
      } else {
        // Handle the case where createdPackage is null
        // This can happen if the mutation result is null
        // You might want to show an error message or handle it in another way
        toast.error("Something went wrong, Please try again");
      }
    },
  });

  // console.log("mutate", mutation);
  const [packages, setPackages] = useState<pp[]>();
  api.prompt.getPackages.useQuery(
    {},
    {
      onSuccess(data: pp[]) {
        setPackages([...data]);
      },
    },
  );

  return (
    <>
      {packages && packages.length > 0 ? (
        <>
          <CreatePackage
            onSubmit={mutation.mutate}
            status={status}
            customError={customError}
            PackagesExits={true}
          ></CreatePackage>
          <Packages packages={packages || []} setPackages={setPackages} />
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "80vh" }}
        >
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h5"
              // fontSize={18}
              padding={3}
              // fontWeight={700}
            >
              Create your first Prompt Package
            </Typography>
            <CreatePackage
              onSubmit={mutation.mutate}
              status={status}
              customError={customError}
              PackagesExits={false}
            ></CreatePackage>
          </Grid>
        </Grid>
      )}
    </>
  );
};
PackageHome.getLayout = getLayout;
export default PackageHome;
