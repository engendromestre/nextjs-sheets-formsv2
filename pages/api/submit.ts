import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import credentials from "../../credentials.json";

type SheetForm = {
  name: string;
  email: string;
  phone: string;
  current_sector: string;
  selected_sectors: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as SheetForm;

  try {
    const client = new google.auth.JWT(
      credentials.client_email,
      null || undefined,
      credentials.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    client.authorize(async function (err, tokens) {
      if (err) {
        return res.status(400).send(JSON.stringify({ error: true }));
      }
      const request = {
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Dados!A:E",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: {
          majorDimension: "ROWS",
          values: [
            [
              body.name,
              body.email,
              body.phone,
              body.current_sector,
              body.selected_sectors,
            ],
          ],
        },
      };
      const api = google.sheets({ version: "v4", auth: client });
      const response = (await api.spreadsheets.values.append(request)).data;
      return res.status(201).json({
        data: response,
      });
    });
  } catch (e: any) {
    return res.status(e.code).send({ data: e.message });
  }
}
