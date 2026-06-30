---
name: links-monthly-chart
description: >
  Generates a bar chart PNG showing how many short links were created each month
  over the past 12 months by querying the Neon/PostgreSQL database. Use this
  skill whenever the user asks to visualize link creation trends, see monthly
  link stats, plot link data, chart links by month, or export a links report as
  an image. Trigger even if the user just says "show me a chart of links" or
  "how many links were created this year".
---

# Links Monthly Chart

Produce a bar chart PNG that shows the total number of short links created in
each of the past 12 calendar months.

## How to run the script

1. Make sure the Python dependencies are available (install if needed):

   ```bash
   pip install psycopg2-binary matplotlib python-dotenv
   ```

2. Run the bundled script from the **project root** (where the `.env` file lives):

   ```bash
   python .agents/skills/links-monthly-chart/scripts/plot_links.py
   ```

   Optional flags:
   | Flag | Default | Description |
   |------|---------|-------------|
   | `--output <path>` | `links_monthly_chart.png` | Where to write the PNG |
   | `--env <path>` | `.env` | Path to the env file containing `DATABASE_URL` |

   Example with custom output path:
   ```bash
   python .agents/skills/links-monthly-chart/scripts/plot_links.py --output charts/links_2025.png
   ```

3. The script will:
   - Read `DATABASE_URL` from the `.env` file
   - Query the `links` table for records created in the past 12 months
   - Group results by calendar month (filling in 0 for months with no links)
   - Render a bar chart and save it as a PNG at the specified path
   - Print the output path on success

## Database schema reference

The script queries the `links` table (defined in `db/schema.ts`):

```
links
  id         integer  PK
  slug       text
  url        text
  user_id    text
  created_at timestamp with time zone
  updated_at timestamp with time zone
```

The SQL it runs:

```sql
SELECT
  DATE_TRUNC('month', created_at AT TIME ZONE 'UTC') AS month,
  COUNT(*)::int AS link_count
FROM links
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY 1
ORDER BY 1;
```

## Expected output

A PNG file with:
- **Title**: "Links Created — Past 12 Months"
- **X-axis**: abbreviated month labels, oldest on the left (e.g. `Jul 2024`, …, `Jun 2025`)
- **Y-axis**: integer count of links, labelled "Links Created"
- Whole-number ticks on the Y-axis (no decimals)
- Count labels on top of each bar

Tell the user the absolute path to the generated PNG once the script finishes.
