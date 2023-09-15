import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

function PromptDeploy() {
    const [open, setOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentSuccess, setDeploymentSuccess] = useState(false);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleDeployCode = () => {
        // Start deployment animation
        setIsDeploying(true);

        // Simulate deployment delay with a timeout (you can replace this with your actual deployment logic)
        setTimeout(() => {
            // Stop deployment animation and show success
            setIsDeploying(false);
            setDeploymentSuccess(true);

            // Close the modal after a few seconds
            setTimeout(() => {
                setOpen(false);
                // Reset success state for the next deployment
                setDeploymentSuccess(false);
            }, 3000); // Adjust the timeout duration as needed
        }, 2000); // Adjust the timeout duration to simulate deployment time
    };

    return (
        <span>
            <Button
                color="success"
                variant="text"
                onClick={handleOpenModal}
            >
                <RocketLaunchIcon></RocketLaunchIcon>
            </Button>
                <Dialog open={open} onClose={handleCloseModal}>
                    <DialogTitle>Deploy Prompt</DialogTitle>
                    <DialogContent>
                        {isDeploying ? (
                            <div>
                                <CircularProgress />
                                <p>Deploying prompt...</p>
                            </div>
                        ) : deploymentSuccess ? (
                            <p>Deployment successful!</p>
                        ) : (
                            <div>
                                <p>Are you sure you want to deploy the code?</p>
                                <p>This action cannot be undone.</p>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {isDeploying ? null : deploymentSuccess ? null : (
                            <Button onClick={handleCloseModal} color="primary">
                                Cancel
                            </Button>
                        )}
                        {isDeploying ? null : deploymentSuccess ? null : (
                            <Button onClick={handleDeployCode} color="primary">
                                Deploy
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
        </span>
    );
}

export default PromptDeploy;