import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_dc import build

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "cloud") + "/"
os.makedirs(OUT, exist_ok=True)

# Prototype contact boxes promised "an engineer will contact you within two
# working days" (an SLA nobody has committed to). They now hand the note to
# the shared enquiry form instead.
def contact_form(bg, edge, ink):
    return (
        '<form onSubmit="{{ send }}" style="display:flex;flex-direction:column;gap:12px">'
        f'<input name="note" maxlength="600" aria-label="What are you running today?" placeholder="What are you running today?" style="background:{bg};border:1px solid {edge};padding:15px 16px;font-size:16px;color:#F5F1E8;outline:none" style-focus="border-color:#D4A637">'
        f'<button type="submit" data-track="cta_review_request" style="align-self:flex-start;background:#D4A637;color:{ink};border:0;padding:15px 24px;font-size:15px;font-weight:700;cursor:pointer">Book a free review →</button>'
        '</form>'
    )

build(
    "DMatek Cloud Home v3.1 shared.dc.html",
    ranges=[(45, 414)],
    prefix="cl-h",
    src_name="cloud",
    out_tsx=OUT + "CloudMarkup.tsx",
    out_css=OUT + "cloud.css",
    drop=[
        r'(?<=</section>)<div aria-hidden="true" style="height:22px.*$',
        # Case studies (unapproved client names, README §9) are unreachable in
        # the design's data; drop the markup so no names ship.
        r'<sc-if value="\{\{ vnode\.isWork \}\}".*?</sc-for>\s*</div>\s*</sc-if>',
        r'<sc-if value="\{\{ p\.isCases \}\}".*?</sc-for>\s*</div>\s*</sc-if>',
        r'<sc-if value="\{\{ sent \}\}"[^>]*>.*?</sc-if>',
    ],
    resubs=[
        (r'<sc-if value="\{\{ notSent \}\}"[^>]*>\s*<input placeholder="Your name" style="background:#010E0B.*?</sc-if>',
         contact_form("#010E0B", "#28705A", "#021A15")),
        (r'<sc-if value="\{\{ notSent \}\}"[^>]*>\s*<input placeholder="Your name" style="background:#050809.*?</sc-if>',
         contact_form("#050809", "rgba(61,255,168,.4)", "#030405")),
    ],
    subs=[
        # Header tag line ("EMAIL · HOSTING · BACKUP · SERVERS") removed by request.
        ('<span id="cloud-tag" style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.18em;color:#8C9A9E;white-space:nowrap">EMAIL · HOSTING · BACKUP · SERVERS</span>', ''),
        ('Run it. The digital environment businesses use', 'The digital environment businesses use'),

        ("margin-top:84px;min-height:calc(100vh - 84px);", "min-height:calc(100svh - 78px);"),
        ("margin-top:84px;height:calc(100vh - 84px);", "height:calc(100svh - 78px);min-height:540px;"),
        ('<h1 style="font-weight:800;font-size:clamp(20px,2vw,28px);line-height:1.1;letter-spacing:-.025em;margin:8px 0 0;max-width:24ch;text-shadow:0 0 30px rgba(1,14,11,.9)">{{ svc.title }}</h1>',
         '<h2 style="font-weight:800;font-size:clamp(20px,2vw,28px);line-height:1.1;letter-spacing:-.025em;margin:8px 0 0;max-width:24ch;text-shadow:0 0 30px rgba(1,14,11,.9)">{{ svc.title }}</h2>'),
        ('href="#cloud-b10" data-open="cloud-b10"', 'href="#cld-b10" data-open="cld-b10"'),
        ('<canvas data-c3="cv"', '<canvas data-c3="cv" aria-hidden="true"'),
        ('<canvas data-cl="net"', '<canvas data-cl="net" aria-hidden="true"'),
        (' target="_top"', ''),
        ('D’MATEK.COM ↗', 'D’MATEK.NG ↗'),
        ('<span style="font-size:14px;line-height:1.5;color:#A9BBB3">{{ n.line }}</span>', '<span style="font-size:14px;line-height:1.5;color:#A9BBB3">{{ n.desc }}</span>'),
        ('DEMO RESULTS · LIVE SEARCH TO BE CONNECTED</div></sc-if>\n        </div>', 'EXAMPLE ONLY · WE CHECK REAL AVAILABILITY FOR YOU</div></sc-if>\n        </div>'),
        ('DEMO RESULTS · LIVE SEARCH TO BE CONNECTED</div></sc-', 'EXAMPLE ONLY · WE CHECK REAL AVAILABILITY FOR YOU</div></sc-'),
    ],
    extra_css="""
@keyframes c3Draw{to{stroke-dashoffset:0}}
@keyframes c3Run{from{stroke-dashoffset:0}to{stroke-dashoffset:-100}}
@keyframes c3Pulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.4);opacity:0}}
.cl-root a{color:#3DFFA8}
.cl-root a:hover{color:#A6FFD6}
.cl-root button{font-family:inherit;cursor:pointer}
.cl-root input::placeholder{color:rgba(245,241,232,0.5)}
.cl-root svg [font-family]{font-family:var(--font-manrope),sans-serif}
@media(max-width:1279px){.cl-root #cloud-hero{left:24px !important;max-width:min(420px,42%) !important}.cl-root #cloud-d{bottom:auto !important;top:52px !important;width:72px !important}}
/* The D mark sits top-left at every width (the prototype had it bottom-left), so the headline starts at the left margin too. */
.cl-root #cloud-d{bottom:auto !important;top:64px !important}
@media(min-width:1280px){.cl-root #cloud-hero{left:24px !important;max-width:min(560px,calc(100% - 48px)) !important}}
/* Lighter, non-3D hero on phones and in lite mode (reduced motion, data saver, 2G). */
.cl-root #cloud-lite{display:none}
.cl-root[data-lite] #cloud-lite{display:flex}
.cl-root[data-lite] [data-c3="root"]{display:none}
@media(max-width:759px){.cl-root #cloud-lite{display:flex}.cl-root [data-c3="root"]{display:none}}
.cl-root [data-pm]::before{content:"+"}
.cl-root details[open]>summary [data-pm]::before{content:"\\2212"}
.cl-root summary::-webkit-details-marker{display:none}
@media (prefers-reduced-motion: reduce){.cl-root [style*="c3Pulse"],.cl-root [style*="c3Run"]{animation:none!important}.cl-root [style*="c3Draw"]{animation:none!important;stroke-dashoffset:0!important}}
""",
)
