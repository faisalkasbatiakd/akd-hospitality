import { docUrl } from "@/lib/site";
import type { DocItem } from "@/data/investors";

type DocRecord = { title: string; file: string };

const withUrls = (records: readonly DocRecord[]): DocItem[] =>
  records.map((r) => ({ title: r.title, href: docUrl(r.file) }));

const shareholdingPatternRecords: DocRecord[] = [
  { title: "For the year 2023", file: "ShareholdingPattern_20230630.pdf" },
  { title: "For the year 2022", file: "ShareholdingPattern_20220630.pdf" },
  { title: "For the year 2021", file: "ShareholdingPattern_20210630.pdf" },
  { title: "For the year 2020", file: "ShareholdingPattern_20200630.pdf" },
  { title: "For the year 2019", file: "ShareholderPattern2019.pdf" },
  { title: "For the year 2018", file: "ShareholderPattern_20180630.pdf" },
  { title: "For the year 2015", file: "ShareholderPattern2015.pdf" },
  { title: "For the year 2013", file: "ShareholderPattern2013.pdf" },
  { title: "For the year 2012", file: "ShareholderPattern2012.pdf" },
  { title: "For the year 2011", file: "ShareholderPattern2011.pdf" },
];

export const shareholdingPatternDocs: DocItem[] = withUrls(shareholdingPatternRecords);

const electionRecords: DocRecord[] = [
  { title: "Notice", file: "Notice of Election Combined 18-10-2023.pdf" },
  { title: "Director Profile", file: "Profiles of the Directors for website.pdf" },
  { title: "List of Shareholders (Password Protected)", file: "List of Share Holder - AGM 2023.pdf" },
];

export const electionDocs: DocItem[] = withUrls(electionRecords);

const genderDiversityRecords: DocRecord[] = [
  { title: "Gender Diversity", file: "GenderpaygapstatementunderCircular10of2024.pdf" },
];

export const genderDiversityDocs: DocItem[] = withUrls(genderDiversityRecords);
