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
        ('<section data-screen-label="Principle" style="background:#D4A637;color:#06382E;padding:clamp(72px,12vh,140px) clamp(18px,3vw,40px)"', '<section data-screen-label="Estates" style="background:#EFEADC;color:#06382E;padding:clamp(48px,7vh,88px) clamp(18px,3vw,40px)"><div style="max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:clamp(20px,3vw,44px);align-items:center"><div><p style="font-size:11.5px;font-weight:700;letter-spacing:.2em;color:#28705A;margin:0 0 14px">ESTATES AND NEW HOMES</p><h2 style="font-weight:800;font-size:clamp(28px,3.4vw,46px);line-height:1.05;letter-spacing:-.03em;margin:0 0 14px">Building or running an estate?</h2><p style="font-size:17px;line-height:1.7;color:#3A4A44;margin:0;max-width:34em">Internet-Ready Homes puts the network cabling in during construction. EstateLine extends it into estate-wide internet service after handover.</p></div><div style="display:flex;flex-wrap:wrap;gap:12px"><a href="/internet-ready-homes" data-track="inf_irh" style="background:#D4A637;color:#06382E;font-weight:700;font-size:15px;padding:16px 26px;border-radius:999px;white-space:nowrap">See Internet-Ready Homes &rarr;</a><a href="/solutions/real-estate" data-track="inf_connected_estate" style="border:1px solid rgba(6,56,46,.22);color:#06382E;font-weight:600;font-size:15px;padding:15px 26px;border-radius:999px;white-space:nowrap">Connected Estate</a></div></div></section>\n' + '<section data-screen-label="Principle" style="background:#D4A637;color:#06382E;padding:clamp(72px,12vh,140px) clamp(18px,3vw,40px)"'),
        ('Connect it. Design, build and operate', 'Design, build and operate'),

        ("</div>\n</sc-if>", "</div>"),
        ("height:100vh;min-height:560px;", "height:calc(100svh - 78px);min-height:520px;"),
        ("touch-action:none\">", "touch-action:pan-y\">"),
        ("padding:96px clamp(18px,3vw,40px) 0", "padding:28px clamp(18px,3vw,40px) 0"),
        ('<h1 style="position:absolute;left:0;bottom:0;margin:0;font-weight:800;font-size:1em;line-height:.9;letter-spacing:-.055em;max-width:14ch;opacity:{{ bOp }}',
         '<div aria-hidden="true" style="position:absolute;left:0;bottom:0;margin:0;font-weight:800;font-size:1em;line-height:.9;letter-spacing:-.055em;max-width:14ch;opacity:{{ bOp }}'),
        ('and operated.</span></h1>', 'and operated.</span></div>'),
        ('<span style="font-family:\'Manrope\',sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;color:#D4A637;white-space:nowrap">{{ pct }}% CONNECTED</span>',
         '<span aria-hidden="true" data-pct="1" style="font-family:\'Manrope\',sans-serif;font-weight:700;font-size:12px;letter-spacing:.1em;color:#D4A637;white-space:nowrap">{{ pct }}% CONNECTED</span>'),
        ('<canvas data-cv="1"', '<canvas data-cv="1" aria-hidden="true"'),
        (FORM_OLD, FORM_NEW),
        # Cream on gold fails contrast; keep the emphasis with a cream underline.
        ('<span style="color:#F5F1E8">Support</span>', '<span style="text-decoration:underline;text-decoration-color:#F5F1E8;text-decoration-thickness:.08em;text-underline-offset:.12em">Support</span>'),
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
