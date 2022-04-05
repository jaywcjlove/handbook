import path from 'path';
import fs from 'fs-extra';
import recursiveReaddirFiles from 'recursive-readdir-files';
import { create } from 'markdown-to-html-cli';
import { favicon } from './node/favicon.mjs';
import { header } from './node/header.mjs';
import { footer } from './node/footer.mjs';

const styleStr = fs.readFileSync(path.relative(process.cwd(), 'scripts/style.css'));
function createOption(editPath) {
  const href = path.relative(process.cwd(), editPath);
  return {
    'github-corners': 'https://github.com/jaywcjlove/handbook.git',
    document: {
      style: [styleStr.toString()],
      link: [
        { rel: 'icon', href: favicon, type: 'image/x-icon' }
        // { rel: 'shortcut icon', href: './favicon.ico' },
      ]
    },
    rewrite: (node) => {
      if (node.type === 'element' && node.properties && node.properties.href && !node.properties['data-edit'] && /.md$/.test(node.properties.href)) {
        if (/(readme|README).md$/.test(node.properties.href.toLocaleLowerCase())) {
          node.properties.href = node.properties.href.replace(/(readme|README).md$/, 'index.html');
        } else {
          node.properties.href = node.properties.href.replace(/.md$/, '.html');
        }
      }
      if (node.type === 'element' && node.tagName === 'body') {
        node.properties = { ...node.properties, id: 'totop' };
        const homeUrl = path.relative(`${href}/..`, './index.html');
        node.children = [header(homeUrl), ...node.children, footer(href)];
      }
    }
  }
}

;(async () => {
  await fs.ensureDir('build');
  const pkg = await fs.readJson('package.json');
  const files = await recursiveReaddirFiles(process.cwd(), {
    ignored: /\/(node_modules|\.git|build)/,
    filter: (item) => /(.md|.svg|.jpg|.png|.mp4)$/.test(item.path)
  });
  await Promise.all(files.map(async (item) => {
    const markdown = await fs.readFile(item.path);
    const outputPath = path.join('build', path.relative(process.cwd(), item.path).replace(/README.md$/, 'index.html').replace(/.md$/, '.html'));
    await fs.ensureDir(path.dirname(outputPath));
    if (/.md$/.test(item.path)) {
      const options = createOption(item.path);
      let title = markdown.toString().match(/^([\s\S]*?)===/)
      title = title ? title[1].replace(/\n/, '') : '';
      const html = create({
        markdown, ...options,
        document: {
          title: title ? `${title} - handbook` : `handbook`,
          ...options.document,
          meta: [
            { description: `放置我的笔记、搜集、摘录、实践，保持好奇心。看文需谨慎，后果很严重。${title} - handbook` },
            { keywords: 'example,handbook' }
          ]
        }
      });
      await fs.writeFile(outputPath, html);
      console.log(`♻️  create file: \x1b[32;1m ${outputPath} \x1b[0m`);
    } else {
      await fs.copyFile(item.path, outputPath);
      console.log(`🏞  copied file: \x1b[32;1m ${outputPath} \x1b[0m`);
    }
  }));

})();