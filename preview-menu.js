/* eslint-disable no-extra-semi */
;/**
 * Preview Menu
 * https://wordpress.org/plugins/preview-menu/
 *
 * @author  Jory Hogeveen <info@keraweb.nl>
 * @package Preview_Menu
 * @since   0.2.0
 * @version 0.2.0
 * @preserve
 *
 * @var PreviewMenu
 */
/* eslint-enable no-extra-semi */

( function( $ ) {

	PreviewMenu.init = function() {

		$('#preview_menu_btn').on( 'click', function( e ) {
			e.preventDefault();
			e.stopPropagation();

			var $this      = $( this ),
				url        = $( '#preview_menu_url' ).val(),
				menu       = $( '#update-nav-menu input#menu' ).val(),
				menu_items = $( '#update-nav-menu .menu input, #update-nav-menu .menu select, #update-nav-menu .menu textarea' ).serializeObject(),
				location   = $( '#preview_menu_location' ).val();

			$( '#preview_menu_btn + .spinner' ).addClass( 'is-active' );

			$.post(
				ajaxurl,
				{
					action: 'preview_menu',
					_nonce: PreviewMenu._nonce,
					preview_menu: {
						menu: menu,
						items: JSON.stringify( menu_items )
					}
				},
				function( response ) {
					var success = ( response.hasOwnProperty( 'success' ) && true === response.success ),
						data    = response.hasOwnProperty( 'data' ) ? response.data : false,
						menu    = data.hasOwnProperty( 'menu' ) ? response.menu : false;

					if ( success ) {

						url = PreviewMenu.add_query_arg( 'preview_menu', 1, url );

						if ( menu ) {
							url = PreviewMenu.add_query_arg( 'preview_menu_id', menu, url );
						}
						if ( location ) {
							url = PreviewMenu.add_query_arg( 'preview_menu_location', location, url );
						}


						$( '#preview_menu_btn + .spinner' ).removeClass( 'is-active' );
						window.open( url, '_blank' );
					}
				}
			);
		} );
	};

	PreviewMenu.add_query_arg = function( key, value, url ) {
		key   = encodeURI( key );
		value = encodeURI( value );

		url = url.split( '?' );
		if ( 1 === url.length ) {
			url[1] = '';
		}

		var param = url[1].split( '&' );//url.substr(1).split('&');
		var i     = param.length;
		var x;
		while ( i-- ) {
			x = param[ i ].split( '=' );

			if ( x[0] === key ) {
				x[1]       = value;
				param[ i ] = x.join( '=' );
				break;
			}
		}

		if ( i < 0 ) {
			param[ param.length ] = [ key, value ].join( '=' );
		}

		param = param.filter( Boolean );

		url[1] = param.join( '&' );

		return url.join( '?' );
	};

	if ( 'undefined' !== typeof PreviewMenu ) {
		PreviewMenu.init();
	}

} ( jQuery ) );
