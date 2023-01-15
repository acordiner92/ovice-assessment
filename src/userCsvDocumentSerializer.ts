import { User, UserCsvDocument } from "./UserCsvDocument";

const serializeUserToCsv = (users: ReadonlyArray<User>): string =>
  users
    .map((u) => [u.name, u.email, u.lastLogin, u.workspace, u.role].join(","))
    .join("\n");

export const serializeUserCsvDocument = ({
  csvHeadings,
  users,
}: UserCsvDocument): string =>
  `${csvHeadings.join(",")}\n${serializeUserToCsv(users)}`;
