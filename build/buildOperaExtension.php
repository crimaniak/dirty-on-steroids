<?php

error_reporting(E_ALL);
ini_set('display_errors', true);

include "BuildExtension.php";

class BuildOperaExtension extends BuildExtension {
    const EXT_DIR                   = "extensions/opera/dirtyMSP/";
    const EXT_FILE_NAME_TEMPLATE    = "dirtyMSP-%s.oex";
    const SUPER_VERSION             = 1;

    private $tmpPath                = null;

    public function getExtDir() {
        return $this->getRootDir().self::EXT_DIR;
    }

    public function getExtTmpDir() {
        if (is_null($this->tmpPath)) {
            $this->tmpPath = trim(shell_exec("mktemp -d -t fb-image-build.XXXXXXXXX"));
        }

        return $this->tmpPath.DIRECTORY_SEPARATOR;
    }

    public function copyCode() {
        shell_exec("cp -r {$this->getExtDir()} {$this->getExtTmpDir()}");

        shell_exec("cp {$this->getSourceJsFilePath()} {$this->getResJsFilePath()}");
    }

    private function getExtFileName() {
        return sprintf(self::EXT_FILE_NAME_TEMPLATE, $this->getVersion());
    }

    private function getResBundleFilePath() {
        return $this->getResultDir().$this->getExtFileName();
    }

    public function getExtFilePath() {
        return $this->getExtTmpDir().$this->getExtFileName();
    }

    public function getResJsFilePath() {
        return $this->getExtTmpDir()."includes/payload.js";
    }

    public function getManifestFilePath() {
        return $this->getExtTmpDir()."config.xml";
    }

    public function packExtension() {
        shell_exec("cd {$this->getExtTmpDir()}; zip -r -9 {$this->getExtFilePath()} *");
    }

    public function populateConfig() {
        $config = file_get_contents($this->getManifestFilePath());
        $configWithVersion = str_replace("@version@", $this->getVersion(), $config);
        file_put_contents($this->getManifestFilePath(), $configWithVersion);
    }

    public function moveProductToResultFolder() {
        unlink($this->getResBundleFilePath());
        copy($this->getExtFilePath(), $this->getResultDir().$this->getExtFileName());
    }

    public function build($arg) {
        $this->echoPaths();

        $this->copyCode();

        $this->populateConfig();

        $this->packExtension();

        $this->moveProductToResultFolder();

        $bundle = $this->getResBundleFilePath();

        if (file_exists($bundle)) {
            echo PHP_EOL;
            echo "New extension created at: {$bundle}".PHP_EOL;
            echo "Enjoy!".PHP_EOL;
        } else {
            echo "Something went wrong, please check the output above.".PHP_EOL;
        }
    }

    public function getVersion() {
        $buildNumber = $this->getBuildNumber();

        return self::SUPER_VERSION.".".$buildNumber;
    }
}

$builder = new BuildOperaExtension();
$builder->build(@$argv[1]);