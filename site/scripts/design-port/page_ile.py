import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_dc import build

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "ilemesh") + "/"
os.makedirs(OUT, exist_ok=True)

build(
    "DMatek IleMesh.dc.html",
    ranges=[(47, 186)],
    prefix="ile-h",
    src_name="ilemesh",
    out_tsx=OUT + "IleMeshMarkup.tsx",
    out_css=OUT + "ilemesh.css",
    drop=[
        # Review tag for D'Matek's sign-off; never shown on the live site.
        r'<sc-if value="\{\{ showDraft \}\}".*?</sc-if>\s*',
    ],
    subs=[
        ("padding:clamp(112px,15vh,140px) clamp(18px,3vw,40px) clamp(32px,5vh,56px)", "padding:clamp(36px,6vh,64px) clamp(18px,3vw,40px) clamp(32px,5vh,56px)"),
        ('<g onClick="{{ z.pick }}" onMouseEnter="{{ z.pick }}" style="cursor:pointer">',
         '<g onClick="{{ z.pick }}" onMouseEnter="{{ z.pick }}" onFocus="{{ z.pick }}" tabindex="0" role="button" aria-label="{{ z.label }}" style="cursor:pointer">'),
        ('href="#cover-b9" data-open="cover-b9"', 'href="#ile-b9" data-open="ile-b9"'),
        # The prototype promised a reply "within two working days"; no such
        # commitment has been supplied.
        ("Someone from D&rsquo;Matek will reply to you directly within two working days.", "Someone will read this properly and come back to you.{{ refLine }}"),
        ('<button type="button" onClick="{{ retry }}"', '<button type="button" onClick="{{ retry }}" data-track="form_retry_ilemesh"'),
        ('<input id="f-contact" type="text"', '<input id="f-contact" type="text" autocomplete="email"'),
        ('<input id="f-name" type="text"', '<input id="f-name" type="text" autocomplete="name" aria-invalid="{{ eName }}"'),
    ],
    extra_css="""
@keyframes ileCar{0%{transform:translateX(-170px);opacity:1}36%{transform:translateX(110px)}50%{transform:translateX(110px)}86%{transform:translateX(470px);opacity:1}92%{transform:translateX(520px);opacity:0}100%{transform:translateX(-170px);opacity:0}}
@keyframes ileBeam{0%,100%{opacity:.15}50%{opacity:.55}}
@keyframes ileBarrier{0%,38%{transform:rotate(0deg)}50%,88%{transform:rotate(-62deg)}100%{transform:rotate(0deg)}}
@keyframes ileFlow{to{stroke-dashoffset:-16}}
@keyframes ileRing{0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.2);opacity:0}}
@keyframes ileGlow{0%,100%{opacity:.35}50%{opacity:.9}}
.ile-root a{color:#06382E}
.ile-root a:hover{color:#28705A}
.ile-root a:focus-visible,.ile-root button:focus-visible,.ile-root input:focus-visible,.ile-root textarea:focus-visible,.ile-root g[role=button]:focus-visible{outline:2px solid #D4A637;outline-offset:3px}
.ile-root svg [font-family]{font-family:var(--font-manrope),sans-serif}
.ile-root input::placeholder,.ile-root textarea::placeholder{color:rgba(245,241,232,0.5)}
@media(max-width:1200px){.ile-root #ile-card{position:static !important;margin:-4px 12px 14px;grid-template-columns:1fr !important}}
.ile-root [data-pm]::before{content:"+"}
.ile-root details[open]>summary [data-pm]::before{content:"\\2212"}
.ile-root summary::-webkit-details-marker{display:none}
@media (prefers-reduced-motion: reduce){.ile-root [style*="animation"]{animation:none!important}}
""",
)
