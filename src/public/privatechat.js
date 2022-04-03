$(document).ready(function () {
  $("#message").keypress(function (e) {
    if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
    
        $(this).closest("form").submit();
    }
});
  var socket = io();

  var parameOne = $.deparam(window.location.pathname);
  var newParam = parameOne.split("-");

  var username = newParam[0];

  $("#receiver_name").text("@" + username);
  swap(newParam, 0, 1);
  var parameTwo = newParam[0] + "-" + newParam[1];

  socket.on("connect", function () {
    var params = {
      room1: parameOne,
      room2: parameTwo,
    };
    socket.emit("join chat", params);
    socket.on("message display", function () {
      $("#reload").load(location.href + " #reload");
    });
  });

  socket.on("new message", function (data) {
    // var template = $("#message-template").html();
    // var message = Mustache.render(template, {
    //   text: data.text,
    //   sender: data.sender
    // });
    var senderId = $("#user_id").val();
    if(senderId== data.senderId){
      var message=` <li class="clearfix">
      <div class="message-data align-right">
        <span class="message-data-time">${moment().calendar()}</span> &nbsp;
        &nbsp;
        <span class="message-data-name"
          >${data.sender}</span>
        <i class="fa fa-circle me"></i>
      </div>
      <div class="message other-message float-right">
        ${data.text}
      </div>
    </li>`
    }
    else{
      var message=` <li>
      <div class="message-data">
        <span class="message-data-name"
          ><i class="fa fa-circle online"></i> 
          ${data.sender}</span
        >
        <span class="message-data-time">${moment().calendar()}</span>
      </div>
      <div class="message my-message">${data.text}</div>
    </li>`
    }
    $("#messages").append(message);
  });

  $("#message_form").on("submit", function (e) {
    e.preventDefault();
    var msg = $("#message").val();
    var sender = $("#user_name").val();
    var senderId = $("#user_id").val();
    if (msg.trim().length > 0) {
      socket.emit(
        "private message",
        {
          text: msg,
          sender: sender,
          senderId:senderId,
          room: parameOne,
        },
        function () {
          $("#message").val("");
        }
      );

      $.ajax({
        url: "/chat/" + parameOne,
        type: "POST",
        data: {
          message: msg,
        },
        success: function (data) {
          $("#message").val("");
        },
      });
    }
  });
});

function swap(input, value_1, value_2) {
  var temp = input[value_1];
  input[value_1] = input[value_2];
  input[value_2] = temp;
}
