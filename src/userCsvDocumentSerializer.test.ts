import { UserCsvDocument } from "./UserCsvDocument";
import { serializeUserCsvDocument } from "./userCsvDocumentSerializer";

describe("userCsvDocumentSerializer", () => {
  describe(serializeUserCsvDocument.name, () => {
    test("A userCsvDocument is serialized to a csv string correctly", () => {
      const userCsvDocument: UserCsvDocument = {
        csvHeadings: ["Name", "Email", "Last Login", "Workspace", "Role"],
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
      const result = serializeUserCsvDocument(userCsvDocument);
      expect(result).toBe(`Name,Email,Last Login,Workspace,Role
Ezekiel Heaney,ernie@auer.io,2022-06-07 19:48:33 +0800,\"Zemlak, Walter and Berge\",member`);
    });
  });
});
