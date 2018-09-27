const fetch = require('node-fetch');
const queryString = require('query-string');
const crypto = require('crypto');

exports.sourceNodes = async ({ actions, createNodeId }, configOptions) => {
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

  const { devkey, key, list } = configOptions;
  const apiOptions = queryString.stringify({ devkey, key, list });

  const PER_PAGE = 100;
  const API_URL = `http://devapi.saved.io/bookmarks?${apiOptions}`;

  const getBookmarks = async () => {
    let records = [];
    let keepGoing = true;
    let page = 1;

    while (keepGoing) {
      let response = await reqBookmarks(page);
      const data = await response.json();
      await records.push(...data);
      page += 1;

      if (data.length < PER_PAGE) {
        keepGoing = false;
        return records;
      }
    }
  };

  const reqBookmarks = async page => {
    let payload = await fetch(`${API_URL}&limit=${PER_PAGE}&page=${page}`);
    return payload;
  };

  const bookmarks = await getBookmarks();

  return bookmarks.forEach(bookmark => {
    const nodeData = processBookmark(bookmark);
    createNode(nodeData);
  });
};
