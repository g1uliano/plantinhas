 var app = {
    cards: [],    
    target: 0,
    editMode: false,
    init: function () {
        document.addEventListener("deviceready", app.onDeviceReady, false);
    },
    loadDatabase: function () {
        try {
            app.cards = app.utils.get('cards');
        } catch (e) {
            app.cards = [];
        }
    },
    onDeviceReady: function () {
        //para viabilizar a prototipação rápida foi necessário desativar 
        //alguns recursos on-the-fly quando este estiver rodando no navegador.
        app.loadDatabase();
        app.main(); //inicia o processo principal
    },
    DoUWRlyDel: function(buttonIndex) {        
        if (buttonIndex === 1) {
            app.cards.splice(app.target, 1);
            app.utils.set('cards',app.cards);  
            app.mainBuilder();             
        }
    },
    mainBuilder: function () { 
        if (app.utils.isEmpty(app.cards)) {
            $("#cards-aviso").show();
            $("#cards-main").hide();
        } else {
            app.loadDatabase();
            $("#cards-aviso").hide();
            $("#cards-main").show();
            html = '';
            for (i = 0; i < app.cards.length; i++) {
                html +=  '<div class="card">';
                html += '<div class="card-body">';
                html += '<h5 class="card-title">'+app.cards[i].plantaNome+'</h5>';
    
                html += '<p class="card-text"></p>';
                html += '<button value="e:'+i+'" class="btn btn-success">Editar</button> ';
                html += '<button value="x:'+i+'" class="btn btn-danger">Excluir</button>';
                html += '</div>';
                html += '</div>';
            }
            $("#cards-main").html(html);
            
    
            /*         
                  
        <img class="card-img-top" src="temp/beneficios-do-cha-de-boldo_40720_l.jpg" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">Boldo</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-success">Editar</a>
          <a href="#" class="btn btn-danger">Excluir</a>
        </div>
      </div>
            */
        }
    },
    main: function() {
        $('form').submit(function (evt) { 
            //não queremos o comportamento padrão do formulário não é mesmo?
            evt.preventDefault();
            window.history.back();
        });
        //https://github.com/katzer/cordova-plugin-local-notifications
        $("#cards-form-1").hide();

        app.mainBuilder();
        
        //ações dinâmicas
        $("#cards-main").off().on("click", "button", function () {
            target = $(this).val();
            target = target.split(":")
            action = target[0]
            target = target[1]
            app.target = target
            if (action === 'e') {
                app.editMode = true;
                $("#cards-aviso").hide();
                $("#cards-form-1").show();
                $("#cards-main").hide();
                $("#plantName1").val(app.cards[target].plantaNome);
                $("#freq-a").val(app.cards[target].freq_A);
                $("#freq-b").val(app.cards[target].freq_B);
                $("#freq-c").val(app.cards[target].freq_C);                
            } else {
                navigator.notification.confirm(
                    'Você deseja realmente excluir esta planta?', // message
                     app.DoUWRlyDel,            // callback to invoke with index of button pressed
                    'Excluir',           // title
                    ['Sim','Cancelar']     // buttonLabels
                );
            }
        });

        $('#plantName1').autocomplete({
            source: listaPlantas,
            highlightClass: 'text-danger',
            treshold: 2,
        });
        
        $("#add-plant").click(function() {
            $("#cards-aviso").hide();
            $("#cards-form-1").show();
            $("#cards-main").hide()
        })
        $("#form-1-cancel").click(function() {
            $("#cards-form-1").hide();//
            app.mainBuilder();
        });

        $("#form-1-submit").click(function() {           
            data = {
                plantaNome: $("#plantName1").val(),
                freq_A: $("#freq-a").val(),
                freq_B: $("#freq-b").val(),
                freq_C: $("#freq-c").val()
            }
            if (data.plantaNome.length === 0) {
                $("#plantName1").focus();
            } else {
                // caso tenha necessidade de buscar elementos no vetor
                // favor otimizar isso, seu merda.                
                search = false;
                try {
                    for (i = 0; i < app.cards.length; i++) {
                        if (app.cards[i].plantaNome === data.plantaNome) {
                            if (!app.editMode) {
                                search = true;
                                break
                            } else {
                                if (i != app.target) {
                                    search = true;
                                    break
                                }
                            }                            
                        }
                    }
                } catch (e) {}

                if (search) {
                    $("#plantName1").focus();
                    app.utils.alert($("#plantName1").val()+' já existe.')
                } else {
                    if (app.editMode) {
                        app.cards[app.target].plantaNome = $("#plantName1").val();
                        app.cards[app.target].freq_A = $("#freq-a").val();
                        app.cards[app.target].freq_B = $("#freq-b").val();
                        app.cards[app.target].freq_C = $("#freq-c").val();
                        app.editMode = false;
                    } else {
                        app.cards.push(data); 
                    }
                    app.utils.set('cards',app.cards);                   
                    $("#cards-form-1").hide();
                    app.mainBuilder();
                    $('form').trigger("reset"); //limpa o formulário
                }
            }
        });

    }
}

app.utils = {
    isEmpty: function (arr) {
        return ((arr.length === 0) && Array.isArray (arr));
    },
    alert: function (msg) {
        try {
            navigator.notification.alert(
                msg,  // message
                null,         // callback
                'Alerta',            // title
                'OK'                  // buttonName
            );
        } catch (e) {
            window.alert(msg);
        }
    },
    get: function (x) {
        x = window.localStorage.getItem(x);
        return JSON.parse(x);
    },
    set: function (x, y) {
        y = JSON.stringify(y);
        window.localStorage.setItem(x, y);
    },
    del: function (x) {
        window.localStorage.removeItem(x);
    }

}

$(document).ready(app.init); //inicia o app
