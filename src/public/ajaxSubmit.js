$(document).ready(function () {

  
  $("input.typeahead").typeahead({
    header: "Your Events",
    source: function (query, process) {
      return $.getJSON(
        "/searchUser",
        {
          query: query,
        },
        function (data) {
          process(data);
        }
      );
    },
    displayText: function (item) {
      console.log(item.profileNum);
      return ` <div class="ProfileCard u-cf typeahead-menu typeahead-suggestion typeahead-selectable">
       <div class="profile profile-${item.profileNum}">
        <h3 class="profile-tag">${item.username.substring(0, 2)}</h3>
       </div>
      <div class="ProfileCard-details">
      
      <div class="ProfileCard-screenName">@${item.username}</div>
    </div>
    </div>`;
    },
    highlighter: function (item) {
      return '<div class="p-3 rounded m-2">' + item + "</div>";
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
      $("#receiverId").val(item._id);
      console.log(item.username);
      $("#form_search").submit();
    },
    items: 20,
    minLength: 1,
    matcher: function (item) {
      return item;
    },
  });

  //user detail popover 

  $(document).on("mouseover", ".user-popover", function (e) {
    var el = $(this);
    e.preventDefault(e);
    var timeoutId = setTimeout(function () {
      $.ajaxSetup({
        header: $('meta[name="_token"]').attr("content"),
      });

      var id = el.attr("id");
      var dummyVar = id.split("-");
      var user_id = dummyVar[1];
      console.log(user_id);
      $.ajax({
        type: "PUT",
        url: "/user-detail",
        data: {
          userId: user_id,
        },
        dataType: "json",
        success: function (data) {
          console.log(data);
          $("#" + id).webuiPopover({
            content: data,
            animation: "pop",
            trigger: "hover",
            placement: "auto",
            delay: {
              show: null,
              hide: 300,
            },
          });
          $("#" + id).webuiPopover("show");
        },
        error: function (data) {
          console.log(data);
        }
      });
    }, 2000);
    el.mouseleave(function () {
      clearTimeout(timeoutId);
    });
  });
});
