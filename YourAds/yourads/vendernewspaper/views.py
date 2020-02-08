from django.shortcuts import render
from firebase_admin import auth
from firebase import Firebase
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from .models import *
#from venderhording.models import *
from usernewspaper.models import *
import random
import json

# firebase
config = {
  "apiKey": "AIzaSyBMKiaGBGcvWyEH7gnRG3CSs9D4bDPDm7s",
  "authDomain": "webfirebase-b8abc.firebaseapp.com",
  "databaseURL": "https://webfirebase-b8abc.firebaseio.com/",
  "storageBucket": "webfirebase-b8abc.appspot.com",
  "serviceAccount": "webfirebase-b8abc-firebase-adminsdk-xexh8-a11539f558.json"
}
firebase = Firebase(config)
# firebase auth
auth2=firebase.auth()

def vender(request):
    user =request.session.get('user')
    city = City().getCity()
    newspaper_name = NewspaperName().getNewspaperName()
    dict={}
    if user != None:
        for i in newspaper_name:
            for j in user.newspaper:
                if i==j:
                    dict[i]=newspaper_name[i]
    return render(request, 'vender/vender.html',{'city':city,'newspapername':dict,'usertype':'vender'})

#  user registration
@csrf_exempt
def register(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        contact = request.POST.get('contact')
        otp = random.randint(1000, 9999)
        context={}
        if name!='' and email!='' and password!='' and len(contact)==10 and len(password)>=6:
            try:
                user = auth.get_user_by_email(email)
                if user.disabled == True:
                    try:
                        auth.delete_user(user.uid)
                        db.collection('User').document(user.uid).delete()
                        try:
                            num = send_mail('YourAds', "Your OTP is " + str(otp) + ".Please verify YourAds Account",
                                            'amanyadavwolvrine@gmail.com', [email], fail_silently=False)
                            print(num, "----------")
                            user = Vender(name, email, password, contact, otp).save(db)
                            context['user'] = "Success"
                            request.session['user'] = user
                        except Exception as e:
                            print(e.__traceback__)
                            context['user'] = "Internet Problem"
                    except Exception as e:
                        print(e.__traceback__)
                else:
                    context['user'] = "User Allready Exist"
            except Exception as e:
                print(e)
                try:
                    num=send_mail('YourAds', "Your OTP is " + str(otp) + ".Please verify YourAds Account",'amanyadavwolvrine@gmail.com', [email], fail_silently=False)
                    print(num,"----------")
                    user = Vender(name, email, password, contact,otp).save(db)
                    context['user'] = "Success"
                    request.session['user']=user
                except Exception as e:
                    print(e.__traceback__)
                    context['user'] = "Internet Problem"
            return JsonResponse(context)
        else:
            return JsonResponse({'user':'Invalid Feild'})
    else:
        return JsonResponse({'user': 'error'})

# login user
@csrf_exempt
def login(request):
    if request.method=='POST':
        email=request.POST.get('email')
        password=request.POST.get('password')
        context = {}
        if email != '' and password != '' and len(password) >= 6:
            try:
                user = auth.get_user_by_email(email)
                if user .disabled == True:
                    context['login']='deactive'
                else:
                    try:
                        user=auth2.sign_in_with_email_and_password(email, password)
                        try:
                            user = Vender('', '', '', '', '').getdata(db, user)
                            request.session['user']=user
                            context['login'] = 'success'
                        except Exception as e:
                            print(e)
                            context['login'] = 'useremail'
                    except Exception as e:
                        print(e,"---------------")
                        context['login']='invalid'
            except Exception as e:
                print(e)
                context['login'] = 'not exist'
            return JsonResponse(context)
        else:
            return JsonResponse({'login': 'invalid'})
    else:
        return JsonResponse({'login': 'error'})

#  otp checking
@csrf_exempt
def otp(request):
    if request.method == "POST":
        otp = request.POST.get('otp')
        user =request.session.get('user')
        print(otp,type(user.otp))
        if user.otp == int(otp):
            user.status = 'Active'
            print(user.id)
            try:
                id = auth.update_user(
                user.id,disabled=False)
            except Exception as e:
                print(e)
            user.id=id
            request.session['user'] = user
            return JsonResponse({'otp': 'right'})
        else:
            return JsonResponse({'otp': 'wrong'})
    else:
        return JsonResponse({"otp":"error"})


#  otp is resending
@csrf_exempt
def resendotp(request):
    if request.method == "POST":
        value=request.POST.get('value')
        email=''
        context={}
        otpvalue = random.randint(1000, 9999)
        if value == 'vender':
            user = request.session.get('user')
            user.otp = otpvalue
            email=user.email
            request.session['user'] = user
        elif value == 'venderforget':
            email=request.POST.get('email')
        try:
            send_mail('YourAds', "Your OTP is " + str(otpvalue) + ".Please verify YourAds Account",
                      'amanyadavwolvrine@gmail.com', [email], fail_silently=True)
            context['resend']='success'
            context['otp']=otpvalue
        except Exception as e:
            print(e)
            context['resend'] = 'try again'
        return JsonResponse(context)
    else:
        return JsonResponse({'resend': 'error'})


#  goto Register page and delete session and firebase value ( change email )
def gotoregisterpage(request):
    user =request.session.get('user')
    try:
        user.delete(db)
        del request.session['user']
    except Exception as e:
        print(e)
    return JsonResponse({'date':''})



#  forget password email send and verify
@csrf_exempt
def forgetemailverify(request):
    if request.method == "POST":
        context={}
        email= request.POST.get('email')
        otpvalue = random.randint(1000, 9999)
        print(email,'************')
        try:
            user = auth.get_user_by_email(email)
            try:
                send_mail('YourAds', "Your OTP is " + str(otpvalue) + ".Please verify YourAds Account",'amanyadavwolvrine@gmail.com', [email], fail_silently=True)
                context['otp']=otpvalue
                context['email'] = 'success'
            except Exception as e:
                print(e)
                context['email'] = 'try again'
        except Exception as e:
            print(e)
            context['email'] = "User Not Exist"
        return JsonResponse(context)
    else:
        print(4)
        return JsonResponse({'email': 'error'})

#  forget password
@csrf_exempt
def forgetpassword(request):
    if request.method == "POST":
        email=request.POST.get('email')
        password=request.POST.get('password')
        user=''
        context={}
        if email != '' and password != '' and len(password) >= 6:
            try:
                user = auth.get_user_by_email(email)
                try:
                    user = auth.update_user(user.uid,password=password)
                    context['forget'] = "success"
                except Exception as e:
                    print(e.__traceback__)
                    context['forget'] = "reenter password"
            except Exception as e:
                print(e)
                context['forget'] = "change email"
            return JsonResponse(context)
        else:
            return JsonResponse({'forget': 'Invalid Feild'})
    else:
        return JsonResponse({'forget':'error'})

# //////////////////////////////////////////////  vender profile  /////////////////////////

def profile(request):
    user=request.session.get('user')
    city=City().getCity();
    city_newspaper=CityNewspaper('','').getAllCityNewspaper()
    newspaper_name=NewspaperName().getNewspaperName()
    dict={}
    if user != None:
        for i in newspaper_name:
            for j in user.newspaper:
                if i==j:
                    dict[i]=newspaper_name[i]
    vender_newspaper=VenderNewspaper('').getNewspaper()
    context={
        'usertype': 'vender',
        'city': city,
        'city_newspaper': city_newspaper,
        'newspapername': dict,
        'vender_newspaper': vender_newspaper,
    }
    return render(request, 'vender/profile.html',context)

# update profile
@csrf_exempt
def updateprofile(request):
    if request.method == "POST":
        email=request.POST.get('email')
        name=request.POST.get('name')
        contact=request.POST.get('contact')
        user=request.session.get('user')
        if user != None:
            if user.email != email or user.name != name or user.contact != contact:
                context = {}
                if email != '' and name != '' and len(contact) == 10:
                    try:
                        user = user.updateprofile(name, email, contact)
                        request.session['user'] = user
                        context['forget'] = "success"
                    except Exception as e:
                        print(e)
                        context['forget'] = "Try again"
                    return JsonResponse(context)
                else:
                    return JsonResponse({'forget': 'Invalid Feild'})
            else:
                return JsonResponse({'forget': 'update feilds same'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# update new passsword
@csrf_exempt
def updatepassword(request):
    if request.method == "POST":
        oldpass=request.POST.get('oldpass')
        newpass=request.POST.get('newpass')
        context={}
        user=request.session.get('user')
        if user != None:
            if oldpass != '' and newpass != '':
                if oldpass == newpass:
                    try:
                        auth2.sign_in_with_email_and_password(user.email, oldpass)
                        try:
                            user = user.updatenewpassword(newpass)
                            request.session['user'] = user
                            context['forget'] = "success"
                        except Exception as e:
                            print(e)
                            context['forget'] = "Try again"
                    except Exception as e:
                        print(e)
                        context['forget'] = "password wrong"
                        return JsonResponse(context)
                else:
                    return JsonResponse({'forget': 'update feilds same'})
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# update complete information
@csrf_exempt
def completeinfo(request):
    if request.method == "POST":
        city=request.POST.get('city')
        pancard=request.POST.get('pancard')
        address=request.POST.get('address')
        context={}
        user=request.session.get('user')
        if user != None:
            if user.city_id != city or user.pancard != pancard or user.address != address:
                if city != '' and pancard != '' and address != '':
                    try:
                        user = user.updatecompleteinfo(city, pancard, address)
                        request.session['user'] = user
                        context['forget'] = "success"
                    except Exception as e:
                        print(e)
                        context['forget'] = "Try again"
                    return JsonResponse(context)
                else:
                    return JsonResponse({'forget': 'Invalid Feild'})
            else:
                return JsonResponse({'forget': 'updates are same'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# update company information
@csrf_exempt
def companydetail(request):
    if request.method == "POST":
        name=request.POST.get('name')
        email=request.POST.get('email')
        context={}
        user=request.session.get('user')
        if user != None:
            if user.company != name or user.company_email != email:
                if name != '' and email != '':
                    try:
                        user = user.updatecompanydet(name, email)
                        request.session['user'] = user
                        context['forget'] = "success"
                    except Exception as e:
                        print(e)
                        context['forget'] = "Try again"
                    return JsonResponse(context)
                else:
                    return JsonResponse({'forget': 'Invalid Feild'})
            else:
                return JsonResponse({'forget': 'updates are same'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# /////////////////////////  Bank details ///////////////////////////////////////
# gstinno saved
@csrf_exempt
def gstinnosave(request):
    if request.method == "POST":
        gst=request.POST.get('gstin')
        print(gst)
        context={}
        user=request.session.get('user')
        if user != None:
            if gst != '':
                try:
                    user = user.gstinsave(gst)
                    request.session['user'] = user
                    context['forget'] = "success"
                except Exception as e:
                    print(e)
                    context['forget'] = "Try again"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# Signature upload
@csrf_exempt
def signature(request):
    if request.method == "POST":
        img=request.FILES.get('file')
        print(img)
        context={}
        user=request.session.get('user')
        if user != None:
            if img != '':
                try:
                    img.name="signature"
                    url=Image(img).uploadvendersignature(user.id,user.name,user.signature_name)
                    try:
                        user = user.signaturesave(img.name, url)
                        request.session['user'] = user
                        context['forget'] = "success"
                    except Exception as e:
                        print(e)
                        context['forget'] = "Try again"
                except Exception as e:
                    print(e)
                    context['forget'] = "imagefirebase"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# bank details
@csrf_exempt
def account(request):
    if request.method == "POST":
        name=request.POST.get('name')
        no=request.POST.get('accno')
        ifsc=request.POST.get('ifsc')
        context={}
        user=request.session.get('user')
        if user != None:
            if name != '' and ifsc !='' and no !='':
                try:
                    user = user.accountsave(name,no,ifsc)
                    request.session['user'] = user
                    print("****************");
                    context['forget'] = "success"
                except Exception as e:
                    print(e)
                    context['forget'] = "Try again"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# vender attach newspaper
@csrf_exempt
def attachnewspaper(request):
    if request.method == "POST":
        name=request.POST.get('name')
        context={}
        user=request.session.get('user')
        if user != None:
            if name != '':
                try:
                    value = ''
                    col_snapshot = db.collection(u"NewspaperName").where(u'name', u"==", name).get()
                    for doc in col_snapshot:
                        value = doc.id
                    if value == '':
                        con = user.attachnewspaper(name)
                        request.session['user'] = con['self']
                        context['forget'] = "success"
                        context['id'] = con['id']
                    else:
                        context['forget'] = "name allready exists"
                except Exception as e:
                    print(e)
                    context['forget'] = "Try again"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})

# vender attach newspaper deleted
@csrf_exempt
def attachnewspaperrename(request):
    if request.method == "POST":
        name=request.POST.get('name')
        id=request.POST.get('id')
        context={}
        print("newspaper rename")
        user=request.session.get('user')
        if user != None:
            if id != '':
                user = user.attachnewspaperrename(id,name)
                request.session['user'] = user
                context['forget'] = "success"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'session'})
    else:
        return JsonResponse({'forget':'error'})


# /////////////////////////////  newspaper /////////////////////////////////////////

# newspaperdisplay
@csrf_exempt
def newspaperdisplay(request):
    if request.method == "POST":
        city = CityNewspaper(request.POST.get('npname'),request.POST.get('city'))
        page = json.loads(request.POST.get('page'))
        price = json.loads(request.POST.get('price'))
        newspaperdisplay_id = request.POST.get('id')
        print(city,page,price,newspaperdisplay_id,"6666666666666666666")
        user=request.session.get('user')
        if user != None:
            if city != '' and page != '' and price != '':
                try:
                    citynewspaperid = city.checkCityNewspaper()
                    if (citynewspaperid == ''):
                        citynewspaperid = city.setCityNewspaper()
                    venderdisplay = VenderNewspaper(user.id)
                    id=venderdisplay.getNewspaperType("NewspaperDisplay Ads")
                    col_snapshot = db.collection(u"VenderNewspaper").where(u'city_newspaper_id', u"==",citynewspaperid).where(u'newspaper_type', u"==",id).stream()
                    doc_id = ''
                    for doc in col_snapshot:
                        doc_id = doc.id
                    if doc_id == '':
                        venderdisplay.setNewspaperDisplay(citynewspaperid, price, page,id,newspaperdisplay_id)
                        return JsonResponse({'date': 'success'})
                    else:
                        return JsonResponse({'date': 'update'})
                except Exception as e:
                    print(e)
                    return JsonResponse({'date':'firebase'})
            else:
                return JsonResponse({'date':'invalid feilds'})
        else:
            return JsonResponse({'date':'invalid session'})
    else:
        return JsonResponse({'date':'error'})

# classified text
@csrf_exempt
def classifiedtext(request):
    if request.method == "POST":
        print("1111111111111111",request.POST.get('npname'))
        city = CityNewspaper(request.POST.get('npname'),request.POST.get('city'))
        color = json.loads(request.POST.get('color'))
        price = json.loads(request.POST.get('price'))
        newspaperclastext_id = request.POST.get('id')
        user = request.session.get('user')
        if user != None:
            if city != '' and color != '' and price != '':
                try:
                    citynewspaperid = city.checkCityNewspaper()
                    if (citynewspaperid == ''):
                        citynewspaperid = city.setCityNewspaper()
                    venderclasstext = VenderNewspaper(user.id)
                    id=venderclasstext.getNewspaperType("ClassifiedText Ads")
                    col_snapshot = db.collection(u"VenderNewspaper").where(u'city_newspaper_id', u"==", citynewspaperid).where(u'newspaper_type', u"==", id).stream()
                    doc_id=''
                    for doc in col_snapshot:
                        doc_id=doc.id
                    if doc_id == '':
                        venderclasstext.setClassifiedText(citynewspaperid, price, color,id,newspaperclastext_id)
                        return JsonResponse({'date': 'success'})
                    else:
                        return JsonResponse({'date': 'update'})
                except Exception as e:
                    print(e)
                    return JsonResponse({'date': 'firebase'})
            else:
                return JsonResponse({'date': 'invalid feilds'})
        else:
            return JsonResponse({'date': 'invalid session'})
    else:
        return JsonResponse({'date': 'error'})

# classified display
@csrf_exempt
def classifieddisplay(request):
    if request.method == "POST":
        city = CityNewspaper(request.POST.get('npname'),request.POST.get('city'))
        black= request.POST.get('black')
        white = request.POST.get('white')
        adssize = request.POST.get('size')
        newspaperclassdisp_id = request.POST.get('id')
        user = request.session.get('user')
        if user != None:
            if city != '' and black != '' and white != '' and adssize != '':
                try:
                    citynewspaperid = city.checkCityNewspaper()
                    if (citynewspaperid == ''):
                        citynewspaperid = city.setCityNewspaper()
                    venderclassdisplay = VenderNewspaper(user.id)
                    id=venderclassdisplay.getNewspaperType("ClassifiedDisplay Ads")
                    col_snapshot = db.collection(u"VenderNewspaper").where(u'city_newspaper_id', u"==",citynewspaperid).where(u'newspaper_type', u"==",id).stream()
                    doc_id = ''
                    for doc in col_snapshot:
                        doc_id = doc.id
                    if doc_id == '':
                        venderclassdisplay.setClassifiedDisplay(citynewspaperid, black, white,id,newspaperclassdisp_id,adssize)
                        return JsonResponse({'date': 'success'})
                    else:
                        return JsonResponse({'date': 'update'})
                except Exception as e:
                    print(e)
                    return JsonResponse({'date': 'firebase'})
            else:
                return JsonResponse({'date': 'invalid feilds'})
        else:
            return JsonResponse({'date': 'invalid session'})
    else:
        return JsonResponse({'date': 'error'})

# pages show
def profilem(request):
    return render(request,'mobile/vender/vprofile.html')        
