var parserColors = [];

var parserTags = {
	'b': {
		openTag: function(params,content) {
			return '<b>';
		},
		closeTag: function(params,content) {
			return '</b>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'code': {
		openTag: function(params,content) {
			return '<div class="codeblock"><div class="title">'+rns_code_lang+'<br></div><div class="body" dir="ltr"><code>';
		},
		closeTag: function(params,content) {
			return '</code></div></div></div>';
		},
		content: function(params,content) {
			return content.trim();
		},
		noParse: true
	},
	'php': {
		openTag: function(params,content) {
			return '<div class="codeblock phpcodeblock"><div class="title">'+rns_php_lang+'<br></div><div class="body"><div dir="ltr"><code><span style="color: #0000BB">';
		},
		closeTag: function(params,content) {
			return '</span></code></div></div></div>';
		},
		content: function(params,content) {
			return content.trim();
		},
		noParse: true
	},
	'spoiler': {
		openTag: function(params,content) {
			return "<tag><div style=\"margin: 5px\"><div style=\"font-size:11px; border-radius: 3px 3px 0 0 ; padding: 4px; background: #f5f5f5;border:1px solid #ccc;font-weight:bold;color:#000;text-shadow:none; \">"+rns_spo_lan+":&nbsp;&nbsp;<input type=\"button\" onclick=\"if (this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != '') { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = '';this.innerText = ''; this.value = '"+rns_hide_lan+"'; } else { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none'; this.innerText = ''; this.value = '"+rns_show_lan+"'; }\" style=\"font-size: 9px;\" value=\""+rns_show_lan+"\"></div><div><div style=\"border:1px solid #ccc; border-radius: 0 0 3px 3px; border-top: none; padding: 4px;display: none;\">";
		},
		closeTag: function(params,content) {
			return '</code></div></div>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'color': {
		openTag: function(params,content) {
			return '<span style="color:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	"email": {
		openTag: function(params,content) {

			var myEmail;

			if (!params) {
				myEmail = content.replace(/<.*?>/g,"");
			} else {
				myEmail = params.substr(1);
			}

			emailPattern.lastIndex = 0;
			if ( !emailPattern.test( myEmail ) ) {
				return '<a>';
			}

			return '<a href="mailto:' + myEmail + '">';
		},
		closeTag: function(params,content) {
			return '</a>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'i': {
		openTag: function(params,content) {
			return '<i>';
		},
		closeTag: function(params,content) {
			return '</i>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'img': {
		openTag: function(params,content) {

			var myUrl = content;

			BBCodeParser.urlPattern.lastIndex = 0;
			if ( !BBCodeParser.urlPattern.test( myUrl ) ) {
				myUrl = "";
			}

			return '<img class="bbCodeImage" src="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '';
		},
		content: function(params,content) {
			return '';
		}
	},
	'list': {
		openTag: function(params,content) {
			if(params=='1') {
				return '<ol type="1">';
			}
			else {
				return '<ul>';
			}
		},
		closeTag: function(params,content) {
			if(params=='1') {
				return '</ol>';
			}
			else {
				return '</ul>';
			}
		},
		restrictChildrenTo: ["*", "li"]
	},
	'quote': {
		openTag: function(params,content) {
			if(params){
				return '<blockquote><cite>'+params+' '+rns_wrote_lang+'</cite>';
			}
			else {
				return '<blockquote><cite>'+rns_quote_lang+'</cite>';
			}
		},
		closeTag: function(params,content) {
			return '</blockquote>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	's': {
		openTag: function(params,content) {
			return '<s>';
		},
		closeTag: function(params,content) {
			return '</s>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'size': {
		openTag: function(params,content) {
			return '<span style="font-size:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'font': {
		openTag: function(params,content) {
			return '<span style="font-family:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'align': {
		openTag: function(params,content) {
			return '<div style="text-align:' + params + '">';
		},
		closeTag: function(params,content) {
			return '</div>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'u': {
		openTag: function(params,content) {
			return '<span style="text-decoration:underline">';
		},
		closeTag: function(params,content) {
			return '</span>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'url': {
		openTag: function(params,content) {

			var myUrl;

			if (!params) {
				myUrl = content.replace(/<.*?>/g,"");
			} else {
				myUrl = params;
			}

			return '<a href="' + myUrl + '">';
		},
		closeTag: function(params,content) {
			return '</a>';
		},
		content: function(params,content) {
			return content.trim();
		}
	},
	'video': {
		openTag: function(params,content) {
			link = content.trim();
			var	vd_matches, vd_url, vd_size;
			switch(params)
			{
				case 'dailymotion':
					vd_matches = link.match(/dailymotion\.com\/video\/([^_]+)/);
					vd_url	   = vd_matches ? 'http://www.dailymotion.com/embed/video/' + vd_matches[1] : false;
					vd_size = 'width="480" height="270"';
					break;
				case 'facebook':
					vd_matches = link.match(/facebook\.com\/(?:photo.php\?v=|video\/video.php\?v=|video\/embed\?video_id=|v\/?)(\d+)/);
					vd_url	   = vd_matches ? 'https://www.facebook.com/video/embed?video_id=' + vd_matches[1] : false;
					vd_size = 'width="625" height="350"';
					break;
				case 'liveleak':
					vd_matches = link.match(/liveleak\.com\/(?:view\?i=)([^\/]+)/);
					vd_url	   = vd_matches ? 'http://www.liveleak.com/ll_embed?i=' + vd_matches[1] : false;
					vd_size = 'width="500" height="300"';
					break;
				case 'metacafe':
					vd_matches = link.match(/metacafe\.com\/watch\/([^\/]+)/);
					vd_url	   = vd_matches ? 'http://www.metacafe.com/embed/' + vd_matches[1] : false;
					vd_size = 'width="440" height="248"';
					break;
				case 'veoh':
					vd_matches = link.match(/veoh\.com\/watch\/([^\/]+)/);
					vd_url	   = vd_matches ? '//www.veoh.com/swf/webplayer/WebPlayer.swf?videoAutoPlay=0&permalinkId=' + vd_matches[1] : false;
					vd_size = 'width="410" height="341"';
					break;
				case 'vimeo':
					vd_matches = link.match(/vimeo.com\/(\d+)($|\/)/);
					vd_url	   = vd_matches ? '//player.vimeo.com/video/' + vd_matches[1] : false;
					vd_size = 'width="500" height="281"';
					break;
				case 'youtube':
					vd_matches = link.match(/(?:v=|v\/|embed\/|youtu\.be\/)(.{11})/);
					vd_url	   = vd_matches ? '//www.youtube.com/embed/' + vd_matches[1] : false;
					vd_size = 'width="560" height="315"';
					break;
			};
			return '<iframe '+vd_size+' src='+vd_url+'>';
		},
		closeTag: function(params,content) {
			return '</iframe>';
		},
		content: function(params,content) {
			return '';
		}
	},
};

/**
 * Rin Shoutbox
 * https://github.com/martec
 *
 * Copyright (C) 2015-2015, Martec
 *
 * Rin Shoutbox is licensed under the GPL Version 3, 29 June 2007 license:
 *	http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Rin Shoutbox - Firebase Shoutbox for Mybb
 * @author Martec
 * @requires jQuery, Firebase, Mybb
 * @credits sound file by http://community.mybb.com/user-70405.html
 */

function rinnews_connect() {
	$.ajax({
		type: 'POST',
		url: 'xmlhttp.php?action=rinnews_gettoken&my_post_key='+my_post_key
	}).done(function (result) {
		var IS_JSON = true;
		try {
			var json = $.parseJSON(result);
		}
		catch(err) {
			IS_JSON = false;
		}
		if (IS_JSON) {
			rns_connect_token(JSON.parse(result).token, JSON.parse(result).url);
		}
		else {
			if(typeof result == 'object')
			{
				if(result.hasOwnProperty("errors"))
				{
					$.each(result.errors, function(i, message)
					{
						if(!$('#er_others').length) {
							$('<div/>', { id: 'er_others', class: 'top-right' }).appendTo('body');
						}
						setTimeout(function() {
							$('#er_others').jGrowl(message, { life: 1500 });
						},200);
					});
				}
				if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			}
			else {
				return result;
			}
		}
	});
};

function rns_connect_token(token, url) {
	var ref = new Firebase(url);
	ref.authWithCustomToken(token, function(error, authData) {
		if (error) {
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			if(!$('#inv_alert').length) {
				$('<div/>', { id: 'inv_alert', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#inv_alert').jGrowl('Invalid Token', { life: 1500 });
			},200);
		}
		else {
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			rinnews(authData.auth);
		}
	});
}

rns_avt_dime_spli = rns_avt_dime.split("x");
var newscont = 0,
rns_avt_width = rns_avt_dime_spli[0],
rns_avt_height = rns_avt_dime_spli[1];

function rinnews(authData) {

	var timenews,
	rn_set_old = '1',
	rn_set_new = '1',
	rn_set_mya = '1',
	rn_set_post = '1',
	rn_set_jgrowl = '1',
	rn_set_id = '',
	rn_set_ls = JSON.parse(localStorage.getItem('rn_set')),
	newnews = new Firebase(''+authData.url+'/newnews'),
	newmyalert = new Firebase(''+authData.url+'/newmyalert');

	if (rns_zone_crrect=='1') {
		rns_zone++;
	}

	if (rn_set_ls) {
		rn_set_old = rn_set_ls['old'];
		rn_set_new = rn_set_ls['new'];
		rn_set_jgrowl = rn_set_ls['jgrowl'];
		if (rn_set_ls['mya']!=undefined) {
			rn_set_mya = rn_set_ls['mya'];
		}
		if (rn_set_ls['pos']!=undefined) {
			rn_set_post = rn_set_ls['pos'];
		}
		if (rn_set_ls['id']!=undefined) {
			rn_set_id = rn_set_ls['id'];
		}
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#rns_opt', function (e) {
		e.preventDefault();
		$(".rinnews_popup").hide();
		rns_myal_sett = rns_npost_sett = '';
		if(parseInt(rns_myalerts)) {
			rns_myal_sett = '<tr><td class="trow1" width="40%"><strong>'+rns_lmyalertsnews_lang+'</strong></td><td class="trow1" width="60%"><select id="rns_new_lmyal"><option value="1">'+rns_yes_lan+'</option><option value="0">'+rns_no_lan+'</option></select></td></tr>';
		}
		if(parseInt(rns_newpost)) {
			rns_npost_sett = '<tr><td class="trow1" width="40%"><strong>'+rns_lnewpost_lang+'</strong></td><td class="trow1" width="60%"><select id="rns_new_lpost"><option value="1">'+rns_yes_lan+'</option><option value="0">'+rns_no_lan+'</option></select></td></tr><tr><td class="trow1" width="40%"><strong>'+rns_idign_lang+'</strong></td><td class="trow1" width="60%"><input type="text" name="tid_ig_inp" id="tid_ig_inp" autocomplete="off"></td></tr>';
		}
		$('body').append( '<div id="rns_conf"><table border="0" cellspacing="0" cellpadding="5" class="tborder"><tr><td class="thead" colspan="2"><strong>'+rns_sett_lang+'</strong></td></tr><tr><td class="trow1" width="40%"><strong>'+rns_loldnews_lang+'</strong></td><td class="trow1" width="60%"><select id="rns_old_lnews"><option value="1">'+rns_yes_lan+'</option><option value="0">'+rns_no_lan+'</option></select></td></tr><tr><td class="trow1" width="40%"><strong>'+rns_lnewnews_lang+'</strong></td><td class="trow1" width="60%"><select id="rns_new_lnews"><option value="1">'+rns_yes_lan+'</option><option value="0">'+rns_no_lan+'</option></select></td></tr><tr><td class="trow1" width="40%"><strong>'+rns_jgrowl_lang+'</strong></td><td class="trow1" width="60%"><select id="rns_jgrowl"><option value="1">'+rns_yes_lan+'</option><option value="0">'+rns_no_lan+'</option></select></td></tr>'+rns_myal_sett+rns_npost_sett+'</table><br /><div align="center"><button id="rns_update">'+rns_updset_lang+'</button></div><br /></div>' );
		if (rn_set_ls) {
			$("#rns_old_lnews").find("option[value=" + rn_set_old +"]").attr('selected', true);
			$("#rns_new_lnews").find("option[value=" + rn_set_new +"]").attr('selected', true);
			$("#rns_jgrowl").find("option[value=" + rn_set_jgrowl +"]").attr('selected', true);
			if (rn_set_ls['mya']!=undefined) {
				$("#rns_new_lmyal").find("option[value=" + rn_set_mya +"]").attr('selected', true);
			}
			if (rn_set_ls['pos']!=undefined) {
				$("#rns_new_lpost").find("option[value=" + rn_set_post +"]").attr('selected', true);
			}
			if (rn_set_ls['id']!=undefined) {
				$("#tid_ig_inp").val(""+ rn_set_id +"");
			}
		}
		$('#rns_conf').modal({ zIndex: 7 });
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#rns_update', function (e) {
		e.preventDefault();
		var rn_set_ls = JSON.parse(localStorage.getItem('rn_set'));
		if (!rn_set_ls) {
			rn_set_ls = {};
		}
		rn_set_ls['old'] = $("#rns_old_lnews option:selected").val();
		rn_set_ls['new'] = $("#rns_new_lnews option:selected").val();
		rn_set_ls['jgrowl'] = $("#rns_jgrowl option:selected").val();
		if($('#rns_new_lmyal').length) {
			rn_set_ls['mya'] = $("#rns_new_lmyal option:selected").val();
		}
		if($('#rns_new_lpost').length) {
			rn_set_ls['pos'] = $("#rns_new_lpost option:selected").val();
			rn_set_ls['id'] = $("#tid_ig_inp").val();
		}
		localStorage.setItem('rn_set', JSON.stringify(rn_set_ls));

		if(!$('#upd_news').length) {
			$('<div/>', { id: 'upd_news', class: 'bottom-right' }).appendTo('body');
		}
		setTimeout(function() {
			$('#upd_news').jGrowl(''+rns_updsaved_lang+'', { life: 500 });
		},200);
		if (rn_set_ls) {
			rn_set_old = rn_set_ls['old'];
			rn_set_new = rn_set_ls['new'];
			rn_set_jgrowl = rn_set_ls['jgrowl'];
			if (rn_set_ls['mya']!=undefined) {
				rn_set_mya = rn_set_ls['mya'];
			}
			if (rn_set_ls['pos']!=undefined) {
				rn_set_post = rn_set_ls['pos'];
			}
			if (rn_set_ls['id']!=undefined) {
				rn_set_id = rn_set_ls['id'];
			}
		}
		$.modal.close();
	});

	$('.rinnews_popup_hook').on({
		mouseenter: function () {
			popup_id = $(this).attr('id') + '_popup';
			alheight = $(this).height();
			timenews = setTimeout(function(){
				openrinnews(popup_id, alheight, 'mouse');
			}, 400);
		},
		mouseleave: function () {
			clearTimeout(timenews);
		},
		click: function (event) {
			popup_id = $(this).attr('id') + '_popup';
			alheight = $(this).height();
			event.preventDefault();
			clearTimeout(timenews);
			openrinnews(popup_id, alheight, 'click');
		}
	});

	$(document).mouseup(function (e) {
		var containerrnews = $(".rinnews_popup:visible, .rinnews_popup_hook");
		if (!containerrnews.is(e.target) && containerrnews.has(e.target).length === 0) {
			$(".rinnews_popup").hide();
		}
	});

	if (parseInt(rn_set_old)) {
		newnews.orderByKey().limitToLast(parseInt(authData.rns_news_limit)).once('value', function (snapshot) {
			if (snapshot.val()) {
				var predocs = $.map(snapshot.val(), function(value, index) {
					value._id = index;
					return [value];
				});
				docs = predocs.reverse();
				for (var i = docs.length-1; i >= 0; i--) {
					if (parseInt(docs[i].uid)!=parseInt(authData.uid)) {
						newsgenerator(docs[i].msg, docs[i].nick, docs[i].avatar, docs[i].url, docs[i].created, docs[i].type, 'old');
					}
				}
			}
		});
	}

	if (parseInt(rn_set_new)) {
		newnews.orderByChild("created").startAt(Date.now()).on("child_added", function(snapshot) {
			if(snapshot.val()) {
				data = snapshot.val();
				if (parseInt(data.uid)!=parseInt(authData.uid) && $.inArray(parseInt(data.tid), rn_set_id.split(',').map(function(idignore){return Number(idignore);}))==-1) {
					if (parseInt(rn_set_jgrowl)) {
						rnewslang = '';
						if(data.type=="newpost") {
							rnewslang = rns_newpost_lang;
						}
						else {
							rnewslang = rns_newthread_lang;
						}
						if(!$('#jgrowl_not').length) {
							$('<div/>', { id: 'jgrowl_not', class: 'bottom-left' }).appendTo('body');
						}
						$('#jgrowl_not').jGrowl(""+rnewslang+": "+data.nick+" "+regexrinnews(data.msg)+"", { life: 1000 });
					}
					newsgenerator(data.msg, data.nick, data.avatar, data.url, data.created, data.type, 'new');
					newscont++;
					$(".rnewscount").text(newscont).show();
					document.title = '['+newscont+'] '+rns_orgtit+'';
				}
			}
		});
	}

	if (rns_tid != '' && parseInt(rn_set_post) && $.inArray(parseInt(rns_tid), rn_set_id.split(',').map(function(idignorepost){return Number(idignorepost);}))==-1) {
		newpostnews = new Firebase(''+authData.url+'/newpostnews/T'+rns_tid+'')
		newpostnews.orderByChild("created").startAt(Date.now()).on("child_added", function(snapshot) {
			if(snapshot.val()) {
				data = snapshot.val();
				if (parseInt(data.uid)!=parseInt(authData.uid)) {
					if(parseInt(rns_pages)>parseInt(rns_page_current)){
						nextpage = parseInt(rns_page_current);
						nextpage++;
						if(!$('#rns_hasmore').length) {
							$("#posts").append('<div id="rns_hasmore">'+rns_hasmore_lang+'<a href="'+rootpath+'/showthread.php?tid='+data.tid+'&amp;page='+nextpage+'">'+rns_hasmore2_lang+'</a></div>');
						}
						postbitgenerator(data.nick, data.post, data.pid, data.tid, data.avatar, data.created);
					}
					else{
						postbitgenerator(data.nick, data.post, data.pid, data.tid, data.avatar, data.created);
					}
				}
			}
		});
	}

	if(parseInt(rns_myalerts)) {
		newmyalert = new Firebase(''+authData.url+'/newmyalert/U'+authData.uid+'')
		newmyalert.orderByChild("created").startAt(Date.now()).on("child_added", function(snapshot) {
			data = snapshot.val();
			type = ''+data.type+'';
			for (var val in rns_types) {
				type = type.replace(val, rns_types[val]);
			}
			if (parseInt(rn_set_jgrowl)) {
				if(!$('#jgrowl_not').length) {
					$('<div/>', { id: 'jgrowl_not', class: 'bottom-left' }).appendTo('body');
				}
				$('#jgrowl_not').jGrowl(""+rns_new_myalerts_lang+": "+rns_new_myalertsmsg_lang+" ("+type+")", { life: 1000 });
			}
			newsmyalertsgenerator(data.created, type);
			newscont++;
			$(".rnewscount").text(newscont).show();
			document.title = '['+newscont+'] '+rns_orgtit+'';
		});
	}
}

function regexrinnews(message) {
	format_search =	 [
		/\[url=(.*?)\](.*?)\[\/url\]/ig
	],
	// The matching array of strings to replace matches with
	format_replace = [
		'<a href="$1">$2</a>'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search.length;i++) {
		message = message.replace(format_search[i], format_replace[i]);
	}

	return message;
}

function regexrinnewspost(message) {

	for (var val in rns_smilies) {
		message = message.replace(new RegExp(''+val+'(?!\\S)', "gi"), rns_smilies[val]);
	}

	format_search_before =	 [
		/\[\/quote\](\r?\n|\r)/ig,
		/\[\/code\](\r?\n|\r)/ig,
		/\[\/php\](\r?\n|\r)/ig,
		/\[\/spoiler\](\r?\n|\r)/ig,
		/\[\/list\](\r?\n|\r)/ig,
		/\[quote=['"](.*?)["'](.*?)\]/ig,
		/\[quote=(.*?)(\.|´|"|'|`)(.*?)\]/ig,
		/\[spoiler=(.*?)\]/ig,
		/\[\*\]/ig
	],
	// The matching array of strings to replace matches with
	format_replace_before = [
		'[/quote]',
		'[/code]',
		'[/php]',
		'[/spoiler]',
		'[/list]',
		'[quote=$1]',
		'[quote=$1-$3]',
		'[spoiler]',
		'\n[*]'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search_before.length;i++) {
		message = message.replace(format_search_before[i], format_replace_before[i]);
	}

	message = BBCodeParser.process(message);

	format_search_after =	 [
		/\[hr\]/ig,
		/\[\*\]([^\n]+)/ig,
		/\<ol type="1">(\r?\n*|\r)/ig,
		/\<ul>(\r?\n*|\r)/ig,
		/\<\/li>(\r?\n*|\r)/ig,
		/\n/ig,
		/(^|[^"=\]])(https?:\/\/[a-zA-Z0-9\.\-\_\-\/]+(?:\?[a-zA-Z0-9=\+\_\;\-\&]+)?(?:#[\w]+)?)/gim,
		/(^|[^"=\]\>\/])(www\.[\S]+(\b|$))/gim,
		/(^|[^"=\]])(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim
	],
	// The matching array of strings to replace matches with
	format_replace_after = [
		'<hr></hr>',
		'<li>$1</li>',
		'<ol type="1">',
		'<ul>',
		'</li>',
		'<br />',
		'$1<a href="$2" target="_blank">$2</a>',
		'$1<a href="http://$2" target="_blank">$2</a>',
		'<a href="mailto:$1">$1</a>'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search_after.length;i++) {
		message = message.replace(format_search_after[i], format_replace_after[i]);
	}

	return message;
}

function postbitgenerator(username,text,pid,tid,avatar,date) {
	message = regexrinnewspost(text);
	hour = moment(date).utcOffset(parseInt(rns_zone)).format(rns_date_format);
	rns_mult_quote_but = '';
	if (parseInt(rns_mult_quote)==1) {
		rns_mult_quote_but = '<a href="javascript:Thread.multiQuote('+pid+');" id="multiquote_link_'+pid+'" title="'+rns_postb_multq_lang+'" class="postbit_multiquote"><span id="multiquote_'+pid+'">'+rns_postb_multqbut_lang+'</span></a>';
	}
	if(parseInt(rns_postbit)==0) {
		$("#posts").append('<a name="pid'+pid+'" id="pid'+pid+'"></a><div class="post" id="post_'+pid+'"><div class="post_author"><div class="author_avatar postavt_'+pid+'">'+avatar+'</div><div class="author_information"><strong><span class="largetext">'+username+'</span></strong></div></div><div class="post_content"><div class="post_head"><span class="post_date">'+hour+'</span></div><div class="post_body scaleimages" id="pid_'+pid+'">'+message+'</div></div><div class="post_controls"><div class="postbit_buttons post_management_buttons float_right"><a href="'+rootpath+'/newreply.php?tid='+tid+'&amp;replyto='+pid+'" title="'+rns_postb_quote_lang+'" class="postbit_quote"><span>'+rns_postb_quotebut_lang+'</span></a>'+rns_mult_quote_but+'</div></div></div>');
	}
	else {
		$("#posts").append('<a name="pid'+pid+'" id="pid'+pid+'"></a><div class="post classic" id="post_'+pid+'"><div class="post_author scaleimages"><div class="author_avatar postavt_'+pid+'">'+avatar+'</div><div class="author_information"><strong><span class="largetext">'+username+'</span></strong></div></div><div class="post_content"><div class="post_head"><span class="post_date">'+hour+'</span></div><div class="post_body scaleimages" id="pid_'+pid+'">'+message+'</div></div><div class="post_controls"><div class="postbit_buttons post_management_buttons float_right"><a href="'+rootpath+'/newreply.php?tid='+tid+'&amp;replyto='+pid+'" title="'+rns_postb_quote_lang+'" class="postbit_quote"><span>'+rns_postb_quotebut_lang+'</span></a>'+rns_mult_quote_but+'</div></div></div>');
	}
	 $('.postavt_'+pid+' img').css({"max-height": ""+rns_avt_height+"px", "max-width": ""+rns_avt_width+"px"});
}

function newsgenerator(message,username,avatar,url,date,type,typenewold) {
	message = regexrinnews(message);
	color = rnewslang = typeoldnew = '';
	hour = moment(date).utcOffset(parseInt(rns_zone)).format(rns_date_format);
	if($("#newsarea").children("li.rnews").length>(parseInt(rns_news_limit) - 1)) {
		dif = $("#newsarea").children("li.rnews").length - (parseInt(rns_news_limit) - 1);
		$("#newsarea").children("li.rnews").slice(-dif).remove();
	}
	if(type=="newpost") {
		color = rns_newpost_color;
		rnewslang = rns_newpost_lang;
	}
	else {
		color = rns_newthread_color;
		rnewslang = rns_newthread_lang;
	}
	if(typenewold=="new") {
		typeoldnew = 'rinunreadNew';
	}
	$("#newsarea").prepend("<li class='"+typeoldnew+" rnews'><table style='width: 100%;'><tbody><tr><td class='rns_tvatar tl_c' width='45'>"+avatar+"</td><td><div class='rinnewsContent'><span style='font-size:12px;'><span style='color:"+color+";'>•</span> "+rnewslang+":</span> <span style='float:right;'><a href="+url+"><img src='"+rootpath+"/images/jump.png' /></a></span><br>"+username+" "+message+". ("+hour+")</div></td></tr></tbody></table></li>");
}

function newsmyalertsgenerator(date,type) {
	hour = moment(date).utcOffset(parseInt(rns_zone)).format(rns_date_format);
	if($("#newsarea").children("li.malnews").length>(parseInt(rns_myanews_limit) - 1)) {
		dif = $("#newsarea").children("li.malnews").length - (parseInt(rns_myanews_limit) - 1);
		$("#newsarea").children("li.malnews").slice(-dif).remove();
	}
	$("#newsarea").prepend("<li class='rinunreadNew malnews'><div class='rinnewsContent'><span style='font-size:12px;'><span style='color:"+rns_myalerts_color+";'>•</span> "+rns_new_myalerts_lang+":</span> <br>"+rns_new_myalertsmsg_lang+" ("+type+"). ("+hour+")</div></li>");
}

function openrinnews(el, el2, type) {
	slidetype = '';
	if (type=="click") {
		slidetype = 'slideToggle';
	}
	else {
		slidetype = 'slideDown';
	}
	$('#' + el).attr('top', el2 + 'px')[slidetype]('fast');
	newscont = 0;
	$(".rnewscount").text(newscont).hide();
	document.title = rns_orgtit;
	return false;
}