const fetch = require('node-fetch');
const queryString = require('query-string');
const crypto = require('crypto');

exports.sourceNodes = ({ actions, createNodeId }, configOptions) => {
  const { createNode } = actions;

  delete configOptions.plugins;

  const processBookmark = bookmark => {
    const nodeId = createNodeId(`savedio-${bookmark.bk_id}`);
    const nodeContent = JSON.stringify(bookmark);
    const nodeContentDigest = crypto
      .createHash('md5')
      .update(nodeContent)
      .digest('hex');

    const nodeData = Object.assign({}, bookmark, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `SavedioBookmark`,
        content: nodeContent,
        contentDigest: nodeContentDigest
      }
    });

    return nodeData;
  };

  const validOptions = ({ devkey, key, list } = configOptions);
  const apiOptions = queryString.stringify(validOptions);

  const apiUrl = `http://devapi.saved.io/bookmarks?${apiOptions}&limit=99999`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(bookmark => {
        const nodeData = processBookmark(bookmark);
        createNode(nodeData);
      });
    });
};
