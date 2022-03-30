$(document).ready(function () {

    
  $("input.typeahead").typeahead({
    header: "Your Events",
    source: function (query, process) {
      return $.getJSON(
        "/search",
        {
          query: query,
        },
        function (data) {
          // console.log(data);
          process(data);
        }
      );
    },
    displayText: function (item) {
      return `<div class="Typeahead-menu">
      <div class="tt-dataset tt-dataset-0">
      <div class="ProfileCard u-cf Typeahead-suggestion Typeahead-selectable">
      <img class="ProfileCard-avatar" src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png">

      <div class="ProfileCard-details">
        <div class="ProfileCard-realName">${item.name}  @${item.username}</div>
        <div class="ProfileCard-screenName">@typeaheadd7f2s</div>
        <div class="ProfileCard-description"></div>
      </div>

      <div class="ProfileCard-stats">
        <div class="ProfileCard-stat"><span class="ProfileCard-stat-label">Tweets:</span> 0</div>
        <div class="ProfileCard-stat"><span class="ProfileCard-stat-label">Following:</span> 26</div>
        <div class="ProfileCard-stat"><span class="ProfileCard-stat-label">Followers:</span> 4</div>
      </div>
    </div>
      </div></div>`;
    },
    highlighter: function (item) {
      return '<div class="p-4 rounded m-4">' + item + "</div>";
    },
    matcher: function (item) {
      if (
        item.username.toLowerCase().indexOf(this.query.trim().toLowerCase()) !=
        -1
      ) {
        return true;
      }
    },
    sorter: function (items) {
      return items; //items.sort();
    },
    afterSelect: function (item) {
      this.$element[0].value = item.username;
      console.log(item.username);
      $("#form_search").submit();
    },
    items: 20,
    minLength: 1,
    matcher: function (item) {
      return item;
    },
  });
});
