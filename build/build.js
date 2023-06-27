
import { marked } from 'marked';
import { markedEmoji } from 'marked-emoji';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';

const emojis = {};
JSON.parse(readFileSync('emojis.json').toString()).emojis
    .map(emoji => emojis[emoji.shortname.replace(/:/g, '')] = emoji.emoji);

marked.use(markedEmoji({
    emojis: emojis,
    unicode: true,
}));
marked.use(gfmHeadingId());

export function build() {
    console.log('Building');
    if (existsSync('../out')) {
        rmSync('../out', { recursive: true });
    }
    mkdirSync('../out');
    const postMds = readdirSync('../posts').map(post => readFileSync(`../posts/${post}`).toString());
    const postHtml = readFileSync('../site/post.html').toString();
    const homeHtml = readFileSync('../site/home.html').toString();

    let homeContent = '<div class="posts-list">';
    postMds.forEach(post => {
        const md = marked.parse(post, { mangle: false });
        const match = md.match(/(?<=<h1.*?>).*?(?=<\/h1>)/);
        if (match && match.length) {
            const title = match[0];
            const kebab = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^0-9a-z\-_]/g, '');
            writeFileSync(`../out/${kebab}.html`, postHtml
                .replace(/POST_TITLE/g, title)
                .replace(/POST_CONTENT/g, md)
            );
            homeContent += `<a href="${kebab}.html" class="post-link">${title}</a>`;
            console.log(`Built "${title}"`);
        }
    });
    homeContent += '</div>';

    writeFileSync(`../out/index.html`, homeHtml
        .replace('HOME_CONTENT', homeContent)
    );
    copyFileSync('../site/index.css', '../out/index.css');
    console.log('Build finished');
}
