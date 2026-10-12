"""Turn a slice of a .dc.html design into a generated TSX markup module + CSS.

Usage from a per-page script:
    from build_dc import build
    build(src, ranges=[(46, 227)], prefix="inf-h", out_tsx=..., out_css=..., subs=[...], drop=[...], extra_css="...")
"""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from dc2jsx import Conv  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DOCS = os.path.join(ROOT, "docs", "project", "v3.6") + "/"

# Prototype links → real routes on the main site.
FILE_ROUTES = {
    "DMatek%20Infrastructure%20Hero%20shared.dc.html": "/infrastructure",
    "DMatek%20Cloud%20Home%20v3.1%20shared.dc.html": "/cloud",
    "DMatek%20IleMesh.dc.html": "/ilemesh",
    "DMatek%20Assurance.dc.html": "/assurance",
}


def rewrite_links(html, src_name):
    from urllib.parse import unquote, quote

    def contact(m):
        q = unquote(m.group(1).replace("&amp;", "&"))
        params = dict(p.split("=", 1) for p in q.split("&") if "=" in p)
        out = []
        if params.get("msg"):
            out.append("message=" + quote(params["msg"], safe=""))
        out.append("src=" + src_name)
        return 'href="/contact?' + "&amp;".join(out) + '"'

    html = re.sub(r'href="Dmatek%20Website%20v3\.6\.dc\.html#/contact\?([^"]*)"', contact, html)
    html = re.sub(r'href="Dmatek%20Website%20v3\.6\.dc\.html#/contact"', 'href="/contact?src=' + src_name + '"', html)
    html = re.sub(r'href="Dmatek%20Website%20v3\.6\.dc\.html#/?([^"]*)"', lambda m: 'href="/' + m.group(1) + '"', html)
    html = re.sub(r'href="Dmatek%20Website%20v3\.6\.dc\.html"', 'href="/"', html)
    for f, r in FILE_ROUTES.items():
        html = html.replace('href="' + f + '"', 'href="' + r + '"')
    html = re.sub(r'href="DFoundry%20Hero%20v2\.dc\.html[^"]*"', 'href="{{ foundryUrl }}"', html)
    html = re.sub(r'href="DSource%20v11\.1\.dc\.html[^"]*"', 'href="{{ sourceUrl }}"', html)
    return html


def build(src, ranges, prefix, out_tsx, out_css, subs=(), drop=(), extra_css="", src_name="page", header="", resubs=()):
    lines = open(DOCS + src, encoding="utf-8").read().split("\n")
    html = "\n".join("\n".join(lines[a - 1:b]) for a, b in ranges)
    for pat in drop:
        html, n = re.subn(pat, "", html, flags=re.S)
        if n == 0:
            raise SystemExit(f"drop pattern matched nothing: {pat[:80]}")
    for a, b in subs:
        if a not in html:
            raise SystemExit(f"sub not found: {a[:80]}")
        html = html.replace(a, b)
    for pat, rep in resubs:
        html, n = re.subn(pat, rep, html, flags=re.S)
        if n == 0:
            raise SystemExit(f"resub matched nothing: {pat[:80]}")
    html = rewrite_links(html, src_name)
    # Accessibility (WCAG AA 4.5:1 for small text): the prototypes' small
    # dark-gold and grey labels on cream, and dim grey notes on forest, are
    # darkened/lightened to the nearest passing shade of the same hue.
    html = html.replace("#B08620", "#86660F").replace("#6A7A74", "#56645E").replace("#6F8A80", "#8FA69C")
    html = html.replace("font-size:clamp(40px,4vw,56px);font-weight:800;letter-spacing:-0.04em;color:#D4A637", "font-size:clamp(40px,4vw,56px);font-weight:800;letter-spacing:-0.04em;color:#86660F")
    # next/font serves hashed family names; point the design's literals at them.
    html = html.replace("'Manrope'", "var(--font-manrope),'Manrope'")
    html = html.replace("'JetBrains Mono'", "var(--font-jbm),'JetBrains Mono'")
    left = re.findall(r'href="[^"]*\.dc\.html[^"]*"', html)
    if left:
        raise SystemExit(f"unrewritten prototype links: {left}")
    c = Conv(prefix)
    jsx = c.convert(html)
    # React wants boolean `open` without the string form, and lowercase SVG attrs fixed.
    jsx = jsx.replace("open={v.true}", "open")
    tsx = (
        "/* eslint-disable @typescript-eslint/ban-ts-comment */\n// @ts-nocheck\n"
        f"// Generated from docs/project/v3.6/{src} by site/scripts/design-port (see its README).\n"
        "// Markup only: behaviour lives in the matching client component.\n"
        + header
        + "import React from \"react\";\nimport Link from \"next/link\";\n\n"
        "export default function Markup({ v }) {\n  return (\n    <>\n"
        + jsx
        + "\n    </>\n  );\n}\n"
    )
    open(out_tsx, "w", encoding="utf-8").write(tsx)
    open(out_css, "w", encoding="utf-8").write(
        f"/* Generated from docs/project/v3.6/{src}: hover/focus states and page styles. */\n"
        + extra_css.strip() + "\n" + c.css_text() + "\n"
    )
    print(out_tsx, len(jsx), "chars,", len(c.css), "hover rules")
