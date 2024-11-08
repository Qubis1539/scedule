import { sheets } from "../config.js";
import { google, sheets_v4 } from "googleapis";

export class Sheets {
  private config: typeof sheets;
  private sheets: sheets_v4.Resource$Spreadsheets;

  constructor(config: typeof sheets) {
    this.config = { ...config };
    this.sheets = google.sheets({ version: "v4" }).spreadsheets;
  }

  async getUsersData(): Promise<user[]> {
    return new Promise((resolve, reject) => {
      this.sheets.values.get(
        {
          auth: this.config.api_key,
          spreadsheetId: this.config.sheets_id,
          range: this.config.data_range,
        },
        (err, response) => {
          if (err) {
            reject(new Error(err.message));
            return;
          }

          if (!response) {
            reject(new Error("requested_sheet_is_not_exist"));
            return;
          }

          if (!response.data.values) {
            reject(new Error("requested_sheet_is_empty"));
            return;
          }

          const usersData = response.data.values.reduce<user[]>((acc, el) => {
            if (el[0]) {
              acc.push({
                name: el[0],
                day: el[1],
                month: el[2],
              });
            }
            return acc;
          }, []);
          resolve(usersData);
        }
      );
    });
  }
}
