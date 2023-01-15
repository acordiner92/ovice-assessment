import { filterUsersByDateRange, UserCsvDocument } from "./UserCsvDocument";

describe("UserCsvDocument", () => {
  const userCsvDocument: UserCsvDocument = {
    csvHeadings: [],
    users: [
      {
        name: "Ezekiel Heaney",
        email: "ernie@auer.io",
        lastLogin: "2022-06-07 19:48:33 +0800",
        workspace: '"Zemlak, Walter and Berge"',
        role: "member",
      },
    ],
  };

  describe(filterUsersByDateRange.name, () => {
    test("if the last login date is equal to the from date then it should be returned", () => {
      const fromDate = new Date("2022-06-07 19:48:33 +0800");
      const toDate = new Date("2022-06-07 20:48:33 +0800");

      const { users } = filterUsersByDateRange(
        fromDate,
        toDate,
        userCsvDocument
      );

      expect(users.length).toBe(1);
    });

    test("if the last login date is greater than the from date but equal or less than the to date then it should be returned", () => {
      const fromDate = new Date("2022-06-07 17:48:33 +0800");
      const toDate = new Date("2022-06-07 20:48:33 +0800");

      const { users } = filterUsersByDateRange(
        fromDate,
        toDate,
        userCsvDocument
      );

      expect(users.length).toBe(1);
    });

    test("if the last login date is greater than the from date but equal to the to date then it should be returned", () => {
      const fromDate = new Date("2022-06-07 17:48:33 +0800");
      const toDate = new Date("2022-06-07 19:48:33 +0800");

      const { users } = filterUsersByDateRange(
        fromDate,
        toDate,
        userCsvDocument
      );

      expect(users.length).toBe(1);
    });

    test("if the last login date is less than from date then its excluded", () => {
      const fromDate = new Date("2022-06-07 17:48:33 +0800");
      const toDate = new Date("2022-06-07 19:48:33 +0800");

      const { users } = filterUsersByDateRange(fromDate, toDate, {
        ...userCsvDocument,
        users: [
          {
            ...userCsvDocument.users[0],
            lastLogin: "2022-06-07 16:48:33 +0800",
          },
        ],
      });

      expect(users.length).toBe(0);
    });

    test("if the last login date is greater than the to date then its excluded", () => {
      const fromDate = new Date("2022-06-07 17:48:33 +0800");
      const toDate = new Date("2022-06-07 19:48:33 +0800");

      const { users } = filterUsersByDateRange(fromDate, toDate, {
        ...userCsvDocument,
        users: [
          {
            ...userCsvDocument.users[0],
            lastLogin: "2022-06-07 22:48:33 +0800",
          },
        ],
      });

      expect(users.length).toBe(0);
    });
  });
});
