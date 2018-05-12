# SyncTeX-js


SyncTeX is a new method in TeXLive 2008 for enabling synchronization between source TeX files and the resulting PDF file.

This repository contains a JavaScript implementation of for SyncTeX.
It has been originally developed for [\BlueLaTex](https://www.bluelatex.org), an open-source LaTeX editor for the Web.

## Output

```js
{
  "offset": {
    "x": 0,
    "y": 0
  },
  "version": "1",
  "files": {
    "1": {
      "path": "/home/thomas/blueData/papers/x4dcc87de752e4b86/./main.tex",
      "name": "main.tex"
    },
    "2": {
      "path": "/usr/share/texlive/texmf-dist/tex/latex/base/article.cls",
      "name": "article.cls"
    }
  },
  "pages": {
    "1": {
      "page": 1, // page number
      "blocks": [
        {
          "type": "vertical",
          "parent": "<ref to parent>",
          "fileNumber": 1,
          "file": "<ref to file>",
          "line": 27,
          "left": 71.99998905471669,
          "bottom": 765.1950023836396,
          "width": 483.30710519146953,
          "height": 693.1950133289229,
          "depth": 0,
          "blocks": [
            {
              "type": "vertical",
              "parent": "<ref to parent>",
              "fileNumber": 1,
              "file": "<ref to file>",
              "line": 27,
              "left": 56.69290392959994,
              "bottom": 765.1950023836396,
              "width": 498.6141903165863,
              "height": 745.3638668226573,
              "depth": 0,
              "blocks": [...],
              "elements": [...],
              "page": 1
            }
          ],
          "elements": [],
          "page": 1
        }
      ],
      "type": "page"
    }
  },
  "blockNumberLine": {
    "main.tex": { // file name
      "20": { // line number
        "1": [ // block in page
          { // element in the line
            "type": "k",
            "parent": "<ref to parent>",
            "fileNumber": 1,
            "file": "<ref to file>",
            "line": 27,
            "left": 555.3070942461862,
            "bottom": 765.1950023836396,
            "height": 6.39113334760274,
            "width": 246.8170356037905,
            "page": 1
          }
        ]
      }
    }
  },
  "hBlocks": [ // all horizontal block of the document
  ],
  "numberPages": 1
}
```