
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
    $('.change-trigger').popover({
        placement : 'Right',
        title : 'Change',
        trigger : 'click',
        html : true,
        content : function(){
            var content = '';
            content = $('#select-div').html();
            return content;
        } 
    }).on('shown.bs.popover', function(){
    });

    $(document).delegate('.btn-go','click', function(e){
        e.preventDefault();
        alert('Go Click');
    });

    $(document).delegate('.btn-cancel-option', 'click', function(e){
        e.preventDefault();
        var element = $(this).parents('.popover');
        if(element.size()){
            $(element).removeClass('in').addClass('out');
        }
    });
});