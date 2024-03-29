import { readCsvFile, writeToFile } from "./csvClient";
import { dedupeUsers } from "./userDeduper";
import { parseToUserCsvDocument } from "./userCsvDocumentParser";
import { serializeUserCsvDocument } from "./userCsvDocumentSerializer";
import { filterUsersByDateRange } from "./UserCsvDocument";

export const question1 = (url: string): void => {
  const userCsvDocument = parseToUserCsvDocument(readCsvFile(url));
  const dedupedUsers = dedupeUsers(userCsvDocument.users);

  const outputUrl = url.replace(/[^\/]+$/, "questionOneOutput.csv");

  writeToFile(
    outputUrl,
    serializeUserCsvDocument({
      csvHeadings: userCsvDocument.csvHeadings,
      users: dedupedUsers,
    })
  );
};

export const question2 = (url: string, from: Date, to: Date): void => {
  const userCsvDocument = parseToUserCsvDocument(readCsvFile(url));
  const dedupedUsers = dedupeUsers(userCsvDocument.users);

  const filteredUserCsvDocument = filterUsersByDateRange(from, to, {
    csvHeadings: userCsvDocument.csvHeadings,
    users: dedupedUsers,
  });

  const outputUrl = url.replace(/[^\/]+$/, "questionTwoOutput.csv");
  writeToFile(outputUrl, serializeUserCsvDocument(filteredUserCsvDocument));
};

question1("/Users/andrewcordiner/Documents/ovice-assessment/data.csv");
