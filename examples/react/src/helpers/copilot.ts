export function getPreviewConfig(event: any) {
  // Check the origin of the message to ensure security
  console.log(`post event ${JSON.stringify(event.data)}`);
  if (event.origin === "https://creation-page-domain.com") {
    // Retrieve data from the message
    // const copilotId = event.data.copilotId;
    // const copilotKey = event.data.copilotKey;
    // Do something with the data
    // console.log("copilot ID:", copilotId);
    // console.log("copilot Key:", resourceKey);
  }
  return event.data;
}
