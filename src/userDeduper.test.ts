import { User } from "./UserCsvDocument";
import { dedupeUsers } from "./userDeduper";

describe("userDeduper", () => {
  describe(dedupeUsers.name, () => {
    const user: User = {
      name: "Ezekiel Heaney",
      email: "ernie@auer.io",
      lastLogin: "2022-06-07 19:48:33 +0800",
      workspace: '"Zemlak, Walter and Berge"',
      role: "member",
    };

    test("if there are no duplicates then all users are returned", () => {
      const dedupedUsers = dedupeUsers([
        user,
        { ...user, email: "ernie2@auer.io" },
      ]);

      expect(dedupedUsers.map((x) => x.email)).toStrictEqual([
        "ernie@auer.io",
        "ernie2@auer.io",
      ]);
    });

    test.each([
      [
        "2022-06-29 18:05:37 +0800",
        "2022-06-21 18:05:37 +0800",
        "2022-06-29 18:05:37 +0800",
      ],
      [
        "2022-05-15 18:05:37 +0800",
        "2022-09-22 18:05:37 +0800",
        "2022-09-22 18:05:37 +0800",
      ],
    ])(
      "if last login is %s and %s then the latest last login %s is only returned",
      (userOneLastLogin, userTwoLastLogin, expected) => {
        const dedupedUsers = dedupeUsers([
          { ...user, lastLogin: userOneLastLogin },
          { ...user, lastLogin: userTwoLastLogin },
        ]);

        expect(dedupedUsers.map((x) => x.lastLogin)).toStrictEqual([expected]);
      }
    );

    test.each([
      ["González", "Gonzalez", "González"],
      ["Yamada", "山田", "山田"],
      ["홍길동", "Hong Gildong", "홍길동"],
    ])(
      "if name is %s and %s then native language name %s is only returned",
      (userOneName, userTwoName, expected) => {
        const dedupedUsers = dedupeUsers([
          { ...user, name: userOneName },
          { ...user, name: userTwoName },
        ]);

        expect(dedupedUsers.map((x) => x.name)).toStrictEqual([expected]);
      }
    );

    test.each([
      ["Ｊａｍｅｓ", "James", "James"],
      ["marc", "ｍａｒｃ", "marc"],
    ])(
      "if name is %s and %s then ascii name %s is only returned",
      (userOneName, userTwoName, expected) => {
        const dedupedUsers = dedupeUsers([
          { ...user, name: userOneName },
          { ...user, name: userTwoName },
        ]);

        expect(dedupedUsers.map((x) => x.name)).toStrictEqual([expected]);
      }
    );
  });
});
