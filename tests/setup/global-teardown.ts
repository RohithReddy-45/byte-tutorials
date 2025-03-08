import fs from "node:fs";
import path from "node:path";

async function globalTeardown() {
  const filePath = path.join(__dirname, "../../storageState.json");
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`Successfully deleted file: ${filePath}`);
    }
  });
}

export default globalTeardown;
