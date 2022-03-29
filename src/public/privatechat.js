$(document).ready(function(){
    var socket = io();

    var parameOne = $.deparam(window.location.pathname);
    var newParam= parameOne.split('-');

    var username=newParam[0];

    $("#receiver_name").text('@'+username);
    swap(newParam, 0,1);
    var parameTwo=newParam[0]+'-'+newParam[1];

    socket.on('connect',function(){
        var params={
            room1:parameOne,
            room2:parameTwo
        }
        socket.emit('join chat',params);
    });

    socket.on("new message",function(data){
        var template = $("#message-template").html();
        var message=Mustache.render(template,{
            text:data.text,
            sender:data.sender
        });
        $("#messages").append(message);
    })

    $("#message_form").on("submit",function(e){
        e.preventDefault();
        var msg = $("#message").val();
        var sender=$("#user_name").val();

        if(msg.trim().length>0){
            socket.emit("private message",{
                text:msg,
                sender:sender,
                room:parameOne,
            },function(){
                $("#message").val("");
            });
            
            $.ajax({
                url:"/chat/"+parameOne,
                type:"POST",
                // contentType : "application/json",
                data:{
                    message:msg,
                },
                success:function(data){
                     $("#message").val('');
                }
            });
        }
    })
});

function swap(input ,value_1,value_2){
    var temp = input[value_1];
    input[value_1]= input[value_2];
    input[value_2]=temp;
}