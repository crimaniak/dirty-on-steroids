d3.addModule(
{
	type: "Социализм",
	name: '(Gold d3) Узнать немного нового о себе',
	author: 'bearoff',
	config: {active:{type:'checkbox',value:false, description:'Позволяет просмотреть все комментарии о вас от других пользователей (если у вас есть Gold d3 - появится ссылка "Читать всё")'}
			},
    threshold: 0,
    variant: ['d3.ru'],
    notes_array:[],
    current_note : '',
    started : false,
    timeout: null,
    user_id: 0,
    run: function() {
        if (!d3.page.my || !$j("#js-dudenote").length || typeof userProfileHandler === "undefined" || !userProfileHandler.showRandomNote) {
            return false;
        }

        this.user_id = $j(".b-top_panel_user_menu .c_user").data('user_id');
        if (!this.user_id) {
            return false;
        }

        this.showButton();
    },

    showButton: function() {
        var me = this;
        var link = $j("<span>&nbsp;&nbsp;</span><a href='#' id='ftay_get_all_notes'>Читать всё (SP)</a>").click(function(){me.getAllNotes();});
        $j("#js-dudenote a").after(link);
    },
    getAllNotes: function() {
        if (this.started) {
            clearTimeout(this.timeout);
            $j("#ftay_notes_list").remove();
            this.started = false;
            this.notes_array = [];
            this.current_note = '';
            return;
        }
        this.started = true;
        var div = $j("<div id='ftay_notes_div'><div id='ftay_waiting'>... working ...</div></div>");
        $j(".b-user_data").append(div);
        div.css({width: "80%", margin: "30px auto", padding: "20px", border: "1px solid black"});
        $j("#ftay_waiting").css({width: "50%", margin: "0px auto 10px", "text-align" : "center"});
        this.requestNextNote();
    },
    requestNextNote: function() {
        userProfileHandler.showRandomNote(this.user_id);
        var me = this;
        this.timeout = setTimeout(function(){me.addNoteIfNew();}, 200);
    },
    addNoteIfNew: function() {
        if (!$j("#js-dudenote em").length) {
            var me = this;
            this.timeout = setTimeout(function(){me.addNoteIfNew();}, 200);
            return;
        }

        var note = $j("#js-dudenote em").text();
        if (note === this.current_note) {
            this.requestNextNote();
            return;
        }

        this.current_note = note;
        var exist = false;
        for (var i = 0; i <= this.notes_array.length; i++) {
            if (this.notes_array[i] === note) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            this.notes_array.push(note);
            var new_note = $j("<div class='ftay_note_div' style='display:none'></div>").text(note);
            $j("#ftay_waiting").after(new_note);
            new_note.fadeIn();
        }
        this.requestNextNote();
    },
});
