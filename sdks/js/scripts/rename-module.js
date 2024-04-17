const fs = require("fs");
const packageJson = require("../package.json");

const moduleName = packageJson.name;

console.log("Module name:", moduleName);

const filePath = "./dist/esm/index.d.ts"; // Update with the correct path to your index.d.ts file

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Replace 'declare module "index" {' with 'declare module "<moduleName>" {'
  const updatedData = data.replace(
    'declare module "index" {',
    `declare module "${moduleName}" {`,
  );

  // Write the updated content back to the file
  fs.writeFile(filePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Module declaration updated successfully!");
  });
});
