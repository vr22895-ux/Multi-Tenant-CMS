<?PHP 

session_start();

?><style>
.new_test{
	font-family:Calibri;  font-style:italic; font-size:10px;}
</style>
<?PHP


if($_POST['submit']){	
$name2 = $_POST['name'];
$email2 = $_POST['email'];
$tel= $_POST['Phone'];
$_SESSION['security_code'];
$security_code=$_POST['security_code'];
if( $_SESSION['security_code'] == $_POST['security_code'] && !empty($_SESSION['security_code'] ) ) {
	
/*$web2 = mysql_escape_string($_POST['web2']); 
$address2=  mysql_escape_string($_POST['address2']);*/
$feedback=mysql_escape_string($_POST['message']);


$message = '<html><body>';
$message .= '<center><table rules="all" style="border:0px solid #666;" border="0" cellpadding="3" cellspacing="3" width="600px" class="new_test">';
$message .= "<tr style='background: #ECECEC;'><td colspan='2'><a href='http://www.metalministry.in/' target='_blank'>
<img src='http://www.metalministry.in/images/logo1.png' width='250px' ></a>
<a href='http://www.metalministry.in/' target='_blank' style='text-decoration:none;'><strong><center>www.metalministry.in</center></strong> </a></td></tr>";
$message .= "<tr><td colspan='2' align='center'>&nbsp;</td></tr>";	
$message .= "<tr><td colspan='2' style='text-decoration:none;'>Product Enquiry Details - www.metalministry.in</td></tr>";	
$message .= "<tr><td colspan='2'>&nbsp;</td></tr>";			
$message .= "<tr><td width='20%'><strong>Name</strong> </td><td width='80%'>".strip_tags($_POST['name'])."</td></tr>";
$message .= "<tr><td  width='20%'><strong>Email ID </strong> </td><td width='80%'>".strip_tags($_POST['email'])."</td></tr>";
$message .= "<tr><td  width='20%'><strong>Phone No</strong> </td><td width='80%'>".strip_tags($_POST['Phone'])."</td></tr>";
$message .= "<tr><td  width='20%'><strong>Message</strong> </td><td width='80%'>".strip_tags($_POST['message'])."</td></tr>";
$message .= "</table></center>";
$message .= "</body></html>";

$EmailTo = "enquiry@metalministry.in";
$ser= "Metalministryenq@gmail.com";
$headers = "".strip_tags($_POST['email'])."\r\n";
$headers .= "Reply-To: ". strip_tags($_POST['email']) . "\r\n";
$headers .= "Bcc: ". $ser. "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
$Subject = "Product Enquiry Details - www.metalministry.in";
// send email 
 $success = mail($EmailTo, $Subject, $message, "From: $headers") or die(" not send");
if($success){ echo "<script>window.location='thank-you.html'</script>";}
 } else {
		// Insert your code for showing an error message here
		echo 'Sorry, you have provided an invalid security code';
   }	
}
?>