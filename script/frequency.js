let initFrequency = () => {

    fullTable('tabela-palavras-frequentes');

    $.ajax({
        type:"GET",
        url:"/get_n_terms",
        //data: JSON.stringify({document_index: index}),
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            $( function() {
                $( "#slider-range-frequency" ).slider({
                    value: 1,
                    orientation: "horizontal",
                    range: "min",
                    max: returnObj['n_terms'],
                    min: 1,
                    animate: true,
                    slide: function( event, ui ) {
                    $( "#palavras" ).val( ui.value  + " palavras"  );
                    }
                });
                
                $( "#palavras" ).val( $( "#slider-range-frequency" ).slider( "value" ) + " palavras" );
                    
            } );
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

let calculateFrequencies = () => {

    $.ajax({
        type:"POST",
        url:"/all_term_absolute_frequency",
        data: JSON.stringify({max_x_labels: 10}),
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            console.log(returnObj);
            console.log(jqXHR);
        },
        error: function (jqXHR, exception) {
            console.log('Erro: ' + exception);
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }
    });
}

let fullTable = (change_p) => {
    let change = change_p;
    let newValue = $('#word_n').val();
    $.ajax({
        type:"POST",
        url:"/full_table_frequency",
        data: JSON.stringify({n_samples: newValue}),
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            console.log(returnObj);
            console.log(jqXHR);
            if(change == 'tabela-palavras-frequentes'){
                var result = "";
                for(var i = 0; i < newValue; i++){

                    result += "<tr>";
                    result += "<th scope='column' class=''>"+(i+1)+"</th>";
                    result += "<td>"+ returnObj[i]['Palavra'] +"</td>";
                    result += "<td>"+ returnObj[i]['Freq. Absoluta'] +"</td>";
                    result += "<td>"+ returnObj[i]['Freq. Relativa'] +"</td>";
                    result += "<td>"+ returnObj[i]['DF'] +"</td>";
                    result += "<td>"+ returnObj[i]['IDF'] +"</td>";
                    result += "<td>"+ returnObj[i]['TF-IDF'] +"</td>";
                    result += "</tr>";

                }
                
                $('#tabela-palavras-frequentes').html(result);
            }
        },
        error: function (jqXHR, exception) {
            console.log('Erro: ' + exception);
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }
    });
}

let selectFile = (file_n) => {
    $.ajax({
        type:"GET",
        url:"/get_samples?n_samples="+newValue,
        //data: JSON.stringify({max_x_labels: 10}),
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            console.log(returnObj);
            console.log(jqXHR);
           
        },
        error: function (jqXHR, exception) {
            console.log('Erro: ' + exception);
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }
    });
}

let generateGraph = (freq_type, n_terms) => {
    $.ajax({
        type:"POST",
        url:"/plot_frequency",
        data: JSON.stringify({freq_type: freq_type, n_terms: n_terms}),
        dataType: "text",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            $('#graph-'+ freq_type +'-frequency').html('')
            $('#graph-'+ freq_type +'-frequency').append('<img style="max-width: 100%;" src="data:image/png;base64,' + returnObj + '"/>')
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            console.log('Erro ao gerar o gráfico');
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }
    });
}

let searchTerm = (term) => {
    $.ajax({
        type:"POST",
        url:"/metrics_by_term",
        data: JSON.stringify({term: term}),
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        success: function(returnObj, jqXHR) {
            
            console.log(returnObj);
            var result = "";
            for(let i=0; i < returnObj.length; i++) {
                result += "<tr>";
                result += "<th scope='column' class=''>"+(i+1)+"</th>";
                result += "<td>"+ returnObj[i]['Palavra'] +"</td>";
                result += "<td>"+ returnObj[i]['Freq. Absoluta'] +"</td>";
                result += "<td>"+ returnObj[i]['Freq. Relativa'] +"</td>";
                result += "<td>"+ returnObj[i]['DF'] +"</td>";
                result += "<td>"+ returnObj[i]['IDF'] +"</td>";
                result += "<td>"+ returnObj[i]['TF-IDF'] +"</td>";
                result += "</tr>";
            }
            
            $('#tabela-termo').html(result);

        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            console.log('Erro ao gerar o gráfico do termo');
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }
    });

}

let downloadCSV = () => {
    $.ajax({
        type:"GET",
        url:"/download_csv",
        cache: false,
        processData: false,
        success: function(returnObj, jqXHR) {

            var blob = new Blob([returnObj], { type: "application/octetstream" });
            saveBlob(blob, 'df.csv');            
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            console.log('Erro ao gerar o gráfico do termo');
        },
        complete: function(jqXHR, exception){
            $('#modal-load').fadeOut(500);
        }
    });
}