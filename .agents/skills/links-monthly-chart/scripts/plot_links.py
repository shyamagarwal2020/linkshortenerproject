#!/usr/bin/env python3
"""
plot_links.py
-------------
Queries the links table for the past 12 months and generates a bar chart PNG.

Usage (from project root):
    python .agents/skills/links-monthly-chart/scripts/plot_links.py
    python .agents/skills/links-monthly-chart/scripts/plot_links.py --output charts/links.png
    python .agents/skills/links-monthly-chart/scripts/plot_links.py --env /path/to/.env
"""

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_env(env_path: str) -> str:
    """Load DATABASE_URL from a .env file or the process environment."""
    # Try python-dotenv first (best experience)
    try:
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=env_path, override=False)
    except ImportError:
        # Fallback: manual parse for simple KEY=VALUE lines
        env_file = Path(env_path)
        if env_file.is_file():
            with env_file.open() as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("#") or "=" not in line:
                        continue
                    key, _, value = line.partition("=")
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    if key and key not in os.environ:
                        os.environ[key] = value

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        sys.exit(
            f"ERROR: DATABASE_URL not found in environment or {env_path!r}.\n"
            "Make sure the .env file exists and contains a DATABASE_URL entry."
        )
    return db_url


def query_monthly_counts(db_url: str) -> dict:
    """
    Return a dict mapping (year, month) tuples to link counts for the past
    12 calendar months (inclusive of the current month).
    """
    try:
        import psycopg2
    except ImportError:
        sys.exit(
            "ERROR: psycopg2 is not installed.\n"
            "Run: pip install psycopg2-binary"
        )

    sql = """
        SELECT
            DATE_TRUNC('month', created_at AT TIME ZONE 'UTC') AS month,
            COUNT(*)::int AS link_count
        FROM links
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY 1
        ORDER BY 1;
    """

    conn = None
    try:
        conn = psycopg2.connect(db_url)
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    except Exception as exc:
        sys.exit(f"ERROR: Database query failed: {exc}")
    finally:
        if conn:
            conn.close()

    return {(row[0].year, row[0].month): row[1] for row in rows}


def build_month_sequence() -> list:
    """
    Return a list of (year, month) tuples for the 12 months ending this month,
    ordered oldest → newest.
    """
    now = datetime.now(tz=timezone.utc)
    months = []
    for offset in range(11, -1, -1):
        # Walk backwards from 11 months ago to now
        month = now.month - offset
        year = now.year
        while month < 1:
            month += 12
            year -= 1
        months.append((year, month))
    return months


def plot(months: list, counts: list, output_path: str) -> None:
    """Render and save the bar chart."""
    try:
        import matplotlib
        matplotlib.use("Agg")  # non-interactive backend — no display needed
        import matplotlib.pyplot as plt
        import matplotlib.ticker as ticker
    except ImportError:
        sys.exit(
            "ERROR: matplotlib is not installed.\n"
            "Run: pip install matplotlib"
        )

    labels = [datetime(y, m, 1).strftime("%b %Y") for y, m in months]

    fig, ax = plt.subplots(figsize=(14, 6))
    bars = ax.bar(labels, counts, color="#4f86f7", edgecolor="white", width=0.6)

    # Label each bar with its count
    for bar, count in zip(bars, counts):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + max(counts) * 0.01,
            str(count),
            ha="center",
            va="bottom",
            fontsize=9,
            fontweight="bold",
        )

    ax.set_title("Links Created — Past 12 Months", fontsize=15, fontweight="bold", pad=14)
    ax.set_xlabel("Month", fontsize=11, labelpad=8)
    ax.set_ylabel("Links Created", fontsize=11, labelpad=8)

    # Force integer ticks on y-axis
    ax.yaxis.set_major_locator(ticker.MaxNLocator(integer=True))

    # Add a little headroom above the tallest bar so labels don't clip
    top = max(counts) if max(counts) > 0 else 1
    ax.set_ylim(0, top * 1.15)

    ax.tick_params(axis="x", rotation=35)
    fig.tight_layout()

    # Ensure the output directory exists
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)

    fig.savefig(out, dpi=150, bbox_inches="tight")
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a bar chart of links created per month for the past 12 months."
    )
    parser.add_argument(
        "--output",
        default="links_monthly_chart.png",
        help="Output PNG path (default: links_monthly_chart.png)",
    )
    parser.add_argument(
        "--env",
        default=".env",
        help="Path to the .env file containing DATABASE_URL (default: .env)",
    )
    args = parser.parse_args()

    db_url = load_env(args.env)

    print("Querying database…")
    db_counts = query_monthly_counts(db_url)

    months = build_month_sequence()
    counts = [db_counts.get((y, m), 0) for y, m in months]

    print("Generating chart…")
    plot(months, counts, args.output)

    abs_path = Path(args.output).resolve()
    print(f"Chart saved to: {abs_path}")


if __name__ == "__main__":
    main()
