import { docUrl } from "@/lib/site";

export type DocItem = { title: string; href: string };

/**
 * Document records: the label exactly as published on the Company's own site,
 * plus the PDF file name. URLs are built at render time from the configured
 * documents base, so the whole archive can be re-hosted by changing one
 * environment variable.
 */
type DocRecord = { title: string; file: string };

const withUrls = (records: readonly DocRecord[]): DocItem[] =>
  records.map((r) => ({ title: r.title, href: docUrl(r.file) }));

const financialStatementRecords: DocRecord[] = [
  { title: "Half Yearly Report December 2025", file: "QuarterReportDecember2025.pdf" },
  { title: "Quarterly Report Mar 2026", file: "QuarterlyReportMar2026.pdf" },
  { title: "Quarterly Report September 2025", file: "Quarterly_Report_Sept_2025.pdf" },
  { title: "Quarterly Report March 2025", file: "Q31032025.pdf" },
  { title: "Quarterly Report December 2024", file: "3Q202412.pdf" },
  { title: "Quarterly Report September 2024", file: "Qtr_30_Sep_2024.pdf" },
  { title: "Financial Statement 2024", file: "FS_20240930.pdf" },
  { title: "Quarterly Report March 2024", file: "3Q202403.pdf" },
  { title: "Half Yearly Report December 2023", file: "HY20312.pdf" },
  { title: "Quarterly Report September 2023", file: "FS_20230930.pdf" },
  { title: "For the year ended June 2023", file: "FS_20230630.pdf" },
  { title: "Quarterly Report March 2023", file: "FS_20230331.pdf" },
  { title: "Half Yearly Report December 2022", file: "FS_20221231.pdf" },
  { title: "Quarterly Report September 2022", file: "QuarterlyRepSep22.pdf" },
  { title: "For the year ended June 2022", file: "FS_20220630.pdf" },
  { title: "Quarterly Report March 2022", file: "FS_20220331.pdf" },
  { title: "Half Yearly Report December 2021", file: "FS_20211231.pdf" },
  { title: "Quarterly Report September 2021", file: "FS_20210930.pdf" },
  { title: "For the year ended June 2021", file: "FS_20210630.pdf" },
  { title: "Half Yearly Report December 2020", file: "HalfYearlyRepDec20.pdf" },
  { title: "Quarterly Report September 2020", file: "QuarterlyRepSep20.pdf" },
  { title: "For the year ended June 2020 - Part I", file: "FS_20200630_1.pdf" },
  { title: "For the year ended June 2020 - Part II", file: "FS_20200630_2.pdf" },
  { title: "Quarterly Report March 2020", file: "QuarterlyRepMar20.pdf" },
  { title: "Half Yearly Report December 2019", file: "FS_20191231.pdf" },
  { title: "Quarterly Report September 2019", file: "QuarterlyRepSep19.pdf" },
  { title: "For the year 2019", file: "20190630.pdf" },
  { title: "Quarterly Report March 2019", file: "QuarterlyRepMar19.pdf" },
  { title: "Half Yearly Report December 2018", file: "HalfYearlyRepDec18.pdf" },
  { title: "Quarterly Report September 2018", file: "2018_09.pdf" },
  { title: "For the year 2018", file: "2018_06.pdf" },
  { title: "Quarterly Report March 2018", file: "QuarterlyRepMar18.pdf" },
  { title: "Half Yearly Report December 2017", file: "HalfYearlyRepDec17.pdf" },
  { title: "Quarterly Report September 2017", file: "QuarterlyRepSep17.pdf" },
  { title: "For the year 2017", file: "Jun 2017.pdf" },
  { title: "Quarterly Report March 2017", file: "QuarterlyRepMar17.pdf" },
  { title: "For the year 2016", file: "Jun 2016.pdf" },
  { title: "For the year 2015", file: "Jun 2015.pdf" },
  { title: "For the year 2014", file: "Jun 2014.pdf" },
  { title: "For the year 2013", file: "Jun 2013.pdf" },
  { title: "For the year 2012", file: "Jun 2012.pdf" },
  { title: "For the year 2011", file: "Jun 2011.pdf" },
];

export const financialStatements: DocItem[] = withUrls(financialStatementRecords);

const annualReportRecords: DocRecord[] = [
  { title: "For the year ended June 2025", file: "ANNUAL_REPORT_2025.pdf" },
];

export const annualReports: DocItem[] = withUrls(annualReportRecords);

const freeFloatRecords: DocRecord[] = [
  { title: "As On 2026-03-31", file: "FreeFloat.pdf" },
  { title: "As On 2022-06-30", file: "FreeFloat_20220630.pdf" },
  { title: "As On 2020-09-30", file: "FreeFloat_20200930.pdf" },
  { title: "As On 2020-06-30", file: "FreeFloat_20200630.pdf" },
  { title: "As On 2019-03-31", file: "FreeFloat_20190331.pdf" },
  { title: "As On 2018-12-31", file: "FreeFloat_20181231.pdf" },
  { title: "As On 2018-06-30", file: "FreeFloat_20180630.pdf" },
  { title: "As On 2015-12-31", file: "2015 Free Float December 31, 2015.pdf" },
  { title: "As On 2015-09-30", file: "2015 Free Foat Sep 30, 2015.pdf" },
  { title: "As On 2015-06-30", file: "2015 Free Float Jue 2015.pdf" },
  { title: "As On 2015-03-31", file: "2015 Free Float March 2015.pdf" },
  { title: "As On 2014-12-31", file: "2014 Free Float December  2014.pdf" },
  { title: "As On 2014-09-30", file: "2014 Free Float September 2014.pdf" },
  { title: "As On 2014-06-30", file: "2014 Freet Float  June 30, 2014.pdf" },
  { title: "As On 2014-03-31", file: "2014 Free Float March 31, 2014.pdf" },
  { title: "As On 2013-12-31", file: "2013 Free float as on 2013-12-31.pdf" },
  { title: "As On 2013-09-30", file: "2013 Free float as on 2013-09-30.pdf" },
  { title: "As On 2013-06-30", file: "2013 Free Float as on 2013-06-30.pdf" },
];

export const freeFloat: DocItem[] = withUrls(freeFloatRecords);

const financialHighlightRecords: DocRecord[] = [
  { title: "2019-2023", file: "FH_2019_2023.pdf" },
  { title: "2018-2022", file: "FH_2018_2022.pdf" },
  { title: "2017-2021", file: "FH_2017_2021.pdf" },
  { title: "2016-2020", file: "FH_2016_2020.pdf" },
  { title: "2015-2019", file: "FH_2015_2019.pdf" },
  { title: "2014-2018", file: "FH_2014_2018.pdf" },
];

export const financialHighlights: DocItem[] = withUrls(financialHighlightRecords);

const financialInformationRecords: DocRecord[] = [
  { title: "June 30, 2023", file: "FI_20230630.pdf" },
  { title: "June 30, 2022", file: "FI_20220630.pdf" },
  { title: "June 30, 2021", file: "FI_20210630.pdf" },
  { title: "June 30, 2020", file: "FI_20200630.pdf" },
  { title: "June 30, 2019", file: "FI_20190630.pdf" },
  { title: "June 30, 2018", file: "FI_20180630.pdf" },
];

export const financialInformation: DocItem[] = withUrls(financialInformationRecords);
