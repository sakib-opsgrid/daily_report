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

## Tabs

| Tab | Purpose |
|---|---|
| 9xxx Report | A2P response error pivot table (MNO & IPTSP) |
| 1xxx Report | SMS answer response error pivot table (MNO & IPTSP) |
| 4xx/5xx Report | HTTP error hits by source operator |
| DLR Report | Delivery report status code counts |
| Drive Backup | Download renamed CSVs for Google Drive backup |

---

## Reports

### 1. 9xxx Error Report

Tracks A2P response errors in the 9xxx range.

- Upload separate CSVs for **MNO** and **IPTSP**
- Required columns: `clientId`, `a2pResponseCode`
- Generates a pivot table: **clientId × a2pResponseCode** with Grand Total
- Output: screenshot-ready white table → **📋 Copy as Image** + **📄 Copy Text**

### 2. 1xxx Error Report

Tracks SMS answer response errors in the 1xxx range.

- Upload separate CSVs for **MNO** and **IPTSP**
- Required columns: `clientId`, `applicableSmsGateway`, `ansResponseCode`
- Generates a grouped pivot table: **clientId × Gateway × ansResponseCode** with subtotals per gateway
- Output: screenshot-ready white table → **📋 Copy as Image** + **📄 Copy Text**

### 3. 4xx / 5xx HTTP Report

Tracks HTTP error hits across all source operators (GP → ICC).

- **Optional CSV upload**: upload ELK export → source hits auto-filled
- Required columns: `ans_type`, `event.original`
- `ans_type` matched to source by name (e.g. `bl`, `bl-proxy` → BL; `rb-proxy` → RB)
- HTTP code extracted from `event.original` nginx log line
- Manual entry also available — sources expand independently
- Sources with data highlighted in blue automatically
- Click **Generate for WhatsApp** → **📄 Copy Text** (WhatsApp code block aligned)

### 4. DLR Report

Tracks delivery report status code counts.

- Upload ELK Discover CSV or enter counts manually
- Required column: `message_body` (scans for any `statusCode=XXXX` pattern)
- All status codes detected automatically — not limited to known codes
- Output: screenshot-ready table → **📋 Copy as Image** + **📄 Copy Text**

Known status codes:

| Status Code | Error Description |
|---|---|
| 1000 | Success |
| 1020 | Internal Server Error |
| 1052 | Submission record not found |
| others | Displayed as — |

### 5. Drive Backup

Download all four uploaded CSV files with standardised names for Google Drive backup.

- Shows upload status for each file (Ready / Not uploaded)
- Individual download per file or **⬇ Download All (4 files)** at once
- Direct link to the Drive backup folder

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

### 4xx / 5xx HTTP (Optional)

| Column | Description |
|---|---|
| `ans_type` | Source identifier (e.g. `bl`, `rb-proxy`, `mtn-proxy`) |
| `event.original` | Nginx log line containing HTTP status code |

Source matching is case-insensitive and partial — `bl-proxy` matches **BL**, `mtn-proxy` matches **MTN**.

### DLR

| Column | Description |
|---|---|
| `message_body` | Log body containing `statusCode=XXXX` pattern |

> All CSV exports should be from **ELK Discover**. The tool auto-detects column names and is case-insensitive.

---

## Daily Workflow

1. Open the tool in any modern browser
2. Select the report tab for the current shift window
3. Set the **monitoring window** (From / To date and time)
4. Upload the relevant ELK CSV export(s)
5. Review the generated pivot table
6. Set **Prepared By** and **Status** (Normal / Issue)
7. Click **Generate Screenshot View**
8. Click **📋 Copy as Image** → paste into WhatsApp
9. Click **📄 Copy Text** → paste as the caption message
10. Go to **Drive Backup** tab → **⬇ Download All** → upload to Google Drive

For HTTP reports: upload CSV (optional) → fill/verify source hits → **Generate for WhatsApp** → **📄 Copy Text**.

---

## Drive Backup

The **Drive Backup** tab downloads the original ELK CSV exports with standardised filenames based on each report's monitoring window **start time**.

### Naming Format

```
ErrorType_AnsType_Date_StartHour.csv
```

| Token | Description | Example |
|---|---|---|
| `ErrorType` | `X9` for 9xxx, `X1` for 1xxx | `X9` |
| `AnsType` | `M` for MNO, `I` for IPTSP | `M` |
| `Date` | From date in YYYYMMDD | `20260513` |
| `StartHour` | From time hour (HH) | `06` |

**Examples:**
```
X9_M_20260513_06.csv   ← 9xxx MNO, May 13 2026, starting 06:00
X9_I_20260513_06.csv   ← 9xxx IPTSP
X1_M_20260513_06.csv   ← 1xxx MNO
X1_I_20260513_06.csv   ← 1xxx IPTSP
```

**Drive folder structure:**
```
Report/
├── X1_Report/   ← 1xxx MNO & IPTSP
└── X9_Report/   ← 9xxx MNO & IPTSP
```

---

## Reset

The **Reset** button in the top-right corner clears all uploaded files, generated tables, form fields, and resets all monitoring windows to the current time. A confirmation prompt appears before any data is cleared.

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
- No CSV data is sent to any external server
- No cookies or tracking of any kind
- Closing the tab or clicking Reset clears all data

---

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [IBM Plex Sans / Mono](https://fonts.google.com/specimen/IBM+Plex+Sans) | Google Fonts | UI typography |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Pivot table image export |

Both loaded from CDN. An internet connection is only needed to load these on first open.

---

*© 2026 Najmaz Sakib · Infozillion Teletech Bd Ltd*
