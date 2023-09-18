import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv} from "@prisma/client";
import CodeHighlight from './code_highlight';

function PromptDeploy({ user, pp, pt, pv }: { user: any, pp: pp, pt: pt, pv: pv }) {
    const [open, setOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentSuccess, setDeploymentSuccess] = useState(false);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setTimeout(() => {
            // Stop deployment animation and show success
            setIsDeploying(false)
            setDeploymentSuccess(false)
        }, 1000);
        
    };

    const handleDeployCode = () => {
        // Start deployment animation
        setIsDeploying(true);

        // Simulate deployment delay with a timeout (you can replace this with your actual deployment logic)
        setTimeout(() => {
            // Stop deployment animation and show success
            setIsDeploying(false);
            setDeploymentSuccess(true);

        }, 2000); // Adjust the timeout duration to simulate deployment time
    };

    const identifier = `${user.name}/${pp.name}/${pt.name}#${pv.version}`;

    const codeExample = `
import { SugarcaneAIClient } from "@sugarcane-ai/kitchen-js";

const apiKey = 'your-api-key';
const client = new SugarcaneAIClient(apiKey);

const template = client.getTemplate("${identifier}");
console.log(template);
`;


    return (
        <span>
            <Button
                color="success"
                variant="text"
                onClick={handleOpenModal}
            >
                <RocketLaunchIcon></RocketLaunchIcon>
            </Button>
                <Dialog sx={{ m: 2, p: 5 }} open={open} onClose={handleCloseModal}>
                    <DialogTitle>Deploy Prompt {identifier}</DialogTitle>
                    <DialogContent>
                        {isDeploying ? (
                            <div>
                                <CircularProgress />
                                <p>Deploying prompt...</p>
                            </div>
                        ) : deploymentSuccess ? (
                            <div>
                                <p>Deployment successful!</p>
                                <p>You can access it over the API</p>
                                <CodeHighlight code={codeExample} language="typescript" />
                                <Button color="primary" autoFocus onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </div>
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