<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/scores', 'getScores');
$app->get('/scores/:query',	'getByIdOrName');
$app->get('/scores/search/:query', 'findByName');
$app->post('/scores', 'addScore');
$app->put('/scores/:id', 'updateScore');

$app->run();

function getScores() {
	$sql = "select * FROM apitest ORDER BY score DESC";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$scores = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"score": ' . json_encode($scores) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getByIdOrName($query) {
	if(ctype_digit($query)){
		$sql = "SELECT * FROM apitest WHERE id=:query";
	} else {
		$sql = "SELECT * FROM apitest WHERE name=:query";
	}
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$score = $stmt->fetchObject();  
		$db = null;
		echo json_encode($score); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addScore() {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$score = json_decode($body);
	$sql = "INSERT INTO apitest (name, score) VALUES (:name, :score)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $score->name);
		$stmt->bindParam("score", $score->score);
		$stmt->execute();
		$score->id = $db->lastInsertId();
		$db = null;
		echo json_encode($score); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

// only update score when new score is greater than old score
function updateScore($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$score = json_decode($body);
	$sql = "UPDATE apitest SET score=:score WHERE id=:id AND :score>score";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("score", $score->score);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		$count = $stmt->rowCount();
		if($count > 0){
			echo json_encode($score);
		} else {
			echo 'No Update. Score lower than highscore.';
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM apitest WHERE UPPER(name) LIKE :query ORDER BY score";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$scores = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"score": ' . json_encode($scores) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="";
	$dbname="test";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>