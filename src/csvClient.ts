import fs from "fs";

export const readCsvFile = (url: string): ReadonlyArray<string> => {
  const data = fs.readFileSync(url);
  return data.toString("utf-8").split("\n");
};

export const writeToFile = (url: string, csvString: string) =>
  fs.writeFileSync(url, csvString, "utf-8");
