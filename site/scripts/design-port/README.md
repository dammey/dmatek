# Design port: business pages

`/infrastructure`, `/cloud`, `/ilemesh` and `/assurance` are ported from the
v3.6 Claude Design prototypes in `docs/project/v3.6/*.dc.html`.

- `dc2jsx.py` converts `.dc.html` markup (`{{ }}` bindings, `<sc-for>`,
  `<sc-if>`, `style-hover`) into JSX.
- `build_dc.py` slices the page body out of a prototype, rewrites prototype
  links to real routes, applies the page's substitutions and writes
  `app/<route>/<Name>Markup.tsx` plus `app/<route>/<route>.css`.
- `page_inf.py`, `page_cloud.py`, `page_ile.py`, `page_asr.py` hold each
  page's line range and edits: removing the prototype's own header, footer
  and WhatsApp button, hiding unsupplied content (README §9), and replacing
  invented reply-time promises with the shared enquiry flow.

Behaviour lives in each page's hand-ported `*Client.tsx`. After a design
update, re-run the page script (`python3 page_cloud.py`), then diff the
logic class in the prototype against the client component.
