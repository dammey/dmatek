import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from build_dc import build

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "app", "assurance") + "/"
os.makedirs(OUT, exist_ok=True)

build(
    "DMatek Assurance.dc.html",
    ranges=[(47, 184)],
    prefix="asr-h",
    src_name="assurance",
    out_tsx=OUT + "AssuranceMarkup.tsx",
    out_css=OUT + "assurance.css",
    drop=[
        # Review tag for D'Matek's sign-off; never shown on the live site.
        r'<sc-if value="\{\{ showDraft \}\}".*?</sc-if>\s*',
    ],
    subs=[
        ('Manage, protect and improve it. Advisory,', 'Advisory,'),
        ('border-top:2px solid #D4A637;padding:10px 0 0;margin:0">D&rsquo;MATEK ASSURANCE &middot; MANAGE IT</p><h2', 'border-top:2px solid #D4A637;padding:10px 0 0;margin:0">WHAT WE COVER</p><h2'),

        ("padding:clamp(112px,15vh,140px) clamp(18px,3vw,40px) clamp(40px,6vh,72px)", "padding:clamp(36px,6vh,64px) clamp(18px,3vw,40px) clamp(40px,6vh,72px)"),
        ('href="#cover-b6" data-open="cover-b6"', 'href="#asr-b6" data-open="asr-b6"'),
        ('href="#cover-b7" data-open="cover-b7"', 'href="#asr-b7" data-open="asr-b7"'),
        ('onInput="{{ onScrub }}"', 'onChange="{{ onScrub }}"'),
        ('<div style="display:grid;grid-template-columns:auto 1fr auto;gap:16px 24px', '<div data-asr="ctrl" style="display:grid;grid-template-columns:auto 1fr auto;gap:16px 24px'),
        ('<div style="display:grid;grid-template-columns:64px 1fr auto;', '<div data-asr="ev" style="display:grid;grid-template-columns:64px 1fr auto;'),
        # The prototype promised a reply "within two working days"; no such
        # commitment has been supplied.
        ("Someone from D&rsquo;Matek will reply to you directly within two working days.", "Someone will read this properly and come back to you.{{ refLine }}"),
        ('<button type="button" onClick="{{ retry }}"', '<button type="button" onClick="{{ retry }}" data-track="form_retry_assurance"'),
        ('<input id="f-contact" type="text"', '<input id="f-contact" type="text" autocomplete="email"'),
        ('<input id="f-name" type="text"', '<input id="f-name" type="text" autocomplete="name" aria-invalid="{{ eName }}"'),
    ],
    extra_css="""
@keyframes asrPop{0%{transform:translateY(8px);opacity:0}100%{transform:none;opacity:1}}
@keyframes asrRing{0%{transform:scale(.7);opacity:.6}100%{transform:scale(3.6);opacity:0}}
@keyframes asrCar{to{transform:translateX(1300px)}}
@keyframes asrShield{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.7;transform:scale(1.25)}}
.asr-root a{color:#06382E}
.asr-root a:hover{color:#28705A}
.asr-root a:focus-visible,.asr-root button:focus-visible,.asr-root input:focus-visible,.asr-root textarea:focus-visible{outline:2px solid #D4A637;outline-offset:3px}
.asr-root svg [font-family]{font-family:var(--font-manrope),sans-serif}
.asr-root input::placeholder,.asr-root textarea::placeholder{color:rgba(245,241,232,0.5)}
.asr-root [data-pm]::before{content:"+"}
.asr-root details[open]>summary [data-pm]::before{content:"\\2212"}
.asr-root summary::-webkit-details-marker{display:none}
@media(max-width:640px){.asr-root [data-asr=ctrl]{grid-template-columns:auto 1fr !important}.asr-root [data-asr=ctrl]>div:last-child{grid-column:1/-1}.asr-root [data-asr=ev]{grid-template-columns:48px 1fr !important}.asr-root [data-asr=ev]>span:last-child{grid-column:2;justify-self:start}}
@media (prefers-reduced-motion: reduce){.asr-root [style*="animation"]{animation:none!important}}
""",
)
