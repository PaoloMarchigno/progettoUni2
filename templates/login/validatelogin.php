<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        if (!isset($_POST["LoginButton"])) {
            header("Location: ..");
        }
        else {
            $dbconn = pg_connect("host=localhost dbname=login port=5432 user=postgres password=Zephyrus3!");
            $email = $_POST["MyEmail"];
            $query = "SELECT * FROM utenti WHERE email=$1";
            $result = pg_query_params($dbconn,$query,array($email));
            if (!($tuple = pg_fetch_array($result,null,PGSQL_ASSOC))) {
                echo " Error on Login!<br/>";
                echo " An account with this email doesn't exist.<br>";
                echo "Click  <a href=\"../Registration/index.html\"> here </a> to sign in!"; 
            }
            else {
                $query2 = "SELECT * from utenti WHERE email=$1 and passwd=$2";
                $password = md5($_POST["MyPassword"]);
                $result = pg_query_params($dbconn,$query2,array($email,$password));
                if ($tuple = pg_fetch_array($result,null,PGSQL_ASSOC)){
                    $name = $tuple["nome"];
                    echo "Login went well!<br>";
                    echo "Click <a href=\"../challenges/chall.php?name=$name\"> here </a> for getting started!";
                }
                else {
                    echo "Login went bad!";
                    echo "Incorrect password";
                    echo "Click <a href=\"../index.html\"> here </a> to retry!";
                }
            }
        }




    ?>
    
</body>
</html>