<form class="row m0" action="action_contact.php" id="form" name="form" method="post" onsubmit="return validateForm();" style="padding-top: 15px;">

                            <div class="col-sm-12 p0 commenterInfoInputs">

                                <div class="row m0">

                                    <div class="input-group">

                                        <span class="input-group-addon"><i class="fa fa-user"></i></span>

                                        <input type="text" class="form-control" name="name" id="name" placeholder="Name">

                                    </div>

                                 </div> 

                                 <br/>  

                                 <div class="row m0">

                                    <div class="input-group">

                                        <span class="input-group-addon"><i class="fa fa-envelope"></i></span>

                                        <input type="text" class="form-control" name="email"  id="email" placeholder="E-mail">

                                    </div>

                                  </div>

                                  <br/>

                                  

                                  <div class="row m0">  

                                    <div class="input-group">

                                        <span class="input-group-addon"><i class="fa fa-phone"></i></span>

                                        <input type="text" name="Phone" id="Phone" class="form-control" placeholder="Phone No.">

                                    </div>

                                </div>

                                <br/>

                                

                                 <div class="row m0">  

                                    <div class="input-group" >

                                       

                                        <label class="captcha" >

                  <img src="CaptchaSecurityImages.php?width=100&height=40&characters=5" /><br><br>

                                <input id="security_code" name="security_code" type="text"  class="form-control" size="25"><br/>



                  </label>

                 

<br/><br/>

                                    </div>

                                </div>

                                

                            </div>

                            <div class="col-sm-12 p0">

                                <div class="row m0">                                        

                                    <div class="input-group" style="width: 100%;">

                                        <textarea placeholder="Message" name="message" value="Questions" id="message" class="form-control" rows="5"></textarea>

                                    </div>

                                    <br/>

                                    <input type="submit" name="submit" id="submit" value="Submit" >

                                  <!--  <button class="btn btn-default" type="submit" name="submit" value="Submit">Submit</button>-->

                                </div>

                            </div>

                        </form>