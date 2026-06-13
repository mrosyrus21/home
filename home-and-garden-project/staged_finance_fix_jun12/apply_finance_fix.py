#!/usr/bin/env python3
# STAGED Jun 12 2026 (Financial Stability chat) — fix superseded Xfinity leverage line in data.js FINANCE block.
# AT&T Internet Air $47 (5G wireless, weak lever) → CenturyLink Simply Unlimited ~$55 (real published wired price).
# Source of truth: Financial Stability/Xfinity Call Script.html + FINANCE_STATE.md §3 (both already say CenturyLink).
# Usage: python3 apply_finance_fix.py /path/to/clean-clone/data.js
# Exits 1 unless every replacement matches EXACTLY ONCE. Run node --check data.js after.

import sys

REPLACEMENTS = [
    # R1 — xfinity_call task note (TASKS, ~line 57)
    ("Leverage: AT&T Internet Air is only $47/mo and there's no fiber at your address — you're a flight risk they'll want to keep.",
     "Leverage: CenturyLink Simply Unlimited is ~$55/mo at your address (real published price — you're NOT switching, it's pure negotiation). You're a flight risk they'll want to keep."),
    # R2 — ft_xfinity label (FINANCE.todosSeed, ~line 572)
    ("(AT&T Internet Air is $47)",
     "(CenturyLink is ~$55)"),
    # R3 — mon_xfinity note (FINANCE.mondays, ~line 613)
    ("Leverage: AT&T Internet Air is $47/mo at your address.",
     "Leverage: CenturyLink Simply Unlimited is ~$55/mo at your address — you're not switching, it's the price-match lever."),
    # R4 — advice card (FINANCE.advice, ~line 640; note the escaped \" quotes inside the JS string)
    ('\\"AT&T Internet Air is $47 at my address.\\" That is the leverage line.',
     '\\"CenturyLink Simply Unlimited is $55 a month at my address.\\" That is the leverage line.'),
    # R5 — xfinity_call steps[] script line (TASKS, same ~line 57 object)
    ("Drop the leverage: 'AT&T Internet Air is $47/mo. I'd rather stay for the lower latency, but not at this price.'",
     "Drop the leverage: 'CenturyLink Simply Unlimited is $55 a month at my address. I'd rather stay for the lower latency, but not at this price.'"),
]

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "data.js"
    src = open(path, encoding="utf-8").read()
    for i, (old, new) in enumerate(REPLACEMENTS, 1):
        n = src.count(old)
        if n != 1:
            print(f"FAIL R{i}: anchor found {n} times (need exactly 1). Aborting, file untouched.")
            sys.exit(1)
        src = src.replace(old, new)
    if "AT&T Internet Air" in src:
        print("FAIL: an 'AT&T Internet Air' mention still remains. Aborting, file untouched.")
        sys.exit(1)
    open(path, "w", encoding="utf-8", newline="").write(src)
    print("OK: 4/4 replacements applied. Now run: node --check data.js")

if __name__ == "__main__":
    main()
