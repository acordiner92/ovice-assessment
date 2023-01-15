import { z } from "zod";
import { User, UserCsvDocument } from "./UserCsvDocument";

const propertyNameOfColumn = [
  "name",
  "email",
  "lastLogin",
  "workspace",
  "role",
];

const splitToColumns = (row: string): ReadonlyArray<String> => {
  const [before, value, after] = row.split(/,"|",/g);
  if (!value) {
    return before.split(",");
  }
  return [...before.split(","), `"${value}"`, ...after.split(",")];
};

const parseRowToObject = (row: string): unknown =>
  splitToColumns(row).reduce(
    (prev, column, index) => ({
      ...prev,
      [propertyNameOfColumn[index]]: column,
    }),
    {}
  );

const filterSuccessfulResults = (
  parsedResults: z.SafeParseReturnType<User, User>[]
): ReadonlyArray<User> =>
  parsedResults.reduce<User[]>(
    (acc, result) => (result.success ? [...acc, result.data] : acc),
    []
  );

export const parseToUserCsvDocument = (
  csvRows: ReadonlyArray<string>
): UserCsvDocument => {
  const [headings, ...rows] = csvRows;
  const parsedResults = rows.map((row) =>
    User.safeParse(parseRowToObject(row))
  );

  return {
    csvHeadings: headings?.split(",") ?? [],
    users: filterSuccessfulResults(parsedResults),
  };
};
