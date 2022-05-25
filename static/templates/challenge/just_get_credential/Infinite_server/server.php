<?php
    $i = 0;
    if(isset($_POST["Rosso"]) || isset($_POST["Verde"]) || isset($_POST["Blu"])) { 
        $result = $_POST["Rosso"].$_POST["Blu"].$_POST["Verde"];
        $rnd_color = $_POST["result"];
        echo '<pre>'+$rnd_color+'<pre>';
        echo $result;
        if($rnd_color==$result) echo "<p>CORRECT!!!</p>";
        header("Location: ./art_test.htlm");
    }
    
    ?>
