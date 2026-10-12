"""Convert a .dc.html markup fragment into JSX for a React class component.

- {{ expr }} bindings become {v.expr} (top-level) or {item.expr} (loop vars)
- <sc-for list as> -> .map, <sc-if value> -> conditional
- style="" -> style objects (template literals when bound)
- style-hover / style-focus -> generated classes, collected into CSS
- kebab/SVG attributes -> React names
"""
import re
import sys
import json

VOID = {"img", "input", "br", "meta", "link", "source", "hr", "area", "col", "wbr"}
ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly",
    "maxlength": "maxLength", "minlength": "minLength", "colspan": "colSpan", "rowspan": "rowSpan",
    "autocomplete": "autoComplete", "autofocus": "autoFocus", "crossorigin": "crossOrigin",
    "srcset": "srcSet", "xlink:href": "xlinkHref", "xml:space": "xmlSpace", "contenteditable": "contentEditable",
    "spellcheck": "spellCheck", "enterkeyhint": "enterKeyHint", "inputmode": "inputMode", "playsinline": "playsInline",
    "autoplay": "autoPlay", "novalidate": "noValidate", "datetime": "dateTime", "frameborder": "frameBorder",
    "allowfullscreen": "allowFullScreen", "accept-charset": "acceptCharset", "http-equiv": "httpEquiv",
}
KEEP = re.compile(r"^(data-|aria-)")

def camel(s):
    return re.sub(r"-([a-z])", lambda m: m.group(1).upper(), s)

TOKEN = re.compile(r"<!--.*?-->|<(/?)([a-zA-Z][\w:-]*)((?:\s+[^\s=/>]+(?:\s*=\s*\"[^\"]*\")?)*)\s*(/?)>|([^<]+)", re.S)
ATTR = re.compile(r"([^\s=/>]+)(?:\s*=\s*\"([^\"]*)\")?")
BIND = re.compile(r"\{\{\s*(.*?)\s*\}\}")

class Conv:
    def __init__(self, prefix):
        self.prefix = prefix
        self.css = {}
        self.scope = []  # loop variable names

    def expr(self, e):
        e = e.strip()
        m = re.match(r"([A-Za-z_$][\w$]*)", e)
        if m and m.group(1) in self.scope:
            return e
        if m and m.group(1) in ("true", "false", "null", "undefined"):
            return e
        return "v." + e

    def text(self, t):
        out = []
        pos = 0
        for m in BIND.finditer(t):
            out.append(self.esc(t[pos:m.start()]))
            out.append("{" + self.expr(m.group(1)) + "}")
            pos = m.end()
        out.append(self.esc(t[pos:]))
        return "".join(out)

    @staticmethod
    def esc(s):
        return s.replace("{", "{'{'}").replace("}", "{'}'}").replace(">", "&gt;").replace("'", "&apos;").replace('"', "&quot;")

    def tpl(self, s):
        """Attribute value -> JSX expression (string literal or template)."""
        if not BIND.search(s):
            return json.dumps(s, ensure_ascii=False)
        whole = BIND.fullmatch(s.strip())
        if whole:
            return self.expr(whole.group(1))
        parts = []
        pos = 0
        for m in BIND.finditer(s):
            parts.append(s[pos:m.start()].replace("`", "\\`").replace("${", "\\${"))
            parts.append("${" + self.expr(m.group(1)) + "}")
            pos = m.end()
        parts.append(s[pos:].replace("`", "\\`").replace("${", "\\${"))
        return "`" + "".join(parts) + "`"

    def style(self, s):
        props = []
        for decl in split_decls(s):
            if ":" not in decl:
                continue
            k, val = decl.split(":", 1)
            k = k.strip()
            val = val.strip()
            if not k:
                continue
            key = k if k.startswith("--") else camel(k if not k.startswith("-webkit-") else "Webkit" + k[len("-webkit"):])
            if k.startswith("-webkit-"):
                key = "Webkit" + camel(k[len("-webkit"):])[0:]
            props.append(f"{json.dumps(key)}: {self.tpl(val)}")
        return "{{" + ", ".join(props) + "}}"

    def hover(self, kind, s):
        body = ";".join(d.strip() + " !important" for d in split_decls(s) if d.strip())
        key = (kind, body)
        if key not in self.css:
            self.css[key] = f"{self.prefix}{len(self.css)}"
        return self.css[key]

    def attrs(self, tag, raw):
        out = []
        classes = []
        for m in ATTR.finditer(raw):
            name, val = m.group(1), m.group(2)
            if name in ("style-hover", "style-focus", "style-active"):
                if val and not BIND.search(val):
                    classes.append(self.hover(name.split("-")[1], val))
                continue
            if name.startswith("hint-"):
                continue
            if val is None:
                out.append(f"{ATTR_MAP.get(name, name)}={{true}}")
                continue
            if name == "style":
                out.append("style=" + self.style(val))
                continue
            if name == "class":
                classes.append(val)
                continue
            if re.match(r"^on[A-Z]", name):
                out.append(f"{name}={{{self.tpl(val)}}}")
                continue
            if KEEP.match(name):
                jn = name
            elif name in ATTR_MAP:
                jn = ATTR_MAP[name]
            elif "-" in name or ":" in name:
                jn = camel(name.replace(":", "-"))
            else:
                jn = name
            if jn == "value" and tag in ("select", "textarea", "input"):
                pass
            t = self.tpl(val)
            out.append(f"{jn}={{{t}}}" if not t.startswith('"') else f"{jn}={t}")
        if classes:
            out.append("className=" + json.dumps(" ".join(classes)))
        return (" " + " ".join(out)) if out else ""

    def convert(self, html):
        out = []
        stack = []
        for m in TOKEN.finditer(html):
            whole = m.group(0)
            if whole.startswith("<!--"):
                continue
            if m.group(5) is not None:
                t = m.group(5)
                if stack and stack[-1][0] in ("style", "script"):
                    out.append(t)
                    continue
                if t.strip():
                    out.append(self.text(t))
                elif "\n" in t:
                    out.append("\n")
                continue
            closing, tag, raw, selfc = m.group(1), m.group(2), m.group(3) or "", m.group(4)
            if closing:
                if not stack:
                    continue
                kind = stack.pop()
                if kind[0] == "sc-for":
                    self.scope.pop()
                    out.append("</React.Fragment>))}")
                elif kind[0] == "sc-if":
                    out.append("</>) : null}")
                else:
                    out.append(f"</{kind[0]}>")
                continue
            attrs = dict((a.group(1), a.group(2)) for a in ATTR.finditer(raw))
            if tag == "sc-for":
                lst = BIND.fullmatch(attrs["list"].strip()).group(1)
                var = attrs["as"]
                lexpr = self.expr(lst)
                self.scope.append(var)
                out.append(f"{{({lexpr} || []).map(({var}, {var}_i) => (<React.Fragment key={{{var}_i}}>")
                stack.append(("sc-for",))
                continue
            if tag == "sc-if":
                cond = BIND.fullmatch(attrs["value"].strip()).group(1)
                out.append(f"{{({self.expr(cond)}) ? (<>")
                stack.append(("sc-if",))
                continue
            a = self.attrs(tag, raw)
            # Internal page links navigate client-side.
            if tag == "a" and (attrs.get("href") or "").startswith("/"):
                tag = "Link"
            if tag in VOID or selfc:
                out.append(f"<{tag}{a} />")
            else:
                out.append(f"<{tag}{a}>")
                stack.append((tag,))
        return "".join(out)

    def css_text(self):
        rules = []
        for (kind, body), cls in self.css.items():
            sel = {"hover": f".{cls}:hover", "focus": f".{cls}:focus", "active": f".{cls}:active"}[kind]
            rules.append(f"{sel}{{{body}}}")
        return "\n".join(rules)


def split_decls(s):
    """Split CSS declarations on ';' outside parentheses/quotes."""
    out, depth, cur, q = [], 0, "", None
    for ch in s:
        if q:
            cur += ch
            if ch == q:
                q = None
            continue
        if ch in "\"'":
            q = ch
        elif ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == ";" and depth == 0:
            out.append(cur)
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur)
    return out


if __name__ == "__main__":
    src, prefix = sys.argv[1], sys.argv[2]
    html = open(src).read()
    c = Conv(prefix)
    jsx = c.convert(html)
    open(src + ".jsx", "w").write(jsx)
    open(src + ".css", "w").write(c.css_text())
    print(len(jsx), "chars,", len(c.css), "hover rules")
