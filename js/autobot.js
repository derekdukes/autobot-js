$( document).ready(function() {
    Decepticon.init();
});

var Decepticon = {};

Decepticon = (function() {

var init,
    addListeners,
    copyOutput,
    resetPage
    ;





    init = function() {
        addListeners();
    };

    addListeners = function() {
        $('#buttonProcess').on('click', function() {
            $(this).blur();
            var inputText = $('#textInput').val();
            var outputText = Decepticon.Dataflow.processText(inputText);
            if (outputText.indexOf('dataflowjavadoc') >= 0) {
                $('#alertInfo').removeClass('hidden');
            }
            $('#textOutput').val(outputText);
        });

        $('#buttonCopy').on('click', function() {
            copyOutput();
            $(this).blur();
            $(this).removeClass('btn-default').addClass('btn-success').attr('disabled','disabled').html('<i class="fa fa-check"></i> Copied!');

        });
        $('#buttonReset').on('click', function() {
            resetPage();
            $(this).blur();
        });


    };

    copyOutput = function() {
        $('#textOutput').select();
        document.execCommand('copy');

       // var copyEvent = new ClipboardEvent('copy', {dataType: 'text/plain', data: textToCopy });
       // document.dispatchEvent(copyEvent);
    };

    resetPage = function() {
        $('#textInput').val('');
        $('#textOutput').val('');
        $('#skippedBlocks').html('');
        $('#panelWarning').addClass('hidden');
        $('#alertInfo').addClass('hidden');
        $('#buttonCopy').addClass('btn-default').removeClass('btn-success').removeAttr('disabled').html('<i class="fa fa-clipboard"></i> Roll Out!');


    };


    return {
        init:init
    };
})();