import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_FILE_PATH = "../data/sales.json";
const COLLECTION_NAME = "sales";

const chargeData = (filePath) => {
  try {
    const absolutePath = path.join(__dirname, filePath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error(`Error reading DATA file from ${filePath}:`, err);
    return null;
  }
};

const FbCharge = async () => {
  try {
    const data = chargeData(JSON_FILE_PATH); 

    if (!data) {
      throw new Error("No data found or failed to read DATA file");
    }

    for (const item of data) {
      await addDoc(collection(db, COLLECTION_NAME), item);
    }

    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading DATA: ", error);
  }
};

FbCharge();
