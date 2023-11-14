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

  const truncateDescription = (description: string, maxLines: number) => {
    const lines = description.split(" ");
    if (lines.length <= maxLines * 10) {
      return description;
    }
    return lines.slice(0, maxLines * 10).join(" ") + "...";
  };

  return (
    <Grid container spacing={1}>
      {/* {packages && packages.length > 0 ? ( */}
      {packages.map((pkg, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <CardHeader title={pkg?.name} />
            {pkg!.description ? (
              <CardContent>
                <Typography
                  variant="body2"
                  style={{
                    overflow: "hidden",
                    height: "40px",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {truncateDescription(pkg?.description || "", 2)}
                </Typography>
              </CardContent>
            ) : (
              <CardContent>
                <Typography
                  variant="body2"
                  style={{
                    height: "40px",
                    alignItems: "center",
                    alignContent: "center",
                    paddingBottom: "20px",
                    fontSize: "17px",
                    opacity: "60%",
                  }}
                >
                  {"No description entered"}
                </Typography>
              </CardContent>
            )}
            <CardActions>
              <Chip
                sx={{ mr: 2 }}
                size="small"
                label={pkg?.visibility}
                // variant="conti"
              />
              <Button
                href={`/dashboard/prompts/${pkg?.id}`}
                style={{
                  accentColor: "black",
                  borderColor: "GrayText",
                  borderRadius: "25px",
                  padding: 0,
                  textTransform: "none",
                }}
              >
                View
              </Button>
              <Button
                href={`/dashboard/prompts/${pkg?.id}/logs`}
                style={{
                  accentColor: "black",
                  borderColor: "GrayText",
                  borderRadius: "25px",
                  padding: 0,
                  textTransform: "none",
                }}
              >
                Logs
              </Button>
              <Button
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpen(pkg!.id)}
                style={{
                  accentColor: "black",
                  borderColor: "GrayText",
                  left: 1,
                  borderRadius: "25px",
                  padding: "0px",
                  textTransform: "none",
                }}
              >
                Edit
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
              fontSize={18}
              padding={2}
              fontWeight={700}
            >
              No cards created
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
