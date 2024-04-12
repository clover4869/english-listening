function pagination(totalPosts) {
  var paginationHtml = "";
  var leftNumber = parseInt(numberOfPagesToShow / 2);
  if (leftNumber == numberOfPagesToShow - leftNumber) {
    numberOfPagesToShow = 2 * leftNumber + 1;
  }
  var startPage = currentPage - leftNumber;
  if (startPage < 1) {
    startPage = 1;
  }
  var totalPages = parseInt(totalPosts / postsPerPage) + 1;
  if (totalPages - 1 == totalPosts / postsPerPage) {
    totalPages -= 1;
  }
  var endPage = startPage + numberOfPagesToShow - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
  }
  paginationHtml += "<span class='totalpages'>Page " + currentPage + " of " + totalPages + "</span>";
  
  var previousPage = parseInt(currentPage) - 1;
  if (currentPage > 1) {
    if (2 == currentPage) {
      if ("page" == pageType) {
        paginationHtml += '<span class="showpage"><a href="' + homePage + '">' + previousText + "</a></span>";
      } else {
        paginationHtml += '<span class="pagenumber"><a href="/search/label/' + labelName + "?&max-results=" + postsPerPage + '">' + previousText + "</a></span>";
      }
    } else {
      if ("page" == pageType) {
        paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectPage(' + previousPage + ');return false">' + previousText + "</a></span>";
      } else {
        paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectLabel(' + previousPage + ');return false">' + previousText + "</a></span>";
      }
    }
  }
  
  if (startPage > 1) {
    if ("page" == pageType) {
      paginationHtml += '<span class="pagenumber"><a href="' + homePage + '">1</a></span>';
    } else {
      paginationHtml += '<span class="pagenumber"><a href="/search/label/' + labelName + "?&max-results=" + postsPerPage + '">1</a></span>';
    }
  }
  
  if (startPage > 2) {
    paginationHtml += "";
  }
  
  for (var page = startPage; page <= endPage; page++) {
    paginationHtml += (currentPage == page) ? '<span class="current">' + page + "</span>" : (1 == page) ? (("page" == pageType) ? '<span class="pagenumber"><a href="' + homePage + '">1</a></span>' : '<span class="pagenumber"><a href="/search/label/' + labelName + "?&max-results=" + postsPerPage + '">1</a></span>') : (("page" == pageType) ? '<span class="pagenumber"><a href="#" onclick="redirectPage(' + page + ');return false">' + page + "</a></span>" : '<span class="pagenumber"><a href="#" onclick="redirectLabel(' + page + ');return false">' + page + "</a></span>");
  }
  
  if (endPage < totalPages - 1) {
    paginationHtml += "";
  }
  
  if (endPage < totalPages) {
    if ("page" == pageType) {
      paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectPage(' + totalPages + ');return false">' + totalPages + "</a></span>";
    } else {
      paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectLabel(' + totalPages + ');return false">' + totalPages + "</a></span>";
    }
  }
  
  var pageAreas = document.getElementsByName("pageArea");
  var blogPager = document.getElementById("blog-pager");
  for (var p = 0; p < pageAreas.length; p++) {
    pageAreas[p].innerHTML = paginationHtml;
  }
  if (pageAreas && pageAreas.length > 0) {
    paginationHtml = "";
  }
  if (blogPager) {
    blogPager.innerHTML = paginationHtml;
  }
}

function paginationall(a) {
  var e = a.feed,
    s = parseInt(e.openSearch$totalResults.$t, 10);
  pagination(s);
}

function bloggerpage() {
  var a = urlactivepage;
  -1 != a.indexOf("/search/label/") &&
    (lblname1 =
      -1 != a.indexOf("?updated-max")
        ? a.substring(
            a.indexOf("/search/label/") + 14,
            a.indexOf("?updated-max")
          )
        : a.indexOf("?&max") != -1
        ? a.substring(a.indexOf("/search/label/") + 14, a.indexOf("?&max"))
        : a.substring(a.indexOf("/search/label/") + 14)),
    -1 == a.indexOf("?q=") &&
      -1 == a.indexOf(".html") &&
      (-1 == a.indexOf("/search/label/")
        ? ((type = "page"),
          (postnumber =
            -1 != urlactivepage.indexOf("#PageNo=")
              ? urlactivepage.substring(
                  urlactivepage.indexOf("#PageNo=") + 8,
                  urlactivepage.length
                )
              : 1),
          document.write(
            '<' + 'script src="' +
              home_page +
              'feeds/posts/summary?max-results=1&alt=json-in-script&callback=paginationall"><' + '/' + 'script>'
          ))
        : ((type = "label"),
          -1 == a.indexOf("&max-results=") && (postperpage = 20),
          (postnumber =
            -1 != urlactivepage.indexOf("#PageNo=")
              ? urlactivepage.substring(
                  urlactivepage.indexOf("#PageNo=") + 8,
                  urlactivepage.length
                )
              : 1),
          document.write(
            '<' + 'script src="' +
              home_page +
              "feeds/posts/summary/-/" +
              lblname1 +
              '?alt=json-in-script&callback=paginationall&max-results=1" > ' + '<' + '/script>'
          )));
}

function redirectpage(a) {
  (jsonstart = (a - 1) * postperpage), (nopage = a);
  var e = document.getElementsByTagName("head")[0],
    s = document.createElement("script");
  (s.type = "text/javascript"),
    s.setAttribute(
      "src",
      home_page +
        "feeds/posts/summary?start-index=" +
        jsonstart +
        "&max-results=1&alt=json-in-script&callback=finddatepost"
    ),
    e.appendChild(s);
}

function redirectlabel(a) {
  (jsonstart = (a - 1) * postperpage), (nopage = a);
  var e = document.getElementsByTagName("head")[0],
    s = document.createElement("script");
  (s.type = "text/javascript"),
    s.setAttribute(
      "src",
      home_page +
        "feeds/posts/summary/-/" +
        lblname1 +
        "?start-index=" +
        jsonstart +
        "&max-results=1&alt=json-in-script&callback=finddatepost"
    ),
    e.appendChild(s);
}

function finddatepost(a) {
  post = a.feed.entry[0];
  var e =
      post.published.$t.substring(0, 19) +
      post.published.$t.substring(23, 29),
    s = encodeURIComponent(e);
  if ("page" == type)
    var r =
      "/search?updated-max=" +
      s +
      "&max-results=" +
      postperpage +
      "#PageNo=" +
      nopage;
  else
    var r =
      "/search/label/" +
      lblname1 +
      "?updated-max=" +
      s +
      "&max-results=" +
      postperpage +
      "#PageNo=" +
      nopage;
  location.href = r;
}
var nopage, type, postnumber, lblname1;
bloggerpage();