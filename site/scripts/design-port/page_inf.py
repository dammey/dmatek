import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_dc import build

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "infrastructure") + "/"
os.makedirs(OUT, exist_ok=True)

FORM_OLD = """<sc-if value="{{ notSent }}" hint-placeholder-val="{{ true }}">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;max-width:960px">
        <input placeholder="Site, location and what you need connected" style="flex:1;min-width:260px;background:transparent;border:0;border-bottom:2px solid #D4A637;padding:16px 0;font-family:inherit;font-size:clamp(17px,1.6vw,22px);font-weight:600;color:#F5F1E8;outline:none">
        <button onClick="{{ send }}" style="background:#D4A637;color:#06382E;border:0;border-radius:999px;padding:20px 28px;font-size:16px;font-weight:800;white-space:nowrap" style-hover="background:#F5F1E8">Request a site survey →</button>
      </div>
    </sc-if>"""
# The prototype "sent" state promised a one-hour callback nobody has committed
# to. The note now carries into the shared enquiry form instead.
FORM_NEW = """<form onSubmit="{{ send }}" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;max-width:960px">
        <input name="note" aria-label="Site, location and what you need connected" maxlength="600" placeholder="Site, location and what you need connected" style="flex:1;min-width:260px;background:transparent;border:0;border-bottom:2px solid #D4A637;padding:16px 0;font-family:inherit;font-size:clamp(17px,1.6vw,22px);font-weight:600;color:#F5F1E8;outline:none" style-focus="border-bottom-color:#F5F1E8">
        <button type="submit" data-track="cta_survey_request" style="background:#D4A637;color:#06382E;border:0;border-radius:999px;padding:20px 28px;font-size:16px;font-weight:800;white-space:nowrap;cursor:pointer" style-hover="background:#F5F1E8">Request a site survey →</button>
      </form>"""

build(
    "DMatek Infrastructure Hero shared.dc.html",
    ranges=[(46, 227)],
    prefix="inf-h",
    src_name="infrastructure",
    out_tsx=OUT + "InfrastructureMarkup.tsx",
    out_css=OUT + "infrastructure.css",
    drop=[
        r'<sc-if value="\{\{ isB \}\}"[^>]*>\n',
        r'<section data-screen-label="Projects".*?</section>\n',
        r' \[CONFIRM: whether equipment is included\]',
        r'<sc-if value="\{\{ sent \}\}".*?</sc-if>',
        r'(?<=</section>)<div aria-hidden="true" style="height:22px.*$',
    ],
    subs=[
        ("</div>\n</sc-if>", "</div>"),
        ("height:100vh;min-height:560px;", "height:calc(100svh - 78px);min-height:520px;"),
        ("touch-action:none\">", "touch-action:pan-y\">"),
        ("padding:96px clamp(18px,3vw,40px) 0", "padding:28px clamp(18px,3vw,40px) 0"),
        ('<h1 style="position:absolute;left:0;bottom:0;margin:0;font-weight:800;font-size:1em;line-height:.9;letter-spacing:-.055em;max-width:14ch;opacity:{{ bOp }}',
         '<div aria-hidden="true" style="position:absolute;left:0;bottom:0;margin:0;font-weight:800;font-size:1em;line-height:.9;letter-spacing:-.055em;max-width:14ch;opacity:{{ bOp }}'),
        ('and operated.</span></h1>', 'and operated.</span></div>'),
        ('<span style="font-family:\'Manrope\',sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;color:#D4A637;white-space:nowrap">{{ pct }}% CONNECTED</span>',
         '<span aria-hidden="true" style="font-family:\'Manrope\',sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;color:#D4A637;white-space:nowrap">{{ pct }}% CONNECTED</span>'),
        ('<canvas data-cv="1"', '<canvas data-cv="1" aria-hidden="true"'),
        (FORM_OLD, FORM_NEW),
    ],
    extra_css="""
@keyframes infFlow{to{stroke-dashoffset:-16}}
.inf-root a{color:inherit}
.inf-root svg [font-family]{font-family:var(--font-manrope),sans-serif}
.inf-root a:hover{color:#D4A637}
.inf-root [data-pm]::before{content:"+"}
.inf-root details[open]>summary [data-pm]::before{content:"\\2212"}
.inf-root summary::-webkit-details-marker{display:none}
.inf-root input::placeholder{color:rgba(245,241,232,0.55)}
@media (prefers-reduced-motion: reduce){.inf-root [style*="infFlow"]{animation:none!important}}
""",
)
