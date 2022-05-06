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
        if (!isset($_POST["RegistrationButton"])) {
            header("Location: ..");
        }
        else {
            $dbconn = pg_connect("host=localhost dbname=login port=5432 user=postgres password=Zephyrus3!");
            $email = $_POST["MyEmail"];
            $query = "SELECT * FROM utenti WHERE email=$1";
            $result = pg_query_params($dbconn,$query,array($email));
            if ($tuple = pg_fetch_array($result,null,PGSQL_ASSOC)) {
                echo " Error on registration!<br/>";
                echo " An account with this email already exists.<br>";
                echo "Click  <a href=\"../login/index.html\"> here </a> and log in!"; 
            }
            else {
                $query2 = "INSERT into utenti values($1,$2,$3,$4,$5)";
                $nome = $_POST["MyName"];
                $cognome = $_POST["MyLname"];
                $password = md5($_POST["MyPassword"]);
                $cap = $_POST["MyCap"];
                $result = pg_query_params($dbconn,$query2,array($email,$nome,$cognome,$password,$cap));
                if($result){
                    echo "Registration went well!<br>";
                    echo "Click <a href=\"../login/index.html\"> here </a> to log in!";
                }
                else {
                    die("Ooops something went wrong :-(");
                }
            }
        }
    ?>
</body>
</html>
