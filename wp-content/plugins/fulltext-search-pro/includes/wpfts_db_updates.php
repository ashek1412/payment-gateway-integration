<?php

global $wpfts_db_updates;

$ver = (defined('WPFTS_VERSION')) ? WPFTS_VERSION : '0.0.1';

if (version_compare($ver, '2.0.0', '>=')) {
	// Pro
	$wpfts_db_updates = array(
		'2.27.83' => array(
			'text' => __('<ul><li>The big WPFTS Pro update: lots of improvements of the database and the code</li>
							<li>Some interface bugs were fixed</li>
							<li>Relevance formula was completely rebuilt</li>
							<li>Reindex algorithm was sufficiently improved (now 5 times faster!)</li>
							<li>Attachment mimetypes replaced with file extensions</li>
							<li>Startup Wizard was rebuilt</li>
						</ul>', 'fulltext-search'),
			'is_rebuild' => true,
		),
		'2.27.85' => array(
			'text' => __('<ul><li>Added new parameters: "word_logic", "wpfts_disable", "cluster_weights", "display_attachments" to the WP_Query()</li>
						</ul>', 'fulltext-search'),
		),
		'1.40.146' => array(
			'text' => __('<ul><li>Big update: the new search algorithm and key improvements!</li>
							<li>New algorithm that <b>supports sentences</b></li>
							<li>Deep search is now faster</li>
							<li>Character limit was removed</li>
							<li>MyISAM support was dropped</li>
							<li>Faster index rebuilding</li>
						</ul><br>
						<p>Read the <a href="https://fulltextsearch.org/forum/topic/18/version-1-30-85-big-improvements-and-fixes" target="_blank">official announcement</a> on the WPFTS forum.</p>', 'fulltext-search'),
			'is_rebuild' => true,
		),		
	);

} else {
	// Free
	$wpfts_db_updates = array(
		'1.14.22' => array(
			'text' => __('<ul><li>Big update: lots of functions was moved from the Pro version to the Free WPFTS Version</li>
							<li>Some interface bugs were fixed</li>
							<li>Relevance formula was completely rebuilt</li>
							<li>Reindex algorithm was sufficiently improved (now 5 times faster!)</li>
							<li>Word max length was increased to 255 characters</li>
						</ul>', 'fulltext-search'),
			'is_rebuild' => true,
		),
		'1.22.46' => array(
			'text' => __('<ul><li>Introducing <b>Live Search</b>! You can switch Live Search ON with <b>WPFTS Fulltext Search</b> by replacing standard Search Widget by special one provided by the plugin (go to Appearance / Widgets and select <b>WPFTS :: Live Search</b>)</li></ul>', 'fulltext-search'),
		),
		'1.30.85' => array(
			'text' => __('<ul><li>Big update: the new search algorithm and key improvements!</li>
							<li>New algorithm that <b>supports sentences</b></li>
							<li>Deep search is now faster</li>
							<li>Character limit was removed</li>
							<li>MyISAM support was dropped</li>
							<li>Faster index rebuilding</li>
						</ul><br>
						<p>Read the <a href="https://fulltextsearch.org/forum/topic/18/version-1-30-85-big-improvements-and-fixes" target="_blank">official announcement</a> on the WPFTS forum.</p>', 'fulltext-search'),
			'is_rebuild' => true,
		),
	
	);
}

