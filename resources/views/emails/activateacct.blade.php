<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Activate Account</title>
</head>
<body>    
    <div style="padding-bottom: 10px; padding-top: 10px;">
        Note : Please click button below to activate your user account.
    </div>
    
    <div>
        <a href="http://127.0.0.1:8000/api/activateaccount/{{$data['userid']}}" style="position:absolute ;background-color: green;color:white;border-radius: 25px;width: 200px; height: 25px; padding: 5px;; text-align: center; text-decoration: none;">Activate Account</a>
    </div>            
</body>
</html>