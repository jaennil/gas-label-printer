const SPREADSHEET_ID = '1KmjpUXv2HQXJ0B-opgWqUsgLEFOP_gz7k5zifIh7UHk';

function doGet(e) {
  const gtin = e && e.parameter && e.parameter.gtin;

  if (!gtin) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'gtin parameter required' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const result = lookupGTIN(gtin);

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function lookupGTIN(gtin) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][4]).trim() === String(gtin).trim()) {
      return {
        found:        true,
        article:      data[i][0],  // A — артикул
        name:         data[i][1],  // B — Наименование
        country:      data[i][2],  // C — Страна производства
        price:        data[i][3],  // D — цена BYN
        gtin:         data[i][4],  // E — GTIN
        manufacturer: data[i][5]   // F — изготовитель
      };
    }
  }

  return { found: false, searched: gtin };
}
