# Shift Report Tool
**Infozillion Teletech Bd Ltd — Service Assurance**

A browser-based reporting tool for the Service Assurance team. Parses ELK Discover CSV exports, generates pivot tables, and produces WhatsApp-ready reports — entirely in the browser with no server or installation required.

---

## File Structure

```
/
├── index.html      ← UI structure and markup
├── style.css       ← All styles and theming
├── app.js          ← CSV parsing, pivot logic, report generation
└── README.md       ← This file
```

---

## Reports

### 1. 9xxx Error Report

Tracks A2P response errors in the 9xxx range.

- Upload separate CSVs for **MNO** and **IPTSP**
- Required columns: `clientId`, `a2pResponseCode`
- Generates a pivot table: **clientId × a2pResponseCode** with Grand Total
- Output: screenshot-ready white table + image copy to clipboard

### 2. 1xxx Error Report

Tracks SMS answer response errors in the 1xxx range.

- Upload separate CSVs for **MNO** and **IPTSP**
- Required columns: `clientId`, `applicableSmsGateway`, `ansResponseCode`
- Generates a grouped pivot table: **clientId × Gateway × ansResponseCode** with subtotals per gateway
- Output: screenshot-ready white table + image copy to clipboard

### 3. 4xx / 5xx HTTP Report

Tracks HTTP error hits across all source operators.

- Manual entry per source (GP → ICC), broken down by HTTP code
- Codes tracked: `400 401 402 403 404 500 501 502 503 504`
- Output: live WhatsApp preview + plain text copy

### 4. DLR Report

Tracks delivery report status code counts.

- Upload ELK Discover CSV or enter counts manually
- Required column: `message_body` (must contain `statusCode=1000`, `statusCode=1020`, or `statusCode=1052`)
- Output: live WhatsApp preview + plain text copy

---

## CSV Format Reference

### 9xxx (MNO / IPTSP)

| Column | Description |
|---|---|
| `clientId` | Client identifier |
| `a2pResponseCode` | A2P response code (9xxx range) |

### 1xxx (MNO / IPTSP)

| Column | Description |
|---|---|
| `clientId` | Client identifier |
| `applicableSmsGateway` | Gateway/operator name |
| `ansResponseCode` | Answer response code (1xxx range) |

### DLR

| Column | Description |
|---|---|
| `message_body` | Log body containing `statusCode=1000`, `statusCode=1020`, or `statusCode=1052` |

> All CSV exports should be from **ELK Discover**. The tool auto-detects column names and is case-insensitive.

---

## Daily Workflow

1. Open the tool in any modern browser
2. Select the report tab for the current shift window
3. Set the **monitoring window** (From / To date and time)
4. Upload the relevant ELK CSV export(s)
5. Review the generated pivot table
6. Set **Prepared By** and **Status** (Normal / Issue)
7. Click **Generate Screenshot View** → **Copy as Image**
8. Paste directly into the WhatsApp shift group

For HTTP and DLR reports, use **Copy to Clipboard** and paste as text.

---

## Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `shift-report`)
2. Upload all four files: `index.html`, `style.css`, `app.js`, `README.md`
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch → `/ (root)` → **Save**
5. Live at:
   ```
   https://<your-username>.github.io/shift-report/
   ```

---

## Privacy & Data

- All data is processed **locally in the browser**
- No CSV data is uploaded to any external server
- No cookies or tracking of any kind
- Closing the tab clears all data

---

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [IBM Plex Sans / Mono](https://fonts.google.com/specimen/IBM+Plex+Sans) | Google Fonts | UI typography |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Pivot table image export |

Both are loaded from CDN. The tool requires an internet connection only to load these two resources on first open; after that it works offline.

---

*© 2026 Najmaz Sakib · Infozillion Teletech Bd Ltd*
