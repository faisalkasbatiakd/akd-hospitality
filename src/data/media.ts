/* ---------------------------------------------------------------------------
 * EDITING THIS FILE CHANGES NOTHING ON THE WEBSITE.
 *
 * It fills a brand-new, empty database once. The live site reads this content
 * from the database, and the seed refuses to run against a database that
 * already has rows - so a change here is never picked up by a deploy.
 *
 * To change what visitors see, use the dashboard:
 *   https://www.akdhospitality.com/admin
 * ------------------------------------------------------------------------- */

import { docUrl } from "@/lib/site";
import type { DocItem } from "@/data/investors";

type DocRecord = { title: string; file: string };

const withUrls = (records: readonly DocRecord[]): DocItem[] =>
  records.map((r) => ({ title: r.title, href: docUrl(r.file) }));

/**
 * Notices of Annual General Meeting.
 *
 * Titles are the meeting date, written out. The file names the Company uses
 * encode the same date, and every notice that carries a text layer confirms it
 * exactly: 28 October 2025, 28 October 2024, 22 October 2020 and 23 October
 * 2018 were read from the notices themselves, and the 2023 and 2017 meetings
 * are confirmed by the following year's notice.
 */
const agmRecords: DocRecord[] = [
  { title: "28 October 2025", file: "AKD_HL_AGM_Notice_2025.pdf" },
  { title: "28 October 2024", file: "AGM_20241028.pdf" },
  { title: "25 October 2023 - Corrigendum", file: "AGM_20231025_Corrigendum.pdf" },
  { title: "25 October 2023", file: "AGM_20231025.pdf" },
  { title: "27 October 2022", file: "AGM_20221027.pdf" },
  { title: "21 October 2021", file: "AGM_20211021.pdf" },
  { title: "22 October 2020", file: "AGM_20201022.pdf" },
  { title: "5 October 2019", file: "AGM_20191005.pdf" },
  { title: "23 October 2018", file: "AGM_20181023.pdf" },
  { title: "23 October 2017", file: "AGM_20171023.pdf" },
  { title: "22 October 2016", file: "AGM_20161022.pdf" },
];

export const agmNotices: DocItem[] = withUrls(agmRecords);

/**
 * Notices of Extraordinary General Meeting.
 *
 * Both are labelled by the date of the meeting they convene, read from the
 * notice itself rather than from the file name:
 *
 *  - EOGM_20210405.pdf is dated 5 April 2021 and convenes the meeting of
 *    Tuesday 27 April 2021.
 *  - EOGM_20200201_1.pdf convenes the meeting of Monday 1 February 2021. The
 *    Company's file name says 2020, but the notice itself reads "Monday 1st
 *    February, 2021", and 1 February 2021 was a Monday while 1 February 2020
 *    was a Saturday. The notice is followed here.
 */
const eogmRecords: DocRecord[] = [
  { title: "27 April 2021", file: "EOGM_20210405.pdf" },
  { title: "1 February 2021", file: "EOGM_20200201_1.pdf" },
];

export const eogmNotices: DocItem[] = withUrls(eogmRecords);

/** Special resolutions certified to the Pakistan Stock Exchange. */
const specialResolutionRecords: DocRecord[] = [
  { title: "Adopted at EOGM, 27 April 2021", file: "SpecialResolution_20210427.pdf" },
  { title: "Adopted at EOGM, 1 February 2021", file: "SpecialResolution_20210201.pdf" },
];

export const specialResolutions: DocItem[] = withUrls(specialResolutionRecords);

/**
 * Corporate Briefing Session materials.
 *
 * The 2025 filing was read directly: intimation to the Exchange dated
 * 21 November 2025 for a session held 26 November 2025. The 2023 and 2024
 * filings are scans, so they carry the date in the Company's own file name. The
 * deck the Company labels only "2022" is dated 11/8/2022 on its title slide.
 */
const briefingRecords: DocRecord[] = [
  { title: "FY2025 results - filed 21 November 2025", file: "Corporate_Briefing_Session_21_11_2025.pdf" },
  { title: "FY2024 results - 27 November 2024", file: "Corporate_Briefing_Session_27_11_2024.pdf" },
  { title: "FY2023 results - 23 November 2023", file: "CBS_20231123.pdf" },
  { title: "FY2022 results", file: "CBS.pdf" },
];

export const corporateBriefings: DocItem[] = withUrls(briefingRecords);

/**
 * Forms shareholders need.
 *
 * The ballot paper was read directly: it is for the poll at the Annual General
 * Meeting of Monday 28 October 2024.
 */
const shareholderFormRecords: DocRecord[] = [
  { title: "Ballot paper for postal voting - AGM 28 October 2024", file: "BallotPaper2024.pdf" },
  { title: "Form of proxy - English", file: "FormOfProxy_English.pdf" },
  { title: "Form of proxy - Urdu", file: "FormOfProxy_Urdu.pdf" },
  { title: "Circulation of annual report request form", file: "CirculationOfAnnualReportForm.pdf" },
];

export const shareholderForms: DocItem[] = withUrls(shareholderFormRecords);
