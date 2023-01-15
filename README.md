# ovice-assessment

## Requirements
- Node v19.3.0

## How to setup
```
npm ci
```

## How to run
Make sure to call the functions in the main.ts in either a new file 
or within main.ts with the parameters you desire. For eg.

```js
const csvFilePath =  // path to your csv file 
question1(csvFilePath);
question2(csvFilePath, new Date("2020-01-01"), new Date("2021-01-01"));
```

```
 npm start
```

Once the script has finished executing you should see 2 new files in the same directory which are the output csv files from question 1 and 2. It should be called `questionOneOutput.csv` and `questionTwoOutput.csv`

## How to test
```
npm run test
```

## Thought process
Upon reviewing the requirement and looking through the csv data set, my first thought was to read and parse the csv into a Javascript Object called `UserCsvDocument` that encapsulated the csv heading and rows in a more easily understandable format to manipulate and perform actions against. 

The reason I wanted to parse the data was I noticed the CSV data had rows where there was either no values present or only partial values present. My assumption was it would be best to remove these because they were incomplete users and being incomplete, it open up more states in the code to be concerned which we want to avoid (e.g what if 2 users have same email but one is missing its name). It also validate that the values are of the correct type (e.g the last login is a valid datetime). My philosophy is that data coming into the boundaries of your application should always be parsed and validated before being apply to application's logic. This parsing logic is handled in the `userCsvDocumentParser`.

To be able to satisfy the requirements of the first question, I decided to break down the words in their characters and inspect them in terms of their unicode values. What I noticed was values like `Ｊａｍｅｓ` were of the latin range in unicode but were consider a full-width character. The basic latin a.k.a the common ASCII characters are all half-width characters. So with this, I could make the assumption that if it was not a full-width character nor common ASCII then it had to be a native language. All non duplicates were return early and any users with same name and email had the later login one returned. This seems to satisfy the requirements as well as what I was seeing in the csv data. However I do have to admit there could be cases I have a missed if potentially other unicode characters and combinations were to show up in the csv. This logic was handled in the `userDeduper`

As for question 2 since most of the functionality had been written in question 1, I was able to reuse a lot of it. The only additional functionality needed was the filtering of the users. Since the datetimes in the CSV were local time `+800` I converted them into UTC to be compared against the to and from datetimes which are in UTC and filtered accordingly (set Node.js instance to run in UTC via `TZ=UTC` environment variable). 

Here are some of resources I used to make my decision:
- https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/
- https://stackoverflow.com/questions/27084617/detect-strings-with-non-english-characters-in-python
- https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)
- https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block)
- https://2ality.com/2017/07/regexp-unicode-property-escapes.html

## Caveats
- At the moment I only assumed there will be 1 column that had values wrapped in "". If a new column was to be added with "" then this code would fail.
- For the filtering, all the last login values are compared in utc against the from and to datetimes since I set the env TZ=UTC to have Node.js run in UTC
- A few cases spring to mind that could happen but are not handled such as 2 user names are native languages which one to pick or 2 user names where 1 name is full-width characters in Japanese and 1 is half-width characters
- I haven't really given much thought into the performance of the script
- I think this application may fail to run in windows when trying to write the result to file since I think Windows uses directories with `\` where I have hardcoded to use Mac/Linux way of `/` 