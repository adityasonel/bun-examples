const fs = require('fs');
const path = require('path');
const url = require('url');
const markdownMagic = require('markdown-magic');

const dirname = path.resolve();

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const formatPluginName = (string) => {
  return toTitleCase(string.replace(/-/g, ' '));
};

const username = (repo) => {
  if (!repo) {
    return null;
  }

  const o = url.parse(repo);
  var urlPath = o.path; // eslint-disable-line

  if (urlPath.length && urlPath.charAt(0) === '/') {
    urlPath = urlPath.slice(1);
  }

  urlPath = urlPath.split('/')[0];
  return urlPath;
};

const config = {
  transforms: {
    /*
    In README.md the below comment block adds the list to the readme
    <!-- AUTO-GENERATED-CONTENT:START (GENERATE_EXAMPLES_TABLE)-->
      examples list will be generated here
    <!-- AUTO-GENERATED-CONTENT:END -->
     */
    EXAMPLES_TABLE() {
      const exampleFile = path.join(dirname, 'examples.json');
      console.log({ exampleFile });
      const examples = JSON.parse(fs.readFileSync(exampleFile, 'utf8'));
      // Make table header
      let md = '| Example | Author |\n';
      md += '|:-------|:------:|\n';
      // Sort alphabetically
      examples
        .sort((a, b) => (a.name < b.name ? -1 : 1))
        .forEach((data) => {
          // add table rows
          const userName = username(data.githubUrl);
          const profileURL = `http://github.com/${userName}`;
          md += `| **[${formatPluginName(data.name)}](${
            data.githubUrl
          })** <br/>`;
          md += ` ${data.description} | [${userName}](${profileURL}) |\n`;
        });
      return md.replace(/^\s+|\s+$/g, '');
    },
  },
};

const markdownPath = path.join(dirname, 'README.md');
console.log({ markdownPath });
markdownMagic(markdownPath, config, () => {
  console.log('Docs updated!');
});
