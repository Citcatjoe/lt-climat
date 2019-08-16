<?php
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

// Config
require_once __DIR__ . '/vendor/autoload.php';

$request = Request::createFromGlobals();

$trusted_hosts = '/(20ans|labs)\.letemps\.ch|localhost|127.0.0.1/';
$host = $request->server->get('HTTP_HOST');
if (!preg_match($trusted_hosts, $host)) {
	die('Arf.');
}
$uri = $request->getPathInfo();

$dirs  = [];
$dirs[] = __DIR__;
$dirs[] = __DIR__ . '/templates';
if (is_dir( __DIR__ . '/../../_admin/templates')) {
	$dirs[] =  __DIR__ . '/../../_admin/templates';
}

if (strpos($request->server->get('HTTP_HOST'), 'localhost') !== FALSE) {
	$dirs[] = __DIR__ . '/../web/_admin/templates';
}

$loader = new Twig_Loader_Filesystem($dirs);
$twig = new Twig_Environment($loader);

// Variables
$variables = [];
if (file_exists(__DIR__ . '/variables.json')) {
	$variables = json_decode(file_get_contents(__DIR__ . '/variables.json'), TRUE);
}

// Application variables (as URL and more)
$app = new stdClass();

$app->url = 'https://' . $host . $uri;
$app->base_url = 'https://' . $host;
$app->base_path = $uri;
$variables = array_merge($variables, ['app' => $app]);

// Si plusieurs pages
$template = '00.html.twig';

$path = ltrim($uri, '/');
$aliases  = [
	'' => '00',
	'temps-engager' => '00',
	'monde' => '01',
	'suisse' => '02',
	'economie' => '03',
	'opinions' => '04',
	'culture' => '05',
	'sciences' => '06',
	'sport' => '07',
	'societe' => '08',
	'hyperlien' => '09'
];

echo '<!--' . $path . ' -->';

// Sub page is requested
if (!empty($path)) {
	$template = $aliases[$path] . '.html.twig';

	if (!file_exists('./templates/' . $template)) {
		die('Glup.');
	}

	$variables = array_merge($variables, [
		'active_page' => $aliases[$path]
	]);
}

// Render the template
$content = $twig->render($template, $variables);

// Send response
$response = new Response(
    $content,
    Response::HTTP_OK,
    array('content-type' => 'text/html')
);

$response->prepare($request);
$response->send();