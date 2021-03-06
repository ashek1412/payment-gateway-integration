/**  
 * Copyright 2013-2020 Epsiloncool
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  @copyright 2013-2020
 *  @license GPL v3
 *  @package Wordpress Fulltext Search
 *  @author Epsiloncool <info@e-wm.org>
 */

;
/** Smart Forms */
var smforms;

function WPFTS_GetLang(str, def)
{
	var lang = document.wpfts_lang_texts || {};

	if (str in lang) {
		return lang[str];
	} else {
		return def;
	}
}

function SmFormUpdate(smform)
{
	var istouched = parseInt(smform.attr('data-istouched'));
	var issvshown = parseInt(smform.attr('data-svshown'));
	var isnforced = parseInt(smform.attr('data-nforced'));

	if ((istouched == issvshown) && isnforced) {
		return;
	}

	if (istouched) {
		jQuery('.sf_savelink_place', smform).html('<a href="#" class="smform_save_link"><i class="fa fa-save mr-1"></i>' + WPFTS_GetLang('save_changes', 'Save Changes') + '</a>');
		jQuery('.sf_savebtn_place', smform).html('<hr><div class="btn btn-primary btn-sm smform_save_btn">' + WPFTS_GetLang('save_changes', 'Save Changes') + '</div>');

	} else {
		jQuery('.sf_savelink_place', smform).html('');
		jQuery('.sf_savebtn_place', smform).html('');
	}
	smform.attr('data-nforced', 1);
	smform.attr('data-svshown', istouched);
}

function SmFormSubmit(smform)
{
	var formname = smform.attr('data-name');

	var data = wpftsiFormData(smform);
	data['form_name'] = formname;

	wpftsiAction('wpftsi_smartform', data, function(jx)
	{
		if ('code' in jx) {
			if (jx['code'] == 0) {
				// No error
				if ('html' in jx) {
					/*
					// Update form code
					var place = jQuery('.wpfts_smartform[data-name="' + formname + '"]').closest('.wpfts_smartform_container');
					if (place.length > 0) {
						place.html(jx['html']);
					}
					*/
				}
				// Remove save buttons and links for this form
				smform.attr('data-istouched', 0);
				SmFormUpdate(smform);

			} else {
				if ('error' in jx) {
					alert(jx['error']);
				} else {
					alert(WPFTS_GetLang('changes_not_set', 'Changes was not saved - an error occured!'));
				}
			}
		}
	});
}

function InitSmartForms()
{
	jQuery('.wpfts_smartform').each(function()
	{
		// Track changes for all inputs
		var smform = jQuery(this);

		smform.attr('data-istouched', 0);
		SmFormUpdate(smform);

		jQuery('input, select, textarea', jQuery(this)).each(function()
		{
			jQuery(this).on('change', function()
			{
				smform.attr('data-istouched', 1);
				SmFormUpdate(smform);
			});
		});
		
		smform.on('click', '.smform_save_link', function(e)
		{
			e.preventDefault();
			SmFormSubmit(smform);

			return false;
		});

		smform.on('click', '.smform_save_btn', function()
		{
			SmFormSubmit(smform);
		});
	});

};


jQuery(document).ready(function()
{
	jQuery('.wpfts_instant_help').on('click', function(e)
	{
        e.preventDefault();
        return false;
    });

	jQuery('.wpfts_submit').on('click', function(e)
	{
        e.preventDefault();

        var formdata = wpftsiFormData(jQuery('#wpftsi_form'));
        wpftsiAction('wpftsi_submit_settings', formdata);

        return false;
    });

	jQuery('.wpfts_submit2').on('click', function(e)
	{
        e.preventDefault();

        var confirm_text = jQuery(this).attr('data-confirm');
        var isallow = false;
		if ((confirm_text) && (confirm_text.length > 0) && (jQuery('#wpfts_is_autoreindex').is(':checked'))) {
            if (confirm(confirm_text)) {
                isallow = true;
            }
        } else {
            isallow = true;
        }

        if (isallow) {
            var formdata = wpftsiFormData(jQuery('#wpftsi_form2'));
            wpftsiAction('wpftsi_submit_settings2', formdata);
        }

        return false;
    });

	jQuery('.wpfts_submit5').on('click', function(e)
	{
        e.preventDefault();

        var formdata = wpftsiFormData(jQuery('#wpftsi_form5'));
        if (wpfts_se_styles_editor) {
            formdata['wpfts_se_styles'] = wpfts_se_styles_editor.session.getValue();
        }
        wpftsiAction('wpftsi_submit_settings5', formdata);

        return false;
    });

	jQuery('.wpfts_btn_rebuild').on('click', function(e)
	{
        e.preventDefault();

        var confirm_text = jQuery(this).attr('data-confirm');
        var isallow = false;
        if ((confirm_text) && (confirm_text.length > 0)) {
            if (confirm(confirm_text)) {
                isallow = true;
            }
        } else {
            isallow = true;
        }

        if (isallow) {

            jQuery('.wpfts_show_resetting').css('display', 'block');

            var formdata = wpftsiFormData(jQuery('#wpftsi_form'));
			wpftsiAction('wpftsi_submit_rebuild', formdata, function(jx){
                jQuery('.wpfts_show_resetting').css('display', 'none');
            });
        }

        return false;
    });

	jQuery('.wpfts-notice .btn_start_indexing').on('click', function()
	{
        jQuery('.wpfts_show_resetting').css('display', 'block');

        var formdata = wpftsiFormData(jQuery('#wpftsi_form'));
		wpftsiAction('wpftsi_submit_rebuild', formdata, function(jx){
            jQuery('.wpfts_show_resetting').css('display', 'none');
        });
    });

	jQuery('.wpfts-notice .btn_notify_start_indexing').on('click', function(e)
	{
        e.preventDefault();

        jQuery('.wpfts_show_resetting').css('display', 'block');

        var formdata = wpftsiFormData(jQuery('#wpftsi_form'));
		wpftsiAction('wpftsi_submit_rebuild', formdata, function(jx)
		{
            jQuery('.wpfts_show_resetting').css('display', 'none');
        });
        return false;
    });

	jQuery('#wpfts_testbutton').on('click', function()
	{
		jQuery('#wpfts_test_filter_output').html('<hr><p>' + wpfts_test_waiter() + '</p>');
		
		var formdata = wpftsiFormData(jQuery('#form_indextester'));
		wpftsiAction('wpftsi_submit_testpost', formdata, function(jx){
			
			jQuery('#wpfts_test_filter_output').html('');

			if (('code' in jx) && (jx['code'] === 0)) {
				jQuery('#wpfts_test_filter_output').html(jx['text']);
			}
		});
		
		return false;
	});

	jQuery('#wpfts_testquerybutton').on('click', function()
	{
		jQuery('#wpfts_test_search_output').html('<hr><p>' + wpfts_test_waiter() + '</p>');
		
		var formdata = wpftsiFormData(jQuery('#form_searchtester'));
		wpftsiAction('wpftsi_submit_testsearch', formdata, function(jx){
			
			jQuery('#wpfts_test_search_output').html('');
			
			if (('code' in jx) && (jx['code'] === 0)) {
				jQuery('#wpfts_test_search_output').html(jx['text']);
			}
		});
		
		return false;
	});

	function wpfts_tqChangePage(i, n_pages)
	{
		var formdata = wpftsiFormData(jQuery('#form_searchtester'));
		
		if (!n_pages) {
			n_pages = jQuery('.wpfts_tq_n_perpage').eq(0).val();
		}
	
		formdata['wpfts_tq_current_page'] = i;
		formdata['wpfts_tq_n_perpage'] = n_pages;
		
		wpftsiAction('wpftsi_submit_testsearch', formdata, function(jx){
				
			jQuery('#wpfts_test_search_output').html('');
				
			if (('code' in jx) && (jx['code'] === 0)) {
				jQuery('#wpfts_test_search_output').html(jx['text']);
			}
		});
	}

	jQuery('#wpfts_test_search_output').on('click', '.wpfts_tq_prevpage', function()
	{
		if (jQuery(this).is(':disabled')) {
			return;
		}

		var pager = jQuery(this).closest('.sandbox_paginator');
		var i = parseInt(jQuery('.wpfts_tq_current_page', pager).val());
		var n_pages = jQuery('.wpfts_tq_n_perpage', pager).val();
		if (i > 1) {
			i --;
			wpfts_tqChangePage(i, n_pages);
		}
		
		return false;
	});

	jQuery('#wpfts_test_search_output').on('click', '.wpfts_tq_nextpage', function()
	{
		if (jQuery(this).is(':disabled')) {
			return;
		}

		var pager = jQuery(this).closest('.sandbox_paginator');
		var i = parseInt(jQuery('.wpfts_tq_current_page', pager).val());
		var n_pages = jQuery('.wpfts_tq_n_perpage', pager).val();

		i ++;
		wpfts_tqChangePage(i, n_pages);
		
		return false;
	});
	
	jQuery('#wpfts_test_search_output').on('change', '.wpfts_tq_current_page', function()
	{
		var pager = jQuery(this).closest('.sandbox_paginator');
		var i = parseInt(jQuery('.wpfts_tq_current_page', pager).val());
		var n_pages = jQuery('.wpfts_tq_n_perpage', pager).val();
		wpfts_tqChangePage(i, n_pages);
		
		return false;
	});
	
	jQuery('#wpfts_test_search_output').on('change', '.wpfts_tq_n_perpage', function()
	{
		var pager = jQuery(this).closest('.sandbox_paginator');
		var n_pages = parseInt(jQuery('.wpfts_tq_n_perpage', pager).val());
		wpfts_tqChangePage(1, n_pages);
		return false;
	});



	jQuery('.wpfts_btn_switch_engine_finish').on('click', function()
	{
        if (confirm(switch_caution_txt)) {
            var data = {
                'pid': wpfts_pid,
                'is_finish': 1,
                'engine_type': 0,
                'is_run': 0
            };
            wpftsiAction('wpftsi_switch_engine', data, switchprocessor);
        }
    });

	jQuery('.wpfts_btn_switch_engine').on('click', function()
	{
        if (confirm(switch_caution_txt)) {
            var data = {
                'pid': wpfts_pid,
                'is_finish': 0,
                'engine_type': jQuery(this).attr('data-type'),
                'is_run': 0
            };
            wpftsiAction('wpftsi_switch_engine', data, switchprocessor);
        }
    });

	jQuery('.wpfts_smart_excerpts_preview').on('click', 'a', function(e)
	{
        e.preventDefault();
        alert(WPFTS_GetLang('link_follows', "This link follows to\n\n%s").replace('%s', jQuery(this).attr('href')));
        return false;
    });

	jQuery(document).on('click', '.wpfts-notice.is-dismissible button.notice-dismiss', function()
	{
        // Remove the notification
        var data = {
            'notification_id': jQuery(this).closest('.wpfts-notice').attr('data-notificationid')
        };
        wpftsiAction('wpftsi_hide_notification', data);

    });

	jQuery(document).on('click', '.wpfts-notice.is-dismissible .dismiss-link', function()
	{
        // Remove the notification
        /*
        var data = {
            'notification_id': jQuery(this).closest('.wpfts-notice').attr('data-notificationid')
        };
        wpftsiAction('wpftsi_hide_notification', data);
		*/
        jQuery(this).closest('.wpfts-notice').find('button.notice-dismiss').trigger('click');
    });

	jQuery('.btn_se_style_preview').on('click', function(e)
	{
        var formdata = wpftsiFormData(jQuery('#wpftsi_form5'));
        if (wpfts_se_styles_editor) {
            formdata['wpfts_se_styles'] = wpfts_se_styles_editor.session.getValue();
        }
		wpftsiAction('wpftsi_se_style_preview', formdata, function(jx) 
		{
            if (('code' in jx) && (jx.code == 0) && ('c_css' in jx)) {
                jQuery('#wpfts_se_styles_node').html(jx.c_css);
            }
        });
    });

	jQuery('.btn_se_style_reset').on('click', function(e)
	{
        if (!confirm(WPFTS_GetLang('reset_styles', 'This action will reset your custom CSS styles, are you sure?'))) {
            return;
        }

        var form = jQuery('#wpftsi_form5');
		wpftsiAction('wpftsi_se_style_reset', {}, function(jx) 
		{
            if (('code' in jx) && (jx.code == 0) && ('c_css' in jx)) {
                jQuery('#wpfts_se_styles_node').html(jx.c_css);
                if (wpfts_se_styles_editor) {
                    wpfts_se_styles_editor.session.setValue(jx.css_data);
                }
            }
        });
    });

	jQuery('.ft_mt_show_extra_mimetypes').on('click', function(e)
	{
		e.preventDefault();
	
		jQuery('.ft_selector').toggle();
	
		return false;
	});
	
	var switchprocessor = function(jx) 
	{
        if (('code' in jx) && (jx['code'] === 0)) {
            if ('status' in jx) {
                var st = jx['status'];
                var step = ('status' in st) ? st['status'] : 0;
                if ('html' in st) {
                    // Redraw status html
                    jQuery('#wpfts_cnvmsg').html(st['html']);
                }
                if (st != 0) {
                    // Need to continue
                    var data = {
                        'pid': wpfts_pid,
                        'is_finish': 1,
                        'engine_type': 0,
                        'is_run': 1
                    };
                    setTimeout(function(){ // To prevent browser stucks
                        wpftsiAction('wpftsi_switch_engine', data, switchprocessor);
                    }, 2000);
                }
            }
        }
    };

	var pingprocessor = function(jx) 
	{
        if (('code' in jx) && (jx['code'] === 0)) {
            wpftsShowIndexStatus(jx['status']);
            var result = jx['result'];
            switch (result) {
                case 5:
                    // Start indexing of part
                    wpftsiAction('wpftsi_rebuild_step', {'pid': wpfts_pid}, pingprocessor);
                    break;
                case 10:
                    // Indexing in progress (other process)
                    setTimeout(pingtimer, wpfts_pingtimeout);
                    break;
                case 0:
                default:
                    // Nothing to index
                    setTimeout(pingtimer, wpfts_pingtimeout);
            }
        } else {
            if ('error' in jx) {
                // Error happen. Make a delay and try again
                setTimeout(pingtimer, wpfts_pingtimeout);
            }
        }
    };

    if ((typeof wpfts_is_settings_screen != 'undefined') && (wpfts_is_settings_screen)) {
        // Start ping system
		var pingtimer = function ()
		{
            wpftsiAction('wpftsi_ping', {'pid': wpfts_pid}, pingprocessor);
        };

        pingtimer();
    }

	InitSmartForms();

});

function wpfts_test_waiter()
{
    return '<img src="' + wpfts_root_url + '/style/waiting.gif" alt="">';
}

function wpftsShowIndexStatus(st) 
{
    jQuery('#wpfts_status_box').html(st);
}

function wpftsiFormData(p)
{
    var list = {};
    jQuery('input[name], select[name], textarea[name]', p).each(function(i, v){
        if (jQuery(v).is('input[type="radio"]')) {
            if (jQuery(v).is(':checked')) {
                list[jQuery(v).attr('name')] = jQuery(v).val();
            } else {
                // Not save value for unchecked radio
            }
        } else {
            if (jQuery(v).is('input[type="checkbox"]')) {
                list[jQuery(v).attr('name')] = jQuery(v).is(':checked') ? jQuery(v).val() : 0;
            } else {
                list[jQuery(v).attr('name')] = jQuery(v).val();
            }
        }
    });

    return list;
}

function wpftsiAction(action, data, cb)
{
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
		data: {'action': action, '__xr':1, 'z':JSON.stringify(data)},
		success: function(jx)
		{
            var ret = true;
            if ((typeof cb !== 'undefined') && (cb)) {
                var vars = {};
				for (var i = 0; i < jx.length; i ++) {
                    switch (jx[i][0]) {
                        case 'vr':
                            vars[jx[i][1]] = jx[i][2];
                            break;
                    }
                }
                ret = cb(vars);
            }
            if ((ret) || (typeof ret === 'undefined')) {
				for (var i = 0; i < jx.length; i ++) {
                    var jd = jx[i];
                    switch (jd[0]) {
                        case 'cn':
                            console.log(jd[1]);
                            break;
                        case 'al':
                            alert(jd[1]);
                            break;
                        case 'as':
                            if (jQuery(jd[1]).length > 0) {
                                jQuery(jd[1]).html(jd[2]);
                            }
                            break;
                        case 'js':
                            eval(jd[1]);
                            break;
                        case 'rd':
                            document.location.href(jd[1]);
                            break;
                        case 'rl':
                            window.location.reload();
                            break;
                    }
                }
            }
        },
		error: function(jqXHR, textStatus, errorThrown)
		{
            console.log('WPFTS jx Error: ' + errorThrown + ', ' + textStatus);
            if ((typeof cb !== 'undefined') && (cb)) {
                cb({
                    'error': {
                        'jqxhr': jqXHR,
                        'textStatus': textStatus,
                        'errorThrown': errorThrown,
                    }
                });
            }
        },
        dataType: 'json'
    });

}
