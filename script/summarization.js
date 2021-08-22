let initSummarization = () => {
    var html_n_sentences = $('#frases').val();
    var split_n_sentences = html_n_sentences.split(' ');
    var n_sentences = Number(split_n_sentences[0]);
    $.ajax({
        type:"POST",
        url:"/summarization",
        data: JSON.stringify({sentences_number: n_sentences}),
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            var result = returnObj['summary_sentences'];

            var cmp_html = "";

            for (let i = 0; i < result.length; i++) {
                cmp_html += "<div class='line my-3'>"+result[i]+"</div><hr>";
            }

            $('#output-sumarizacao').html_n_sentences(cmp_html);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            console.log('Erro ao resetar');
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }

    });
}