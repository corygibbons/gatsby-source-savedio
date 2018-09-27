# gatsby-source-savedio

Plugin to source all bookmarks from [saved.io](http://saved.io)

## Install

`npm install --save gatsby-source-savedio`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-savedio',
      options: {
        devkey: 'YOUR DEVELOPER KEY'
        key: 'YOUR USER KEY'
      }
    }
  ]
};
```

## How to query

You can query bookmark nodes like this:

```graphql
{
  allSavedioBookmark {
    edges {
      node {
        bk_id
        bk_url
        bk_title
        bk_note
        bk_date
      }
    }
  }
}
```
