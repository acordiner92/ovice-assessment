import type { User } from "./UserCsvDocument";

const isAllCommonAscii = (value: string): boolean =>
  [...value].every(
    (char) => char.charCodeAt(0) >= 0 && char.charCodeAt(0) <= 127
  );

const isFullWidthCharacters = (value: string): boolean =>
  value.match(/[\u{FF01}-\u{FF5E}]+/gu) !== null;

const getNativeLanguageUser = (
  users: ReadonlyArray<User>
): ReadonlyArray<User> =>
  users.filter(
    (user) => !isAllCommonAscii(user.name) && !isFullWidthCharacters(user.name)
  );

const getCommonAsciiUser = (users: ReadonlyArray<User>): ReadonlyArray<User> =>
  users.filter((user) => isAllCommonAscii(user.name));

const getLatestLoggedInUser = (users: ReadonlyArray<User>): User =>
  [...users].sort((a, b) => {
    return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
  })[0];

const hasNoDuplicates = (users: ReadonlyArray<User>): Boolean =>
  users.length === 1;

const hasSameName = (users: ReadonlyArray<User>): Boolean =>
  [...new Set(users.map((user) => user.name))].length === 1;

const getUsersGroupByEmail = (
  users: ReadonlyArray<User>
): Record<string, ReadonlyArray<User>> =>
  users.reduce<Record<string, User[]>>(
    (acc, user) => ({
      ...acc,
      [user.email]: [...(acc[user.email] ?? []), user],
    }),
    {}
  );

export const dedupeUsers = (
  users: ReadonlyArray<User>
): ReadonlyArray<User> => {
  const usersGroupByEmail = getUsersGroupByEmail(users);

  return Object.keys(usersGroupByEmail).map((email) => {
    const usersByEmail = usersGroupByEmail[email];
    if (hasNoDuplicates(usersByEmail)) {
      return usersByEmail[0];
    }

    if (hasSameName(usersByEmail)) {
      return getLatestLoggedInUser(usersByEmail);
    }

    const [nativeLanguageUser] = getNativeLanguageUser(usersByEmail);
    if (nativeLanguageUser) {
      return nativeLanguageUser;
    }

    const [asciiUser] = getCommonAsciiUser(usersByEmail);
    if (asciiUser) {
      return asciiUser;
    }

    return users[0];
  });
};
