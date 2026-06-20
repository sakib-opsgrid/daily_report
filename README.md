# Service Assurance — Shift Report Tool

**Infozillion Teletech Bd Ltd**  
*Built by Najmaz Sakib · Service Assurance Team*

**Version:** v2.9.0

---

A browser-based shift reporting tool that parses ELK Discover CSV exports, generates pivot tables and report cards, and produces WhatsApp-ready images — entirely in the browser, no installation or internet connection required after first load.

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
| **9xxx Report** | A2P response error pivot table — MNO & IPTSP |
| **1xxx Report** | SMS answer response error pivot table — MNO & IPTSP |
| **4xx/5xx Report** | HTTP error hits by source operator (GP → ICC) |
| **DLR Report** | Delivery report status code counts |
| **Delay Report** | Per-operator SMS response delay distribution |
| **Drive Backup** | Download renamed CSVs for Google Drive |

---

## Reports

### 9xxx Error Report

Tracks A2P response errors in the 9xxx range.

**CSV columns required:** `clientId`, `a2pResponseCode`

- Upload separate CSVs for MNO and IPTSP using the segmented toggle
- Monitoring window auto-filled from `@timestamp` column on upload
- Generates a **clientId × a2pResponseCode** pivot table with Grand Total
- **Auto status detection** — see below
- Output → **Generate Report Card** → Copy Image · Download PNG · Copy Text

---

### 1xxx Error Report

Tracks SMS answer response errors in the 1xxx range.

**CSV columns required:** `clientId`, `applicableSmsGateway`, `ansResponseCode`

- Upload separate CSVs for MNO and IPTSP using the segmented toggle
- Monitoring window auto-filled from `@timestamp` column on upload
- Generates a **clientId × Gateway × ansResponseCode** grouped pivot with subtotals
- **Auto status detection** — see below
- Output → **Generate Report Card** → Copy Image · Download PNG · Copy Text

#### Auto Status Detection (9xxx / 1xxx)

On CSV upload, the tool automatically checks each client's total error count:

| Condition | Status | Action |
|---|---|---|
| Client total **< 3,000** | **Normal** | No action needed |
| Client total **≥ 3,000** | **Issue** | Status auto-set, issue box auto-filled |

When a client exceeds the threshold, the **Issue Description** box is filled automatically with a breakdown of which error code(s) — and for 1xxx, which gateway — are responsible:

```
FelnaDigital receiving 1008 errors (95,130)
```

```
FelnaDigital receiving 1008 errors via Robi (95,130)
```

Multiple exceeding clients are listed on separate lines, highest count first. You can edit this text before generating the report card.

---

### 4xx / 5xx HTTP Report

Tracks HTTP error hits across all source operators.

**CSV columns required (optional upload):** `ans_type`, `event.original`

- CSV upload auto-fills all source hit counts — manual entry also available
- `ans_type` matched to source by token: `rt/txn` → RT, `bl-proxy` → BL, `mtn-proxy` → MTN
- HTTP code extracted from nginx log line inside `event.original`
- Monitoring window auto-filled from `@timestamp` on upload
- Sources with data highlighted automatically
- Output → **Generate for WhatsApp** → Copy Text (code-block aligned)

---

### DLR Report

Tracks delivery report status code counts.

**CSV column required:** `message_body`

- Upload CSV or enter counts manually
- All `statusCode=XXXX` values detected automatically from `message_body`
- Monitoring window auto-filled from `@timestamp` on upload
- Output → **Generate Report Card** → Copy Image · Download PNG · Copy Text

| Status Code | Description |
|---|---|
| 1000 | Success |
| 1020 | Internal Server Error |
| 1052 | Submission record not found |
| Others | Displayed as — |

---

### Delay Report

Computes per-operator SMS response delay distribution.

**CSV columns required:** `ansRequestTime`, `ansResponseTime`, `applicableSmsGateway`  
**Optional:** `@timestamp` for time range auto-detection

```
Time to get response (seconds) = ansResponseTime − ansRequestTime
(rounded to nearest second)
```

- Drag & drop or browse CSV upload
- Pivot table column: **Time to get response (s)** × operator
- Operator summary cards show total messages and **% delayed**

#### Delay Issue Flag (30% threshold)

Each operator card automatically flags when **30% or more** of its messages were delayed:

| Delayed % | Card appearance |
|---|---|
| < 30% | Normal — neutral colors |
| **≥ 30%** | **Highlighted orange** with **⚠ Inform client** flag |

This makes it immediately clear which operator(s) need a client notification, without reading the full pivot table.

- Output → **Generate Report Card** → Copy Image · Download PNG · Copy Table · Export CSV

---

### Drive Backup

Downloads uploaded CSV files with standardised filenames for Google Drive archiving.

- Individual download per file or **Download All** at once
- Filenames based on monitoring window start time
- Direct link to the backup folder

**Naming format:**

```
ErrorType_AnsType_YYYYMMDD_HH.csv
```

| Token | Values | Example |
|---|---|---|
| ErrorType | `X9` (9xxx), `X1` (1xxx) | `X9` |
| AnsType | `M` (MNO), `I` (IPTSP) | `M` |
| Date | YYYYMMDD | `20260531` |
| Hour | HH | `06` |

**Examples:**
```
X9_M_20260531_06.csv   ← 9xxx MNO, May 31 2026, 06:00
X9_I_20260531_06.csv   ← 9xxx IPTSP
X1_M_20260531_06.csv   ← 1xxx MNO
X1_I_20260531_06.csv   ← 1xxx IPTSP
```

**Drive folder structure:**
```
Report/
├── X1_Report/   ← 1xxx MNO & IPTSP
└── X9_Report/   ← 9xxx MNO & IPTSP
```

---

## Daily Workflow

```
1.  Open index.html in Chrome or Edge
2.  Select the report tab for the current shift
3.  Upload the ELK CSV export
      → Monitoring window fills automatically from @timestamp
      → 9xxx/1xxx: Status auto-set based on 3,000 threshold
      → Delay: operators ≥30% delayed flagged automatically
4.  Review the generated pivot table
5.  Enter Prepared By name (Status auto-filled where applicable)
6.  Click Generate Report Card
7.  Copy Image  → paste into WhatsApp
8.  Copy Text   → paste as caption message
9.  Go to Drive Backup → Download All → upload to Google Drive
```

For HTTP reports: upload CSV (optional) → verify source hits → Generate for WhatsApp → Copy Text.

---

## Reset

The **Reset** button in the top-right corner clears all uploaded files, generated tables, form fields, and resets monitoring windows. A confirmation prompt appears before any data is cleared.

---

## Deploy on GitHub Pages

```
1.  Create a new GitHub repository  (e.g. shift-report)
2.  Upload all four files: index.html  style.css  app.js  README.md
3.  Settings → Pages → Source: main branch / (root) → Save
4.  Live at: https://<your-username>.github.io/shift-report/
```

> Google Fonts and html2canvas are loaded from CDN — an internet connection is needed on first load. After that, the tool works fully offline.

---

## Privacy & Data

- All CSV processing happens **locally in the browser**
- No data is sent to any external server
- No cookies, no tracking, no analytics
- Closing the tab or clicking Reset clears everything

---

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [DM Sans · DM Mono · Instrument Serif](https://fonts.google.com) | Google Fonts | Typography |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Report card image capture |

---

## Browser Compatibility

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full — including clipboard image copy |
| Edge 90+ | ✅ Full |
| Firefox 90+ | ✅ Full — clipboard image opens in new tab |
| Safari 15+ | ⚠ Partial — use Download PNG instead of Copy Image |

---

*© 2026 Najmaz Sakib · Infozillion Teletech Bd Ltd — Service Assurance*
