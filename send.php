<?php
include_once "config.php";

if ($_FILES){
    $files = uploadFiles($_FILES['files']);
    echo json_encode($files);
    exit();
}
$config = new myFormConfig();



$ru = array(
	'email' => 'Email',
	'phone' => 'Телефон',
	'city' => 'Город',
	'calc__order-receiver' => 'Куда отправить расчет',
	'comment' => 'Пожелания',
	'calc-model' => 'Модель кухни',
	'calc-form' => 'Форма кухни',
	'calc-material' => 'Материал фасадов',
	'calc-map-m' => 'Расположение мойки',
	'calc-map-d' => 'Расположение плиты',
	'calc-size' => 'Размеры стен',
	'calc-height' => 'Высота верхних полок',
	'calc-table' => 'Материал столещницы',
	'calc-furniture' => 'Фурнитура',
	'calc-date' => 'Когда планируют приобрести',
	'calc-technic' => 'Бытовая техника',
);


if ($_POST){
    $html = array();
    if (isset($_POST['title'])) {
        $html['title'] = $_POST['title'];
        unset($_POST['title']);
    } else{
		$html['title'] = "Расчет кухни [" . $_POST['city'] ."]";
	}
	if (isset($_POST['filelist'])) {
        $html['filelist'] = json_decode(($_POST['filelist']));
        unset($_POST['filelist']);
    }
    $html['body'] = $_POST;


    if ($config->sendMailAdmin && $config->adminEmail){
        sendEmail($html);
    }

	echo (json_encode($html));
}



function sendEmail($html){
	global $ru;
	global $config;
	$to      = $config->adminEmail;
	$subject = $html['title'].' с сайта '.$config->siteName;
	$headers = array();
	$headers[] = 'From: "'.$config->siteName.'" <'.$config->mailFrom.'>';
	if (isset($html['body']['email'])){
		$headers[] = 'Reply-To: '.$html['body']['email'];
	}
	$headers[] = 'Return-Path: '.$to;
	$headers[] = "Content-Type: text/html; charset=UTF-8";
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'X-Mailer: PHP/' . phpversion();

    $headers = implode("\r\n", $headers);
	$message= '
	<html>
	<title></title>
	<head>
	<meta http-equiv="Content-Type" content="text/html"; charset="utf-8">
	<body style="font-family:Fira Sans, Arial,sans-serif;font-size:15px;line-height:130%; color:#383838; background: #fff;">' . "\r\n" .
	'<table width="794px" align="center" border="0" cellspacing="0" cellpadding="0" style="line-height:130%; border:2px solid #555555;">
	<tr valign="top" style="background-color: #ffffff; ">' . "\r\n" .
	'<td style="padding:15px;vertical-align: middle;text-align: center; border-bottom:2px solid #555555;"><img src="'.$config->logoPath.'" style="width:100px;"></td>
	<td style="padding:15px;vertical-align: middle;text-align: center; font-size:25px; color: #000045;border-bottom:2px solid #555555;"><span style="padding:10px 20px; border-bottom: 2px solid #000045;border-top: 2px solid #000045;">'.$config->siteName.'</span></td>' . "\r\n" .
	'<td></td>
	</tr>
	<tr><td style="padding:10px;" colspan="3"><h3>'.$html['title'].'</h3></td></tr>' . "\r\n" ;
	foreach ($html['body'] as $key => $value) {
		if ($value) {
			if ($key == 'calc-map-m' || $key == 'calc-map-d') {
				$message.='<tr><td style="padding:10px;">'.$ru[$key].':</td><td style="padding:10px;" colspan="2"><img style="width:200px" src="'.$config->siteUrl.$value.'"></td></tr>' . "\r\n";
			} else{
				$message.='<tr><td style="padding:10px;">'.$ru[$key].':</td><td style="padding:10px;" colspan="2">'.$value.'</td></tr>' . "\r\n";
			}
		}
	};
	$message.='<tr><td style="padding:10px;" colspan="3">';
    foreach ($html['filelist'] as $file) {
        if ($file) {
            $message.='<a href="'.$config->siteUrl.$file.'" title="Открыть в полном размере"><img style="width:200px; max-height:250px; margin-right:10px" src="'.$config->siteUrl.$file.'"></a>' . "\r\n";
        }
    };
    $message.='</td></tr>';
	$message.='</table></body></html>';
	return mail($to, $subject, $message, $headers, '-f'.$config->mailFrom);
}

function uploadFiles($files){

    $allowed =  array('.gif','.png' ,'.jpg', '.jpeg', '.bmp');
    $token = implode("-",$_POST).strval(time());
    $uploads_dir = "/home/clients/webkirov43_ftp3/domains/kuhni.mebel-prestig.ru/html/usersupload/";
    if (!is_dir($uploads_dir)){
        mkdir($uploads_dir, 0755, true);
    }
    $flist = array();
    foreach ($files["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
                $tmp_name = $files["tmp_name"][$key];
                $name = basename($files["name"][$key]);
                preg_match('/\.\w{2,6}$/', $name, $typefile, PREG_OFFSET_CAPTURE);
                $typefile = $typefile[0][0];
                $name = date("Ymd")."_".md5($name.$token).$typefile;
            if(in_array(strtolower($typefile), $allowed) ) {
                $flist[] = "/usersupload/".$name;
                move_uploaded_file($tmp_name, $uploads_dir.$name);
            }
        }
    }
    return $flist;
}


?>