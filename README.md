# gatsby-source-savedio

Plugin to source all bookmarks from saved.io

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
