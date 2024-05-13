function pagination(totalPosts) {
  var paginationHtml = "";
  var leftNumber = parseInt(numshowpage / 2);
  if (leftNumber == numshowpage - leftNumber) {
    numshowpage = 2 * leftNumber + 1;
  }
  var startPage = postnumber - leftNumber;
  if (startPage < 1) {
    startPage = 1;
  }
  var totalPages = parseInt(totalPosts / postperpage) + 1;
  if (totalPages - 1 == totalPosts / postperpage) {
    totalPages -= 1;
  }
  var endPage = startPage + numshowpage - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
  }
  paginationHtml += "<span class='totalpages'>Page " + postnumber + " of " + totalPages + "</span>";

  var previousPage = parseInt(postnumber) - 1;
  if (postnumber > 1) {
    if (2 == postnumber) {
      if ("page" == type) {
        paginationHtml += '<span class="showpage"><a href="' + home_page + '">' + prevpage + "</a></span>";
      } else {
        paginationHtml += '<span class="pagenumber"><a href="/search/label/' + lblname1 + "?&max-results=" + postperpage + '">' + prevpage + "</a></span>";
      }
    } else {
      if ("page" == type) {
        paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectpage(' + previousPage + ');return false">' + prevpage + "</a></span>";
      } else {
        paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectlabel(' + previousPage + ');return false">' + prevpage + "</a></span>";
      }
    }
  }

  if (startPage > 1) {
    if ("page" == type) {
      paginationHtml += '<span class="pagenumber"><a href="' + home_page + '">1</a></span>';
    } else {
      paginationHtml += '<span class="pagenumber"><a href="/search/label/' + lblname1 + "?&max-results=" + postperpage + '">1</a></span>';
    }
  }

  if (startPage > 2) {
    paginationHtml += "";
  }

  for (var page = startPage; page <= endPage; page++) {
    paginationHtml += (postnumber == page) ? '<span class="current">' + page + "</span>" : (1 == page) ? (("page" == type) ? '<span class="pagenumber"><a href="' + home_page + '">1</a></span>' : '<span class="pagenumber"><a href="/search/label/' + lblname1 + "?&max-results=" + postperpage + '">1</a></span>') : (("page" == type) ? '<span class="pagenumber"><a href="#" onclick="redirectpage(' + page + ');return false">' + page + "</a></span>" : '<span class="pagenumber"><a href="#" onclick="redirectlabel(' + page + ');return false">' + page + "</a></span>");
  }

  if (endPage < totalPages - 1) {
    paginationHtml += "";
  }

  if (endPage < totalPages) {
    if ("page" == type) {
      paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectpage(' + totalPages + ');return false">' + totalPages + "</a></span>";
    } else {
      paginationHtml += '<span class="pagenumber"><a href="#" onclick="redirectlabel(' + totalPages + ');return false">' + totalPages + "</a></span>";
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
        -1 == a.indexOf("&max-results=") && (postperpage1111 = 20),
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

document.querySelector('body').insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://clover4869.github.io/english-listening/css-custom-blogger.css">');