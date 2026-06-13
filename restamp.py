#!/usr/bin/env python3
"""
restamp.py — set the LAST_DEPLOY stamp in index.html to the CURRENT time in
America/Denver, derived from an EXTERNAL UTC source (GitHub's HTTP Date header),
converted with the real tz database (zoneinfo). Never trusts a bare local clock,
never does manual offset math (that's what produced the Jun 6→"Jun 7 · 7:49 AM"
12-hour + date-rollover bug: 7:49 PM Jun 6 MDT == 1:49 AM Jun 7 UTC).

Usage:
  python3 restamp.py            # restamp index.html in this directory + verify
  python3 restamp.py --selftest # run conversion unit tests only (no edits)

The deploy MUST abort if this script exits non-zero.
"""
import re, sys, urllib.request
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

DEN = ZoneInfo("America/Denver")
TOL_MIN = 5  # assertion tolerance

def fmt(dt_den):
    # "Jun 6 · 7:49 PM" — no zero-padding on day/hour
    return f"{dt_den.strftime('%b')} {dt_den.day} · {dt_den.strftime('%I').lstrip('0')}:{dt_den.strftime('%M')} {dt_den.strftime('%p')}"

def external_utc(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent":"hg-restamp"})
    with urllib.request.urlopen(req, timeout=15) as r:
        d = r.headers.get("Date")
    dt = parsedate_to_datetime(d)
    return dt.astimezone(timezone.utc)

def selftest():
    cases = [
        # THE bug case: evening MDT crossing the UTC date line
        ("2026-06-07T01:49:00+00:00", "Jun 6 · 7:49 PM"),
        ("2026-06-07T01:56:00+00:00", "Jun 6 · 7:56 PM"),
        # morning MDT, same UTC date
        ("2026-06-07T13:49:00+00:00", "Jun 7 · 7:49 AM"),
        # noon / midnight 12-hour edges
        ("2026-06-07T18:00:00+00:00", "Jun 7 · 12:00 PM"),
        ("2026-06-07T06:00:00+00:00", "Jun 7 · 12:00 AM"),
        # winter = MST (UTC-7): 2 AM UTC Jan 5 -> 7 PM Jan 4
        ("2026-01-05T02:00:00+00:00", "Jan 4 · 7:00 PM"),
        # DST spring-forward day (Mar 8 2026): 8:30 UTC = 1:30 AM MST (pre-jump)
        ("2026-03-08T08:30:00+00:00", "Mar 8 · 1:30 AM"),
        ("2026-03-08T09:30:00+00:00", "Mar 8 · 3:30 AM"),
    ]
    for iso, want in cases:
        got = fmt(datetime.fromisoformat(iso).astimezone(DEN))
        assert got == want, f"SELFTEST FAIL: {iso} -> {got!r}, want {want!r}"
    print(f"selftest OK — {len(cases)} cases (incl. the evening-MDT/UTC-rollover bug case)")

def main():
    if "--selftest" in sys.argv:
        selftest(); return
    selftest()  # always prove the conversion before touching the file
    utc = external_utc("https://api.github.com")
    den = utc.astimezone(DEN)
    stamp = fmt(den)
    src = open("index.html", encoding="utf-8").read()
    new, n = re.subn(r'const LAST_DEPLOY = "[^"]*";',
                     f'const LAST_DEPLOY = "{stamp}";', src)
    assert n == 1, f"expected exactly 1 LAST_DEPLOY line, found {n}"
    open("index.html", "w", encoding="utf-8").write(new)
    # ── independent verification: second external source, fresh fetch ──
    utc2 = external_utc("https://github.com")
    den2 = utc2.astimezone(DEN)
    m = re.search(r'const LAST_DEPLOY = "([^"]*)"', open("index.html", encoding="utf-8").read())
    written = m.group(1)
    parsed = datetime.strptime(f"{written} {den2.year}", "%b %d · %I:%M %p %Y").replace(tzinfo=DEN)
    skew = abs((parsed - den2).total_seconds())
    assert skew <= TOL_MIN*60, f"STAMP ASSERTION FAILED: written {written!r} vs independent Denver now {fmt(den2)!r} (skew {skew:.0f}s > {TOL_MIN} min) — DO NOT DEPLOY"
    print(f"stamped: {written!r}  | independent Denver check: {fmt(den2)!r}  | skew {skew:.0f}s  ✓")

if __name__ == "__main__":
    main()
