var SyncTexJs = function (pdfsyncBody) {
  var unit = 65781.76;
  var numberPages = 0;
  var currentPage = {};
  var currentElement = {};

  var latexLines = {};
  var blockNumberLine = {};
  var hBlocks = [];

  var files = {};
  var pages = {};
  var pdfsyncObject = {
    offset: {
      x: 0,
      y: 0
    },
    version: '',
    files: {},
    pages: {},
    blockNumberLine: {},
    hBlocks: [],
    numberPages: 0
  };

  if (pdfsyncBody == null) {
    return pdfsyncObject;
  }
  var lineArray = pdfsyncBody.split("\n");

  pdfsyncObject.version = lineArray[0].replace('SyncTeX Version:', '');

  var inputPattern = /Input:([0-9]+):(.+)/;
  var offsetPattern = /(X|Y) Offset:([0-9]+)/;
  var openPagePattern = /\{([0-9]+)$/;
  var closePagePattern = /\}([0-9]+)$/;
  var verticalBlockPattern = /\[([0-9]+),([0-9]+):(-?[0-9]+),(-?[0-9]+):(-?[0-9]+),(-?[0-9]+),(-?[0-9]+)/;
  var closeverticalBlockPattern = /\]$/;
  var horizontalBlockPattern = /\(([0-9]+),([0-9]+):(-?[0-9]+),(-?[0-9]+):(-?[0-9]+),(-?[0-9]+),(-?[0-9]+)/;
  var closehorizontalBlockPattern = /\)$/;
  var elementBlockPattern = /(.)([0-9]+),([0-9]+):-?([0-9]+),-?([0-9]+)(:?-?([0-9]+))?/;

  for (var i = 1; i < lineArray.length; i++) {
    var line = lineArray[i];

    //input files
    match = line.match(inputPattern);
    if (match) {
      files[match[1]] = {
        path: match[2],
        name: match[2].replace(/^.*[\\\/]/, '')
      };
      continue;
    }

    //offset
    match = line.match(offsetPattern);
    if (match) {
      pdfsyncObject.offset[match[1].toLowerCase()] = parseInt(match[2]) / unit;
      continue;
    }

    //new page
    match = line.match(openPagePattern);
    if (match) {
      currentPage = {
        page: parseInt(match[1]),
        blocks: [],
        type: 'page'
      };
      if (currentPage.page > numberPages) {
        numberPages = currentPage.page;
      }
      currentElement = currentPage;
      continue;
    }

    // close page
    match = line.match(closePagePattern);
    if (match) {
      pages[match[1]] = currentPage;
      currentPage = null;
      continue;
    }

    // new V block
    match = line.match(verticalBlockPattern);
    if (match) {
      var s1 = [match[3] / unit, match[4] / unit];
      var s2 = [match[5] / unit, match[6] / unit];
      var block = {
        type: 'vertical',
        parent: currentElement,
        fileNumber: parseInt(match[1]),
        file: files[match[1]],
        line: parseInt(match[2]),
        left: s1[0],
        bottom: s1[1],
        width: s2[0],
        height: s2[1],
        depth: parseInt(match[7]),
        blocks: [],
        elements: [],
        page: currentPage.page
      };
      currentElement = block;
      continue;
    }

    // close V block
    match = line.match(closeverticalBlockPattern);
    if (match) {
      if (currentElement.parent != null) {
        currentElement.parent.blocks.push(currentElement);
        currentElement = currentElement.parent;
      }
      continue;
    }

    // new H block
    match = line.match(horizontalBlockPattern);
    if (match) {
      var s1 = [match[3] / unit, match[4] / unit];
      var s2 = [match[5] / unit, match[6] / unit];
      var block = {
        type: 'horizontal',
        parent: currentElement,
        fileNumber: parseInt(match[1]),
        file: files[match[1]],
        line: parseInt(match[2]),
        left: s1[0],
        bottom: s1[1],
        width: s2[0],
        height: s2[1],
        blocks: [],
        elements: [],
        page: currentPage.page
      };
      hBlocks.push(block);
      currentElement = block;
      continue;
    }

    // close H block
    match = line.match(closehorizontalBlockPattern);
    if (match) {
      if (currentElement.parent != null) {
        currentElement.parent.blocks.push(currentElement);
        currentElement = currentElement.parent;
      }
      continue;
    }

    // new element
    match = line.match(elementBlockPattern);
    if (match) {
      var type = match[1];
      var fileNumber = parseInt(match[2]);
      var lineNumber = parseInt(match[3]);
      var left = match[4] / unit;
      var bottom = match[5] / unit;
      var width = (match[7]) ? match[7] / unit : null;

      var elem = {
        type: type,
        parent: currentElement,
        fileNumber: fileNumber,
        file: files[fileNumber],
        line: lineNumber,
        left: left,
        bottom: bottom,
        height: currentElement.height,
        width: width,
        page: currentPage.page
      };
      if (blockNumberLine[elem.file.name] == null) {
        blockNumberLine[elem.file.name] = {};
      }
      if (blockNumberLine[elem.file.name][lineNumber] == null) {
        blockNumberLine[elem.file.name][lineNumber] = {};
      }
      if (blockNumberLine[elem.file.name][lineNumber][elem.page] == null) {
        blockNumberLine[elem.file.name][lineNumber][elem.page] = [];
      }
      blockNumberLine[elem.file.name][lineNumber][elem.page].push(elem);
      if (currentElement.elements != null)
        currentElement.elements.push(elem);
      continue;
    }
  }
  pdfsyncObject.files = files;
  pdfsyncObject.pages = pages;
  pdfsyncObject.blockNumberLine = blockNumberLine;
  pdfsyncObject.hBlocks = hBlocks;
  pdfsyncObject.numberPages = numberPages;
  return pdfsyncObject;
};