import { parseToUserCsvDocument } from "./userCsvDocumentParser";

describe("userCsvDocumentParser", () => {
  describe(parseToUserCsvDocument.name, () => {
    test("The headings are parsed", () => {
      const { csvHeadings } = parseToUserCsvDocument([
        "Name,Email,Last Login,Workspace,Role",
        'Ezekiel Heaney,ernie@auer.io,2022-06-07 19:48:33 +0800,"Zemlak, Walter and Berge",member',
      ]);

      expect(csvHeadings).toStrictEqual([
        "Name",
        "Email",
        "Last Login",
        "Workspace",
        "Role",
      ]);
    });

    test("A csv row is parsed as a User", () => {
      const { users } = parseToUserCsvDocument([
        "Name,Email,Last Login,Workspace,Role",
        'Ezekiel Heaney,ernie@auer.io,2022-06-07 19:48:33 +0800,"Zemlak, Walter and Berge",member',
      ]);

      expect(users).toStrictEqual([
        {
          name: "Ezekiel Heaney",
          email: "ernie@auer.io",
          lastLogin: "2022-06-07 19:48:33 +0800",
          workspace: '"Zemlak, Walter and Berge"',
          role: "member",
        },
      ]);
    });

    test("Different string characters is parsed correctly", () => {
      const { users } = parseToUserCsvDocument([
        "Name,Email,Last Login,Workspace,Role",
        'Noël,noel@google.com,2021-01-22 21:30:16 +0800,"Feeney, Wiza and Haley",member',
      ]);

      expect(users[0].name).toBe("Noël");
    });

    test("A row with non english characters is parsed correctly", () => {
      const { users } = parseToUserCsvDocument([
        "Name,Email,Last Login,Workspace,Role",
        '平仮名,hello@google.com,2021-01-22 21:30:16 +0800,"Feeney, Wiza and Haley",member',
      ]);

      expect(users[0].name).toBe("平仮名");
    });

    test("A row with no values is skipped", () => {
      const { users } = parseToUserCsvDocument([
        "Name,Email,Last Login,Workspace,Role",
        ",,,,,,",
      ]);

      expect(users.length).toBe(0);
    });
  });
});
