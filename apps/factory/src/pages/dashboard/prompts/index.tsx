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
} from "@mui/material";
import { CreatePackage } from "~/components/create_package";
import Update_package from "~/components/Update_package";
import { api } from "~/utils/api";
import { MutationObserverSuccessResult } from "@tanstack/react-query";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import toast from "react-hot-toast";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { useRouter } from "next/router";

function Packages(props) {
  const [arr, setArr] = useState<pp[]>();
  const [open, setOpen] = useState(false);
  const [pckid, setPckid] = useState("");
  // const {  refetch: refectchPackages } =
  api.prompt.getPackages.useQuery(
    {},
    {
      onSuccess(data: pp[]) {
        setArr([...data]);
        console.log("hello", data);
      },
    },
  );

  const mutation = api.prompt.updatePackage.useMutation();

  const handleOpen = (id: string) => {
    setOpen(!open);
    setPckid(id);
  };

  const updateArray = (data: pp) => {
    console.log("value", checkNameExistence(data!.name, data!.id));
    if (checkNameExistence(data!.name, data!.id)) {
      toast.error("Package name already exists");
      return;
    } else {
      mutation.mutate(data!);
      const newArray: pp[] = [];
      arr?.forEach((item) => {
        if (item?.id === data?.id) {
          newArray.push(data);
        } else {
          newArray.push(item);
        }
      });
      setArr([...newArray]);
      setOpen(false);
    }
  };

  const checkNameExistence = (name: string, id: string): boolean => {
    let flag = false;
    arr?.forEach((item) => {
      if (item?.name === name && id != item.id) {
        console.log("hello world");
        flag = true;
      }
    });
    return flag;
  };

  return (
    <Grid container spacing={1}>
      {arr && arr.length > 0 ? (
        arr.map((pkg, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardHeader title={pkg?.name} />
              <CardContent>
                <Typography>{pkg?.description}</Typography>
              </CardContent>
              <CardActions>
                <Chip
                  sx={{ mr: 2 }}
                  size="small"
                  label={pkg?.visibility}
                  // variant="conti"
                />
                <MUILink href={`/dashboard/prompts/${pkg?.id}`}>View</MUILink>
                <MUILink href={`/dashboard/prompts/${pkg?.id}/logs`}>
                  Logs
                </MUILink>
                <MUILink
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleOpen(pkg?.id)}
                >
                  Edit
                </MUILink>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography>No cards created</Typography>
        </Grid>
      )}

      {open === true ? (
        <>
          <Update_package
            open={open}
            setOpen={setOpen}
            pckid={pckid}
            updateArray={updateArray}
            checkNameExistence={checkNameExistence}
          ></Update_package>
        </>
      ) : (
        <></>
      )}
    </Grid>
  );
}

const PackageHome = () => {
  const router = useRouter();

  const [checks, setChecks] = useState(false);
  useEffect(() => {
    console.log(checks);
  }, [checks]);
  function handlePackageCreationSuccess(createdPackage: pp) {
    toast.success("Package Created Successfully");
    router.push("/dashboard/prompts/" + createdPackage?.id);
  }
  const mutation = api.prompt.createPackage.useMutation({
    onSuccess: (createdPackage) => {
      if (createdPackage !== null) {
        // Handle the success case with createdPackage
        handlePackageCreationSuccess(createdPackage);
      } else {
        // Handle the case where createdPackage is null
        // This can happen if the mutation result is null
        // You might want to show an error message or handle it in another way
      }
    },
    // onSuccess: handlePackageCreationSuccess,
  });
  return (
    <>
      <CreatePackage onSubmit={mutation.mutate}></CreatePackage>
      <Packages />
    </>
  );
};
PackageHome.getLayout = getLayout;
export default PackageHome;
