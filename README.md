# Service Assurance — Shift Report Tool
**Infozillion Teletech Bd Ltd**  
*© 2026 Nickson Rizvi (Najmaz Sakib)*

A browser-based shift reporting tool for the Service Assurance team. Parses ELK Discover CSV exports, generates pivot tables and report cards, and produces WhatsApp-ready images — entirely in the browser, no installation required.

---

## File Structure

```
/
├── index.html   ← UI structure and markup
├── style.css    ← All styles and theming
├── app.js       ← All logic: parsing, pivot, image capture, export
└── README.md    ← This file
```

All four files must be in the **same folder**. Open `index.html` in any modern browser.

---

## Tabs

| Tab | Purpose |
|---|---|
| 9xxx Report | A2P response error pivot table (MNO & IPTSP) |
| 1xxx Report | SMS answer response error pivot table (MNO & IPTSP) |
| 4xx/5xx Report | HTTP error hits by source operator (GP → ICC) |
| DLR Report | Delivery report status code counts |
| Delay Report | Per-operator SMS response delay distribution |
| Drive Backup | Download renamed CSVs for Google Drive backup |

---

## Reports

### 1. 9xxx Error Report
- Upload separate CSVs for **MNO** and **IPTSP**
- Required columns: `clientId`, `a2pResponseCode`
- Generates: **clientId × a2pResponseCode** pivot table
- Output: **Copy Image** · **Download PNG** · **Copy Text**

### 2. 1xxx Error Report
- Upload separate CSVs for **MNO** and **IPTSP**
- Required columns: `clientId`, `applicableSmsGateway`, `ansResponseCode`
- Generates: **clientId × Gateway × ansResponseCode** grouped pivot table
- Output: **Copy Image** · **Download PNG** · **Copy Text**

### 3. 4xx / 5xx HTTP Report
- Optional CSV upload auto-fills all source hits
- Required columns: `ans_type`, `event.original`
- `ans_type` matched by token — `rt/txn` → RT, `bl-proxy` → BL, `mtn-proxy` → MTN
- Manual entry also available
- Output: formatted preview → **Copy Text** (WhatsApp code-block aligned)

### 4. DLR Report
- Upload CSV or enter counts manually
- Required column: `message_body` (scans for `statusCode=XXXX`)
- All status codes detected automatically
- Output: **Copy Image** · **Download PNG** · **Copy Text**

| Status Code | Description |
|---|---|
| 1000 | Success |
| 1020 | Internal Server Error |
| 1052 | Submission record not found |
| others | Displayed as — |

### 5. Delay Report
- Upload Kibana / ELK Discover CSV
- Required columns: `ansRequestTime`, `ansResponseTime`, `applicableSmsGateway`
- Optional: `@timestamp` for time range auto-detection
- Computes: `Delay (s) = ansResponseTime − ansRequestTime` (rounded to nearest second)
- Shows: delay distribution pivot table · operator summary cards
- Output: **Copy Image** · **Download PNG** · **Copy Table** · **Export CSV**

### 6. Drive Backup
- Downloads uploaded CSVs with standardised filenames
- Individual download or **Download All (4 files)** at once
- Direct link to the Drive backup folder

---

## CSV Format Reference

### 9xxx / 1xxx

| Report | Required Columns |
|---|---|
| 9xxx | `clientId`, `a2pResponseCode` |
| 1xxx | `clientId`, `applicableSmsGateway`, `ansResponseCode` |

### 4xx/5xx HTTP

| Column | Description |
|---|---|
| `ans_type` | Source identifier (e.g. `bl`, `rt/txn`, `mtn-proxy`) |
| `event.original` | Nginx log line containing HTTP status code |

### DLR

| Column | Description |
|---|---|
| `message_body` | Log body containing `statusCode=XXXX` |

### Delay

| Column | Notes |
|---|---|
| `ansRequestTime` | When the request was made |
| `ansResponseTime` | When the response arrived |
| `applicableSmsGateway` | Operator name |
| `@timestamp` | Optional — for time range detection |

> All column matching is **case-insensitive**. Extra columns are ignored.

---

## Daily Workflow

1. Open `index.html` in any modern browser
2. Select the report tab for the current shift
3. Set **monitoring window** (From / To)
4. Upload the ELK CSV export(s)
5. Set **Prepared By** and **Status**
6. Click **Generate Report Card**
7. **Copy Image** → paste into WhatsApp
8. **Copy Text** → paste as caption
9. Go to **Drive Backup** → **Download All** → upload to Google Drive

---

## Drive Backup — Naming Format

```
ErrorType_AnsType_Date_StartHour.csv
```

| Token | Description | Example |
|---|---|---|
| `ErrorType` | `X9` for 9xxx, `X1` for 1xxx | `X9` |
| `AnsType` | `M` for MNO, `I` for IPTSP | `M` |
| `Date` | From date YYYYMMDD | `20260513` |
| `StartHour` | From time hour HH | `06` |

**Examples:**
```
X9_M_20260513_06.csv
X9_I_20260513_06.csv
X1_M_20260513_06.csv
X1_I_20260513_06.csv
```

**Drive folder structure:**
```
Report/
├── X1_Report/   ← 1xxx MNO & IPTSP
└── X9_Report/   ← 9xxx MNO & IPTSP
```

---

## Reset

The **Reset** button (top-right) clears all uploaded files, generated tables, form fields, and resets monitoring windows. A confirmation prompt appears first.

---

## Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `shift-report`)
2. Upload all four files: `index.html`, `style.css`, `app.js`, `README.md`
3. Go to **Settings → Pages**
4. Source: `main` branch → `/ (root)` → **Save**
5. Live at `https://<your-username>.github.io/shift-report/`

---

## Privacy & Data

- All processing is **local in the browser**
- No data is sent to any server
- No cookies, no tracking
- Reset or close tab to clear all data

---

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [DM Sans / DM Mono / Instrument Serif](https://fonts.google.com) | Google Fonts | Typography |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Report card image capture |

Both loaded from CDN. Internet only needed on first load to cache fonts and html2canvas.

---

*© 2026 Nickson Rizvi (Najmaz Sakib) · Infozillion Teletech Bd Ltd — Service Assurance*
