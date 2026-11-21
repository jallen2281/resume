// Post-processes the themed HTML:
//  - adds a robots noindex tag unless ALLOW_INDEXING=true (keeps the page out of search engines)
//  - adds a "Download PDF" link
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'dist/index.html';
let html = readFileSync(file, 'utf8');

const head = [];
if (process.env.ALLOW_INDEXING !== 'true') {
  head.push('<meta name="robots" content="noindex, nofollow">');
}
head.push('<meta name="description" content="Resume of Jared A. Allen — critical infrastructure engineer: data center monitoring, controls, physical security.">');
head.push('<style>.pdf-link{position:fixed;top:1rem;right:1rem;padding:.45rem .8rem;border-radius:6px;background:#1f2937;color:#fff;font:600 14px/1 system-ui,sans-serif;text-decoration:none;z-index:10}.pdf-link:hover{background:#374151}@media print{.pdf-link{display:none}}@media print{html{font-size:9.5px}body{gap:.9em 1.6em;margin:0;grid-template-columns:[full-start]0[main-start side-start]8em[side-end content-start]1fr[main-end content-end]0[full-end]}.masthead{padding:0 0 .6em;background:none}.masthead h1{font-size:2.4em}.masthead h2{font-size:1.35em}.stack{gap:.9em}h3{font-size:1.5em}h4{font-size:1.25em}article>*+*,.timeline>div>*+*{margin-top:.3em}.timeline>div:not(:last-child){padding-bottom:.5rem}li p{margin:0}li+li{margin-top:.12em}article,li{break-inside:avoid}}</style>');

html = html.replace('</head>', head.join('\n') + '\n</head>');
html = html.replace(/<body([^>]*)>/, '<body$1>\n<a class="pdf-link" href="Jared-Allen-Resume.pdf" download>Download PDF</a>');

writeFileSync(file, html);
console.log('postbuild: done (noindex=' + (process.env.ALLOW_INDEXING !== 'true') + ')');
