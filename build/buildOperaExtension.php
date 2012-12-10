#!/usr/bin/php
<?php
/**
 * From @alexzabolotny:
 * Apparently, this build script will work only under Mac OS or Linux, or other system with bash commands.
 * Cygwin should work too, but i haven't tested.
 */

error_reporting(E_ALL);
ini_set('display_errors', true);

// copy files into temp folder
$srcDir = __DIR__."/../extensions/opera/dirtyMSP/";
$payloadFromPath = __DIR__."/../result/d3.user.js";
$payloadToPath = $srcDir."/includes/payload.js";

$payloadTemplate = file_get_contents($srcDir."/../payload.template.js");
file_put_contents(
	$payloadToPath,
	str_replace(
		array(
			"//@@payload@@",
		),
		array(
			file_get_contents($payloadFromPath),
		),
		$payloadTemplate
	)
);

$tmpSrcDir = trim(shell_exec("mktemp -d -t fb-image-build.XXXXXXXXX"));
$productFileName = "dirtyMSP-%s.oex";

echo "Copying sources into {$tmpSrcDir} ...".PHP_EOL;
shell_exec("cp -r {$srcDir} {$tmpSrcDir}");

// parse config to find out the version
$extensionConfig = simplexml_load_file($tmpSrcDir."/config.xml");
$attributes = $extensionConfig->attributes();
$extensionVersion = $attributes['version'][0];

// make zip, copy, rename
$packageName = $tmpSrcDir."/".sprintf($productFileName, $extensionVersion);

echo "Packing into {$packageName} ...".PHP_EOL;
shell_exec("cd {$tmpSrcDir}; zip -r -9 {$packageName} *");
shell_exec("mv {$packageName} {$srcDir}/../../../result/");
echo "Placed package into ".realpath($srcDir."/../../result/").PHP_EOL;

exit(0);