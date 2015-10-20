<?php
/**
 * Rin News
 * https://github.com/martec
 *
 * Copyright (C) 2015-2015, Martec
 *
 * Rin News is licensed under the GPL Version 3, 29 June 2007 license:
 *	http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Rin News - Firebase News for Mybb
 * @author Martec
 * @requires jQuery, Firebase and Mybb
 * @credits notify.png icon from http://community.mybb.com/post-861176.html
 * @credits some part of code based in MyAlerts of Euan T (http://community.mybb.com/thread-127444.html)
 */

// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
	die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

if(!defined("PLUGINLIBRARY"))
{
	define("PLUGINLIBRARY", MYBB_ROOT."inc/plugins/pluginlibrary.php");
}

define('RNS_PLUGIN_VER', '0.2.1');

function rinnews_info()
{
	global $lang, $mybb, $plugins_cache;

	$lang->load('config_rinnews');

	$info = array(
		"name"			=> "Rin News",
		"description"	=> $lang->rinnews_plug_desc,
		"author"		=> "martec",
		"authorsite"	=> "",
		"version"		=> RNS_PLUGIN_VER,
		"guid"			=> "",
		"compatibility" => "18*"
	);

	if(rinnews_is_installed() && $plugins_cache['active']['rinnews'] && $plugins_cache['active']['myalerts']) {
		global $PL;
		$PL or require_once PLUGINLIBRARY;

		$editcode = $PL->url_append("index.php?module=config-plugins", array("rinnews" => "edit", "my_post_key" => $mybb->post_code));
		$undocode = $PL->url_append("index.php", array("module" => "config-plugins", "rinnews" => "undo", "my_post_key" => $mybb->post_code));

		$editcode = "index.php?module=config-plugins&amp;rinnews=edit&amp;my_post_key=".$mybb->post_code;
		$undocode = "index.php?module=config-plugins&amp;rinnews=undo&amp;my_post_key=".$mybb->post_code;

		$info["description"] .= "<br /><a href=\"{$editcode}\">Make edits to inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php</a>.";
		$info["description"] .= "	 | <a href=\"{$undocode}\">Undo edits to inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php</a>.";
	}

	return $info;
}

function rinnews_install()
{
	global $db, $lang, $PL;

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$lang->load('config_rinnews');

	$query	= $db->simple_select("settinggroups", "COUNT(*) as rows");
	$dorder = $db->fetch_field($query, 'rows') + 1;

	$groupid = $db->insert_query('settinggroups', array(
		'name'		=> 'rinnews',
		'title'		=> 'Rin News',
		'description'	=> $lang->rinnews_sett_desc,
		'disporder'	=> $dorder,
		'isdefault'	=> '0'
	));

	$rinnews_setting[] = array(
		'name' => 'rinnews_online',
		'title' => $lang->rinnews_onoff_title,
		'description' => $lang->rinnews_onoff_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 1,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_num_news',
		'title' => $lang->rinnews_newslimit_title,
		'description' => $lang->rinnews_newslimit_desc,
		'optionscode' => 'numeric',
		'value' => '10',
		'disporder' => 2,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_num_myanews',
		'title' => $lang->rinnews_newsmyalimit_title,
		'description' => $lang->rinnews_newsmyalimit_desc,
		'optionscode' => 'numeric',
		'value' => '5',
		'disporder' => 3,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_grups_acc',
		'title' => $lang->rinnews_nogrp_title,
		'description' => $lang->rinnews_nogrp_desc,
		'optionscode' => 'groupselect',
		'value' => '7',
		'disporder' => 4,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_server',
		'title' => $lang->rinnews_server_title,
		'description' => $lang->rinnews_server_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 5,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_fsecret',
		'title' => $lang->rinnews_fsecret_title,
		'description' => $lang->rinnews_fsecret_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 6,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_newpost',
		'title' => $lang->rinnews_newpost_title,
		'description' => $lang->rinnews_newpost_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 7,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_newthread',
		'title' => $lang->rinnews_newthread_title,
		'description' => $lang->rinnews_newthread_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 8,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_folder_acc',
		'title' => $lang->rinnews_foldacc_title,
		'description' => $lang->rinnews_foldacc_desc,
		'optionscode' => 'forumselect',
		'value' => '',
		'disporder' => 9,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_dataf',
		'title' => $lang->rinnews_dataf_title,
		'description' => $lang->rinnews_dataf_desc,
		'optionscode' => 'text',
		'value' => 'DD/MM hh:mm A',
		'disporder' => 10,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_newpost_color',
		'title' => $lang->rinnews_newpostcolor_title,
		'description' => $lang->rinnews_newpostcolor_desc,
		'optionscode' => 'text',
		'value' => 'green',
		'disporder' => 11,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_newthread_color',
		'title' => $lang->rinnews_newthreadcolor_title,
		'description' => $lang->rinnews_newthreadcolor_desc,
		'optionscode' => 'text',
		'value' => 'blue',
		'disporder' => 12,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_myalerts_color',
		'title' => $lang->rinnews_myalertscolor_title,
		'description' => $lang->rinnews_myalertscolor_desc,
		'optionscode' => 'text',
		'value' => 'orange',
		'disporder' => 13,
		'gid'		=> $groupid
	);
	$rinnews_setting[] = array(
		'name' => 'rinnews_myalerts',
		'title' => $lang->rinnews_myalertonoff_title,
		'description' => $lang->rinnews_myalertonoff_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 14,
		'gid'		=> $groupid
	);

	$db->insert_query_multiple("settings", $rinnews_setting);
	rebuild_settings();

}

function rinnews_uninstall()
{
	global $db, $PL;
	$PL or require_once PLUGINLIBRARY;

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->stylesheet_delete('rinnews', true);

	//Delete Settings
	$db->write_query("DELETE FROM ".TABLE_PREFIX."settings WHERE name IN(
		'rinnews_online',
		'rinnews_num_news',
		'rinnews_num_myanews',
		'rinnews_grups_acc',
		'rinnews_server',
		'rinnews_server_username',
		'rinnews_server_password',
		'rinnews_socketio'
		'rinnews_newpost',
		'rinnews_newthread',
		'rinnews_folder_acc',
		'rinnews_dataf',
		'rinnews_newpost_color',
		'rinnews_newthread_color',
		'rinnews_myalerts_color',
		'rinnews_myalert'
	)");

	$db->delete_query("settinggroups", "name = 'rinnews'");
	rebuild_settings();

}

function rinnews_is_installed()
{
	global $db;

	$query = $db->simple_select("settinggroups", "COUNT(*) as rows", "name = 'rinnews'");
	$rows  = $db->fetch_field($query, 'rows');

	return ($rows > 0);
}

function rinnews_activate()
{

	global $db, $plugins_cache, $PL;
	$PL or require_once PLUGINLIBRARY;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->stylesheet('rinnews', file_get_contents(MYBB_ROOT . "/jscripts/rin/news/css/rinnews.css"));

	$new_template_global['rinnewstemplate'] = "<li><a href=\"{\$mybb->settings['bburl']}/usercp.php?action=rinnews_config\" class=\"rinnews rinnews_popup_hook\" id=\"rinunreadNews_menu\">{\$lang->rinnews_news}</a></li>
<span class=\"rinnews_popup_wrapper rinnews\"><a href=\"{\$mybb->settings['bburl']}/usercp.php?action=rinnews_config\" class=\"rinunreadNews rinnews_popup_hook\" id=\"rinunreadNews_menu\"><span class=\"rnewscount\" style=\"display:none\"></span></a>
	<div id=\"rinunreadNews_menu_popup\" class=\"rinnews_popup\" style=\"display:none\">
		<div class=\"popupTitle\">{\$lang->rinnews_recent_news}</div>
		<ol id=\"newsarea\">
		</ol>
		<div class=\"popupFooter\"><div class=\"tl_r\"><a href=\"#\" id=\"rns_opt\">{\$lang->rinnews_settings}</a></div></div>
	</div>
</span>";

	$new_template_global['rinnewsfootertemplate'] = "<script src=\"https://cdn.firebase.com/js/client/2.2.9/firebase.js\"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js'></script>
<script type=\"text/javascript\">
<!--
	rns_date_format = '{\$mybb->settings['rinnews_dataf']}',
	rns_zone = '{\$mybb->user['timezone']}',
	rns_zone_crrect = '{\$mybb->user['dst']}',
	rns_news_limit = '{\$mybb->settings['rinnews_num_news']}',
	rns_myanews_limit = '{\$mybb->settings['rinnews_num_myanews']}',
	rns_newpost_color = '{\$mybb->settings['rinnews_newpost_color']}',
	rns_newthread_color = '{\$mybb->settings['rinnews_newthread_color']}',
	rns_myalerts_color = '{\$mybb->settings['rinnews_myalerts_color']}',
	rns_myalerts = '{\$mybb->settings['rinnews_myalerts']}',
	rns_newpost = '{\$mybb->settings['rinnews_newpost']}',
	rns_newpost_lang = '{\$lang->rinnews_new_post}',
	rns_newthread_lang = '{\$lang->rinnews_new_thread}',
	rns_new_msg_lang = '{\$lang->rinnews_new_msg}',
	rns_new_msg2_lang = '{\$lang->rinnews_new_msg2}',
	rns_new_myalerts_lang = '{\$lang->rinnews_new_myalerts}',
	rns_new_myalertsmsg_lang = '{\$lang->rinnews_new_myalerts_msg}',
	rns_hasmore_lang = '{\$lang->rinnews_has_more}',
	rns_hasmore2_lang = '{\$lang->rinnews_has_more2}',
	rns_sett_lang = '{\$lang->rinnews_settings}',
	rns_loldnews_lang = '{\$lang->rinnews_old_news}',
	rns_lnewnews_lang = '{\$lang->rinnews_new_news}',
	rns_jgrowl_lang = '{\$lang->rinnews_jgrowl}',
	rns_lmyalertsnews_lang = '{\$lang->rinnews_myalerts_news}',
	rns_lnewpost_lang = '{\$lang->rinnews_load_newpost}',
	rns_idign_lang = '{\$lang->rinnews_tidign_newpost}',
	rns_updset_lang = '{\$lang->rinnews_update_config}',
	rns_updsaved_lang = '{\$lang->rinnews_update_saved}',
	rns_postb_multq_lang = '{\$lang->postbit_multiquote}',
	rns_postb_multqbut_lang = '{\$lang->postbit_button_multiquote}',
	rns_postb_quote_lang = '{\$lang->postbit_quote}',
	rns_postb_quotebut_lang = '{\$lang->postbit_button_quote}',
	rns_spo_lan = '{\$lang->rinnews_spoiler}',
	rns_hide_lan = '{\$lang->rinnews_hide}',
	rns_show_lan = '{\$lang->rinnews_show}',
	rns_no_lan = '{\$lang->rinnews_no}',
	rns_yes_lan = '{\$lang->rinnews_yes}',
	rns_quote_lang = '{\$lang->quote}',
	rns_wrote_lang = '{\$lang->wrote}',
	rns_code_lang = '{\$lang->code}',
	rns_php_lang = '{\$lang->php_code}',
	rns_orgtit = document.title,
	rns_postbit = '{\$mybb->user['classicpostbit']}',
	rns_pages = \$.trim(\$('.pagination').not('#breadcrumb_multipage_popup').children('.pagination_page').last().html()),
	rns_page_current = \$.trim(\$('.pagination').not('#breadcrumb_multipage_popup').children('.pagination_current').last().html()),
	rns_avt_dime = '{\$mybb->settings['postmaxavatarsize']}',
	rns_mult_quote = '{\$mybb->settings['multiquote']}',
	rns_tid = '{\$mybb->input['tid']}';
// -->
</script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/rin/news/rinnews.helper.js?ver=".RNS_PLUGIN_VER."\"></script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/rin/news/bbcode-parser.js?ver=".RNS_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
rns_smilies = {
	{\$rns_smilies_json}
}
rns_types = {
	{\$rns_type_json}
}
\$(document).ready(function() {
	rinnews_connect();
});
</script>";

	foreach($new_template_global as $title => $template)
	{
		$new_template_global = array('title' => $db->escape_string($title), 'template' => $db->escape_string($template), 'sid' => '-1', 'version' => '1803', 'dateline' => TIME_NOW);
		$db->insert_query('templates', $new_template_global);
	}

	find_replace_templatesets("header_welcomeblock_member", '#{\$modcplink}#', "{\$modcplink}{\$rinnews}");
	find_replace_templatesets("footer", '/$/', "{\$rinnewsfooter}");

	if($plugins_cache['active']['myalerts']) {
		$result = $PL->edit_core("rinnews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array (
					array(	'search' => array('return array('),
							'before' => array(	'
										global $mybb, $settings;

										if($settings[\'rinnews_myalerts\']) {
											$data = array(
												"uid" => $this->getUserId(),
												"created" => TIME_NOW*1000,
												"type" => $this->getTypeId()
											);

											sendPostDataRN(\'newmyalert/U\'.$this->getUserId().\'\', $data, \'\'.$this->getUserId().\'\');
										}
										')
						)
			),
			true
		);
	}
}

function rinnews_deactivate()
{
	global $db, $PL;
	$PL or require_once PLUGINLIBRARY;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	if(!file_exists(PLUGINLIBRARY)) {
		flash_message("PluginLibrary is missing.", "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->stylesheet_deactivate('rinnews', true);

	$db->delete_query("templates", "title IN('rinnewstemplate','rinnewsfootertemplate')");

	find_replace_templatesets("header_welcomeblock_member", '#'.preg_quote('{$rinnews}').'#', '',0);
	find_replace_templatesets("footer", '#'.preg_quote('{$rinnewsfooter}').'#', '',0);

	$PL->edit_core("rinnews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array(), true);
}

global $settings;
if ($settings['rinnews_online']) {
	$plugins->add_hook('global_start', 'RinNews');
}
function RinNews() {

	global $templatelist, $settings, $mybb, $theme, $smiliecache, $talertcache, $cache, $rns_smilies_json, $rns_type_json, $templates, $rinnews, $rinnewsfooter, $lang;

	if (!$lang->rinnews) {
		$lang->load('rinnews');
	}

	if (isset($templatelist)) {
		$templatelist .= ',';
	}

	$templatelist .= 'rinnewstemplate,rinnewsfootertemplate';

	if(!$talertcache)
	{
		if(!is_array($talert_cache))
		{
			$talert_cache = $cache->read("mybbstuff_myalerts_alert_types");
		}
		if ($talert_cache) {
			foreach($talert_cache as $talert)
			{
				if($talert['enabled'] != 0)
				{
					$talertcache[$talert['id']] = $talert;
				}
			}
		}
	}	

	unset($talert);	

	if(is_array($talertcache))
	{
		reset($talertcache);
		$rns_type_json = "";

		foreach($talertcache as $talert)
		{		
			$rns_type_json .= '"'.$talert['id'].'": "'.$talert['code'].'",';
		}
	}

	if(!$smiliecache)
	{
		if(!is_array($smilie_cache))
		{
			$smilie_cache = $cache->read("smilies");
		}
		foreach($smilie_cache as $smilie)
		{
			if($smilie['showclickable'] != 0)
			{
				$smilie['image'] = str_replace("{theme}", $theme['imgdir'], $smilie['image']);
				$smiliecache[$smilie['sid']] = $smilie;
			}
		}
	}

	unset($smilie);

	if(is_array($smiliecache))
	{
		reset($smiliecache);

		$rns_smilies_json = "";

		foreach($smiliecache as $smilie)
		{
			$finds = explode("\n", $smilie['find']);

			// Only show the first text to replace in the box
			$smilie['find'] = $finds[0];

			$find = htmlspecialchars_uni($smilie['find']);
			$image = htmlspecialchars_uni($smilie['image']);
			$findfirstquote = preg_quote($find);
			$findsecoundquote = preg_quote($findfirstquote);
			$rns_smilies_json .= '"'.$findsecoundquote.'": "<img src=\"'.$mybb->asset_url.'/'.$image.'\" />",';
		}
	}

	if(!in_array((int)$mybb->user['usergroup'],explode(',',$mybb->settings['rinnews_grups_acc'])) && $mybb->user['uid']!=0) {
		eval("\$rinnews = \"".$templates->get("rinnewstemplate")."\";");
		eval("\$rinnewsfooter = \"".$templates->get("rinnewsfootertemplate")."\";");
	}

}

function sendPostDataRN($type, $data, $uid) {

	global $mybb, $settings;

	$emiturl = $settings['rinnews_server']."/".$type.".json?auth=".rns_token_gen(1, $uid)."";
	$ch = curl_init($emiturl);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

function rns_token_gen($type, $uid) {

	global $mybb, $settings;
	include_once "rin/FirebaseToken.php";

	$data = array(
		"uid" => $uid,
		"rns_news_limit" => $mybb->settings['rinnews_num_news'],
		"url" => $mybb->settings['rinnews_server'],
		"rest" => $type
	);

	$tokenGen = new Services_FirebaseTokenGenerator($mybb->settings['rinnews_fsecret']);
	$token = $tokenGen->createToken($data);
	return $token;
}

if ($settings['rinnews_online'] && $settings['rinnews_newthread']) {
	$plugins->add_hook('newthread_do_newthread_end', 'RNS_newthread');
}
function RNS_newthread()
{
	global $mybb, $tid, $settings, $lang, $forum;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['rinnews_folder_acc']))) {
		$lang->load('admin/config_rinnews');

		if(empty($mybb->user['avatar'])) {
			$mybb->user['avatar'] = "". $settings['bburl'] ."/images/default_avatar.png";
		}
		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid']);
		$avtar_link = build_profile_link("<img src='".$mybb->user['avatar']."' />",$mybb->user['uid']);
		$link = '[url=' . $settings['bburl'] . '/' . get_thread_link($tid) . ']' . $mybb->input['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->rinnews_newthread_lang, $link);

		$data = array(
			"nick" => $name_link,
			"msg" => $linklang,
			"uid" => $mybb->user['uid'],
			"tid" => $tid,
			"url" => "". $settings['bburl'] ."/". get_thread_link($tid) ."",
			"avatar" => $avtar_link,
			"newslimit" => $mybb->settings['rinnews_num_news'],
			"created" => TIME_NOW*1000,
			"type" => "newthread"
		);

		sendPostDataRN('newnews', $data, ''.$mybb->user['uid'].'');
	}
}

if ($settings['rinnews_online'] && $settings['rinnews_newpost']) {
	$plugins->add_hook('newreply_do_newreply_end', 'RNS_newpost');
}
function RNS_newpost()
{
	global $mybb, $tid, $settings, $lang, $url, $thread, $forum, $pid, $visible, $post;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['rinnews_folder_acc'])) && $visible==1) {
		$lang->load('admin/config_rinnews');

		if(empty($mybb->user['avatar'])) {
			$mybb->user['avatar'] = "". $settings['bburl'] ."/images/default_avatar.png";
		}
		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$name_link = build_profile_link($name,$mybb->user['uid']);
		$avtar_link = build_profile_link("<img src='".$mybb->user['avatar']."' />",$mybb->user['uid']);
		$RNS_url = htmlspecialchars_decode($url);
		$link = '[url=' . $settings['bburl'] . '/' . $RNS_url . ']' . $thread['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->rinnews_newpost_lang, $link);

		$data = array(
			"nick" => $name_link,
			"msg" => $linklang,
			"uid" => $mybb->user['uid'],
			"url" => "". $settings['bburl'] ."/". $RNS_url ."",
			"avatar" => $avtar_link,
			"newslimit" => $mybb->settings['rinnews_num_news'],
			"created" => TIME_NOW*1000,
			"type" => "newpost"
		);
		
		$data2 = array(
			"nick" => $name_link,
			"post" => htmlspecialchars_uni($post['message']),
			"pid" => $pid,
			"uid" => $mybb->user['uid'],
			"tid" => $tid,
			"avatar" => $avtar_link,
			"newslimit" => $mybb->settings['rinnews_num_news'],
			"created" => TIME_NOW*1000
		);

		sendPostDataRN('newnews', $data, ''.$mybb->user['uid'].'');
		sendPostDataRN('newpostnews/T'.$tid.'', $data2, ''.$mybb->user['uid'].'');
	}
}

$plugins->add_hook('xmlhttp', 'rinnews_auth');

function rinnews_auth()
{
	global $mybb, $lang, $parser, $settings;

	if (!is_object($parser))
	{
		require_once MYBB_ROOT.'inc/class_parser.php';
		$parser = new postParser;
	}

	if ($mybb->input['action'] != "rinnews_gettoken" || $mybb->request_method != "post"){return false;exit;}

	if (!verify_post_check($mybb->input['my_post_key'], true))
	{
		xmlhttp_error($lang->invalid_post_code);
	}

	if ($mybb->input['action'] == "rinnews_gettoken"){
		
		$arraytoken = array('token' => rns_token_gen(0,$mybb->user['uid']), 'url' => $mybb->settings['rinnews_server']);
		echo json_encode($arraytoken);
	}
}

$plugins->add_hook("admin_config_plugins_begin", "rinnews_edit");
function rinnews_edit()
{
	global $mybb, $PL;

	if($mybb->input['my_post_key'] != $mybb->post_code)
	{
		return;
	}

	$PL or require_once PLUGINLIBRARY;

	if($mybb->input['rinnews'] == 'edit') {
		$result = $PL->edit_core("rinnews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array (
					array(	'search' => array('return array('),
							'before' => array(	'
										global $mybb, $settings;

										if($settings[\'rinnews_myalerts\']) {
											$data = array(
												"uid" => $this->getUserId(),
												"created" => TIME_NOW*1000,
												"type" => $this->getTypeId()
											);

											sendPostDataRN(\'newmyalert/U\'.$this->getUserId().\'\', $data, \'\'.$this->getUserId().\'\');
										}
										')
						)
			),
			true
		);
	}

	else if($mybb->input['rinnews'] == 'undo')
	{
		$result = $PL->edit_core("rinnews", "inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php", array(), true);
	}

	else
	{
		return;
	}

	if($result === true)
	{
		flash_message("The file inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php was modified successfully.", "success");
		admin_redirect("index.php?module=config-plugins");
	}

	else
	{
		flash_message("The file inc/plugins/MybbStuff/MyAlerts/src/Entity/Alert.php could not be edited. Are the CHMOD settings correct?", "error");
		admin_redirect("index.php?module=config-plugins");
	}
}

?>