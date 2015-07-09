Decepticon = Decepticon || {};

Decepticon.Dataflow = (function() {
   var processText,
       processBlock,
       addToSkippedBlocks,
       skippedBlocks = '',
       cleanUpParams,
       escapeRegExp;




    processText = function(inputText) {
        var splitText,
            inBlock = false,
            lastLine = false,
            currentBlock = '',
            processedBlock = '',
            outputText = '';
        inputText = inputText.replace(/<em>/g,'');
        inputText = inputText.replace(/<\/em>/g,'');
        inputText = inputText.replace(/<span class="confluence-link">/g,'');
        inputText = inputText.replace(/<span>/g,'');
        inputText = inputText.replace(/<\/span>/g,'');
        inputText = inputText.replace(/<span style="color: rgb(0,0,0);">/g,'');
        inputText = inputText.replace(/<span style="font-size: 12.0pt;line-height: 16.0pt;">/g,'');
        splitText = inputText.split('\n');
        $.each(splitText, function(index,value) {
            if(inBlock === false) {
                currentBlock = '';
                lastLine = false;
                if(value.indexOf('<ac:link>') >= 0 ) {
                    //start new block on match of opening tag
                    inBlock = true;
                    currentBlock = value;
                } else {
                    outputText += value;
                    outputText += "\n";
                }
            } else {
                //continue processing block
                currentBlock += value;
                if(lastLine === true) {
                    inBlock = false;
                    if(currentBlock.indexOf('ri:page') >= 0 && currentBlock.indexOf('plain-text-link-body') >= 0) {
                        addToSkippedBlocks(index,currentBlock);
                        processedBlock = currentBlock;
                    } else {
                        processedBlock = processBlock(currentBlock);
                    }
                    outputText += processedBlock;
                    outputText += "\n";
                } else if (value.indexOf('</ac:link>') >= 0 && value.indexOf('<ac:link>') < 0 ) {
                    //next time through the loop will be the last
                    lastLine = true;
                }
            }



        });

        return outputText;
    };

    addToSkippedBlocks = function(blockIndex,blockText) {
        $('#panelWarning').removeClass('hidden');
        $('#skippedBlocks').append('<li>Block skipped around line ' + blockIndex + '<br><em>' + blockText + '</em></li>');
    };

    processBlock = function(textBlock) {
        //If this text isn't present, then kick back the block
        if (textBlock.indexOf('dataflowjavadoc') < 0) {
            return textBlock;
        }

        //remove extra spaces between tags
        var regexp = new RegExp(/\>\s+\</g);
        textBlock = textBlock.replace(regexp,"><");

       // console.log(textBlock);
        //set up before and after string arrays
        //before[0] will change to after[0] and so on
        var before = [],
            after = [];
        before[0] = "<ac:link><ri:shortcut ri:key=\"dataflowjavadoc\" ri:parameter=\"";
        after[0] = "<ac:structured-macro ac:name=\"dataflow-javadoc-link\"><ac:parameter ac:name=\"0\">";
        before[1] = "\"/><ac:plain-text-link-body><![CDATA[";
        after[1] = "</ac:parameter><ac:parameter ac:name=\"1\">";
        before[2] = "]]></ac:plain-text-link-body></ac:link>";
        after[2] = "</ac:parameter></ac:structured-macro>";
        before[3] = "<ac:link><ri:shortcut ri:key=\"dataflowjavadoc\" ri:parameter=\"";
        after[3] = "<ac:structured-macro ac:name=\"dataflow-javadoc-link\"><ac:parameter ac:name=\"0\">";
        before[4] = "\"/><ac:link-body>";
        after[4] = "</ac:parameter><ac:parameter ac:name=\"1\">";
        before[5] = "</ac:link-body></ac:link>";
        after[5] = "</ac:parameter></ac:structured-macro>";
        before[6] = "<span class=\"confluence-link\">";
        after[6] = "";
        before[7] = "</span>";
        after[7] = "";

        //now loop through and do the replacements
        var numLoops = before.length,
            re;

        for (var i = 0; i < numLoops; i++) {
            re = new RegExp(escapeRegExp(before[i]),'g');
            textBlock = textBlock.replace(re,after[i]);
        }
       /* regexp = RegExp(/>\s+/g);
        textBlock = textBlock.replace(regexp,">");
        regexp = RegExp(/\s+</g);
        textBlock = textBlock.replace(regexp," <"); */
        //console.log(textBlock);
        textBlock = cleanUpParams(textBlock);
        return textBlock;
    };

    cleanUpParams = function(textBlock) {
        var regexp = new RegExp(/ac:name="1">\s+/g);
        textBlock = textBlock.replace(regexp,'ac:name="1">');
        regexp = new RegExp(/\s+<\/ac:parameter/g);
        textBlock = textBlock.replace(regexp,'</ac:parameter');
        return textBlock;
    };

    escapeRegExp = function(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };


    return {
        processText:processText,
        skippedBlocks:skippedBlocks
    };
})();
