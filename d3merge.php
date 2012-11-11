<?php

/// Class to merge core script and modules
/// Quick and dirty 
class d3merge
{
	const core='d3.template.js';
	const output='result/d3.user.js';
	
	static public function run($arg)
	{
		chdir(dirname(__FILE__));
		$jQuery=file_get_contents('jquery.js');
		
		$names=file('modules.txt');
		$modules='';
		foreach($names as $fname)
		{
			$fname=preg_replace('![\\r\\n]+!','',$fname);
			if(empty($fname) || $fname[0]==';') continue;
			if(file_exists($fname))
			{
				echo "Add $fname\n";
				$modules.="\n".file_get_contents($fname);
			}
			else 
			{
				echo "Can't find $fname\n";
				return;
			}
		}

		$code=str_replace('@buildTime@',date('Y-m-d H:i:s')
				,str_replace('// @modules@',$modules
					,str_replace('// @jQuery@',$jQuery
						,file_get_contents(self::core))));

		if($arg=='release')
		{
			echo "Compressing...\n";
			require_once 'jsmin.php';
			$parts=explode('==/UserScript==',$code);			
			$parts[1]=JSMin::minify($parts[1]);
			$code=implode("==/UserScript==\n",$parts);
		}
		
		file_put_contents(realpath(self::output),$code);
					
		echo "done.\n";
		echo "Now install ".realpath(self::output)." script into your browser.\n";
	}
}

d3merge::run(@$argv[1]);
