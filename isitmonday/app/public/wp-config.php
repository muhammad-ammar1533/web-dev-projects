<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'WyPRM6~lODe$md1XkVnT }n6 xPI~Kc.Nu3k$ot3[w$Z9Jf MFCF!r4cIY}>n8?R' );
define( 'SECURE_AUTH_KEY',   '.9SxJXNwjZ:h;S?iLA]7!=-+?1<B{<y&.u]&N6A98Phs ;|U}5f] MzVRbK:hn8Z' );
define( 'LOGGED_IN_KEY',     'N2J}6!uuoZWB<*f)P*O{P1=1rnJ&5]RBq-_SR9>#~s,ZI6Q5*=m0u8@Vh>OzU8`*' );
define( 'NONCE_KEY',         '-l?h_Zb5%b]4ZoEY{axi<OUIo;;%|ORf9N9bD;B@([0Wp!o9gFTM:24ublKoYtKm' );
define( 'AUTH_SALT',         'fC 0n%UYe8LqG AxB@cxL7OAKIqyT<RYRiiL^+V,)-p+S>V#dMd!wxW>~3y4zZNB' );
define( 'SECURE_AUTH_SALT',  'VT|56iB99$HpX}(wL(s-H3v65(~Go>tkI5(bLgT8w3AD{w-W]5AOy;R{<B2,G-kH' );
define( 'LOGGED_IN_SALT',    'a .8_z`7qz3!v$i}v-m>*dj[T1,+lrpqs<jgTZz@tlZ4DjtUws-C%2B_$>>`nd8;' );
define( 'NONCE_SALT',        'mwa6t{]+W/)WA?ZPis_tw*@OWY{olJV*;k;;ko9dOU!p5$*}:vOP[T=?TkNs0<<<' );
define( 'WP_CACHE_KEY_SALT', '-WaAOdb/)eLCX&W&]p=Mm1uEceF56f+`Ai>cSH*CV~dW&vM o7Xe0F&i;p/8+0Rn' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
