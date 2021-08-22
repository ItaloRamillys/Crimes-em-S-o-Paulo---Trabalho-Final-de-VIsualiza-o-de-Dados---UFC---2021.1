var saveBlob;
$( document ).ready(function() {
	var fileList = {};
	
	var _saveBlob = (function () {
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		return function (blob, fileName) {
			var url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = fileName;
			a.click();
			window.URL.revokeObjectURL(url);
		};
	}());
	saveBlob = _saveBlob;

	//Controla o menu hamburguer
	$('#hamb-menu').click(function(e){

		var hamb = $('#main-menu').parent('.sidebar').children('#hamb-menu').children('i');

		if($('#main-menu').css('display') == 'none'){
			$('#main-menu').css('display', 'block');
			hamb.removeClass('fa fa-bars');
			hamb.addClass('fa fa-times');
		}else{
			$('#main-menu').css('display', 'none');
			hamb.removeClass('fa fa-times');
			hamb.addClass('fa fa-bars');
		}
	});

	//Botão Executar
	$('#execute').click(function(e){
		let sel = false;
		$('.btn-metrica').each(function(e){
			if($(this).hasClass('btn-active')){
				sel = true
				$('#msg-output').html('');
				$('#result').css('display', 'block');
				$('#output-'+$(this).val()).css('display', 'block');

				if($(this).val() == 'frequencia')
					initFrequency();
				else if($(this).val() == 'sumarizacao')
					initSummarization();
				else if($(this).val() == 'clusterizacao')
					initClusterization();
				else
					alert('Erro interno. Entre em contato com o administrador do sistema');
					
			}else{
				$('#output-'+$(this).val()).css('display', 'none');
			}
		});

		if(!sel)
			alert('Selecione pelo menos uma métrica');

		$('#modal-load').fadeIn(300);
			
		sel = false;
	});


	/*---------------BOTÃO + e - DAS PALAVRAS MAIS FREQUENTES-------------------*/

	//Controla o botão de -
	$('.minus').click(function(e){
		let v = $(this).data('count');
		let change = $(this).data('change');
		let min = $(this).data('min');
		let elNumber = $(this).prev();
		let elNumberValue = elNumber.val();
		if(elNumberValue != min){
			let newValue = Number(elNumberValue) - v;
			elNumber.val(newValue);

			
			$('#modal-load').delay(50).fadeIn(300);
			
			fullTable(change);

		}
	});

	//Controla o botão de +
	$('.plus').click(function(e){
		let v = $(this).data('count');
		let change = $(this).data('change');
		let elNumber = $(this).prev().prev();
		let elNumberValue = elNumber.val();
		let newValue = Number(elNumberValue) + v;
		elNumber.val(newValue); 

		$('#modal-load').delay(50).fadeIn();
		
		fullTable(change);

		
	});

	//Gerar gráfico de frequencia relativa
	$('.btn-graph').click(function(e){
		$('#modal-load').delay(50).fadeIn();

		let freq_type = $(this).val();
		let n_terms = $('#palavras').val().split(' ')[0];
		generateGraph(freq_type, n_terms);
	});

	//Procura por um termo
	$('#search-term').change(function(e){
		$('#modal-load').delay(50).fadeIn();
		
		let term = $(this).val();
		searchTerm(term);
	});

	//Mostra os campos da metrica selecionada
	$('.btn-metrica').click(function(e){
		var count = 0;
		let metrica = $(this).val();
		let change = $(this).data('change');
		if($('#'+metrica+'-inputs').css('display') == 'none'){
			$('#'+metrica+'-inputs').css('display', 'block');
			$('.msg-metricas').css('display', 'none');
			$('.msg-metricas').css('display', 'none');
			$('.container-inputs-metrica').css('display', 'block');
			$(this).addClass('btn-active');
		}else{
			$('#'+metrica+'-inputs').css('display', 'none');
			$('.box-inputs-metrica').each(function(el){
				if($(this).css('display') == 'none')
					count++;
			});
			
			$(this).removeClass('btn-active');

			if(count == 3){
				$('.container-inputs-metrica').css('display', 'flex');
				$('.msg-metricas').css('display', 'block');
			}
		}

		if($('#output-'+metrica).css('display') == 'block'){
			$('#output-'+metrica).css('display', 'none');
			$('#result').css('display', 'none');
		}

	});

	//Seta o tipo de arquivo para upload
	$('.select-type-file').change(function(e){
		$('#modal-load').delay(50).fadeIn();
		
		let type = $(this).val();
		let metrica = $(this).data('metrica');
		$('.type-file-'+metrica).html(type);
		$('#files-'+metrica).attr('accept', type);
		console.log('#files-'+metrica);
		
		$('#modal-load').delay(500).fadeOut();
	});

	//Reset arquivos
	$('#btn-reset').click(function(e){
		$('#modal-load').delay(50).fadeIn();
		$('#files-frequencia').val(null);
		$.ajax({
	        type:"POST",
	        url:"/reset",
	        //data: JSON.stringify({document_index: index}),
	        dataType: "json",
	        processData: false,
	        contentType: 'application/json',
	        success: function(returnObj, jqXHR) {
	            console.log(returnObj);
	            $('.btn-metrica').each(function(e){
					if($(this).hasClass('btn-active')){
						$('#output-'+$(this).val()).css('display', 'none');
					}
				});

				$('#select-n-file').remove();
				$('#files-name-frequencia').html('');

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
		
	});


	//Escreve o nome dos arquivos selecionados
	$('#files-frequencia').change(function(e) {
		
		var i = 0;
		var files = $('#files-frequencia')[0].files;
		var countFiles = files.length;
		var fileName = "";

		$(files).each(function(e){
		fileName += $('#files-frequencia')[0].files[i].name;
		if(i+1 != countFiles){
			fileName += " <br> ";
		}
		i++;
		});

		$('#files-name-frequencia').html(fileName);
	});


	$('.load-files').click(function(e){
		
		$('#modal-load').delay(50).fadeIn();

		var files;

		$('.btn-metrica').each(function(e){
			if($(this).hasClass('btn-active')){
				var metrica = $(this).val();
				files = $('#files-'+metrica)[0].files;
			}
		});

		var ajaxData = new FormData();

		var n_files = files.length;

		for(let i=0; i < n_files; i++){
		 	ajaxData.append('files', files[i]);
		}

		if(n_files > 0){

			var select_html = "<label>Escolher o arquivo para carregar as métricas</label> <select id='select-n-file'>";

			for (var i = 1; i <= n_files; i++) {
				select_html += "<option value='"+i+"'>"+i+"</option>";
			}

			select_html += "</select>";

			$.ajax({
				type:"POST",
				url:"/load_pdf",
				data: ajaxData,
				processData: false,
				contentType: false,
				success: function(returnObj, jqXHR) {

					console.log(returnObj);
					console.log(jqXHR);

					$('#line-select-file').html(select_html);

					//Trocando valor para selecionar o arquivo
					$('#select-n-file').change(function(e){
						
						let index = Number($(this).val()) - 1;
						$.ajax({
							type:"POST",
							url:"/select_specific_document",
							data: JSON.stringify({document_index: index}),
							dataType: "json",
							processData: false,
							contentType: 'application/json',
							success: function(returnObj, jqXHR) {
								console.log(returnObj);
							},
							error: function (jqXHR, exception) {
								console.log(jqXHR);
								console.log(exception);
								console.log('Erro ao selecionar arquivo para métricas');
							},
						});
					});
					

				},
				error: function (jqXHR, exception) {
					console.log(jqXHR);
					console.log(exception);
					console.log('OH SHIT, HERE WE GO AGAIN');

				},
				complete: function(jqXHR, exception){
					$('#modal-load').fadeOut(500);
				}
				
			});
		}else{
			alert('Selecione pelo menos um arquivo para carregar');
		}
	});

	$( function() {
		$( function() {
			$( "#slider-range-sumarization" ).slider({
				value: 1,
				orientation: "horizontal",
				range: "min",
				max: 5,
				min: 1,
				animate: true,
				slide: function( event, ui ) {
					$( "#frases" ).val( ui.value  + " frases"  );
				}
			});
			
			$( "#frases" ).val( $( "#slider-range-sumarization" ).slider( "value" ) + " frases" );
				
		} );
	});

	$('#btn-download-csv').click(function(e){
		$('#modal-load').delay(50).fadeIn();

		downloadCSV();
	});
});
