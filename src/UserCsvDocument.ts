import { isAfter, isBefore, isEqual } from "date-fns";
import { z } from "zod";

export const User = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
  lastLogin: z.string().refine((date) => !isNaN(new Date(date).getTime())),
  workspace: z.string().min(1),
  role: z.string().min(1),
});

export type User = z.infer<typeof User>;

export type UserCsvDocument = {
  csvHeadings: ReadonlyArray<string>;
  users: ReadonlyArray<User>;
};

const isEqualOrAfter = (dateOne: Date, dateTwo: Date): Boolean =>
  isEqual(dateOne, dateTwo) || isAfter(dateOne, dateTwo);

const isEqualOrBefore = (dateOne: Date, dateTwo: Date): Boolean =>
  isEqual(dateOne, dateTwo) || isBefore(dateOne, dateTwo);

export const filterUsersByDateRange = (
  from: Date,
  to: Date,
  { csvHeadings, users }: UserCsvDocument
): UserCsvDocument => ({
  csvHeadings,
  users: users.filter(
    (user) =>
      isEqualOrAfter(new Date(user.lastLogin), from) &&
      isEqualOrBefore(new Date(user.lastLogin), to)
  ),
});
