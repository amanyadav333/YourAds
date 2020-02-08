from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from firebase_admin import firestore
from firebase_admin import auth
from firebase import Firebase
from django.core.mail import send_mail
from vendernewspaper.models import *
from django.views.decorators.csrf import csrf_exempt
from .models import *
import random
import traceback
import hashlib

# firebase
config = {
  "apiKey": "AIzaSyBMKiaGBGcvWyEH7gnRG3CSs9D4bDPDm7s",
  "authDomain": "webfirebase-b8abc.firebaseapp.com",
  "databaseURL": "https://webfirebase-b8abc.firebaseio.com/",
  "storageBucket": "webfirebase-b8abc.appspot.com",
  "serviceAccount": "webfirebase-b8abc-firebase-adminsdk-xexh8-a11539f558.json"
}
firebase = Firebase(config)

# firebase storage
storage=firebase.storage()

# firebase firestone
db = firestore.client()

# firebase auth
auth2=firebase.auth()

def Index(request):
    newspaper_display_city=City.getCityByNewspaper("NewspaperDisplay")
    classified_text_city=City.getCityByNewspaper("ClassifiedText")
    width=db.collection(u"NewspaperSize").document("DmHU9dHwElfPrMXCZJfP").get().get('width')
    height=db.collection(u"NewspaperSize").document("DmHU9dHwElfPrMXCZJfP").get().get('height')
    return render(request,'home.html',{'classifiedtext_city':classified_text_city,'newspaperdisplay_city':newspaper_display_city,"width":width,"height":height,'usertype':'user'})


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
                            user = User(name, email, password, contact, otp).save(db)
                            context['user'] = "Success"
                            request.session['user'] = user
                        except Exception as e:
                            traceback.print_tb(e.__traceback__)
                            context['user'] = "Internet Problem"
                    except Exception as e:
                        traceback.print_tb(e.__traceback__)
                else:
                    context['user'] = "User Allready Exist"
            except Exception as e:
                traceback.print_tb(e.__traceback__)
                try:
                    num=send_mail('YourAds', "Your OTP is " + str(otp) + ".Please verify YourAds Account",'amanyadavwolvrine@gmail.com', [email], fail_silently=False)
                    print(num,"----------")
                    user = User(name, email, password, contact,otp).save(db)
                    context['user'] = "Success"
                    request.session['user']=user
                except Exception as e:
                    traceback.print_tb(e.__traceback__)
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
                            user = User('', '', '', '', '').getdata(db, user)
                            request.session['user']=user
                            context['login'] = 'success'
                        except Exception as e:
                            traceback.print_tb(e.__traceback__)
                            context['login'] = 'venderemail'
                    except Exception as e:
                        traceback.print_tb(e.__traceback__)
                        context['login']='invalid'
            except Exception as e:
                traceback.print_tb(e.__traceback__)
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
        if user != None:
            print(otp, user)
            if user.otp == int(otp):
                user.status = 'Active'
                print(user.id)
                try:
                    id = auth.update_user(
                        user.id, disabled=False)
                except Exception as e:
                    traceback.print_tb(e.__traceback__)
                user.id = id
                request.session['user'] = user
                return JsonResponse({'otp': 'right'})
            else:
                return JsonResponse({'otp': 'wrong'})
        else:
            return JsonResponse({'otp': 'session'})
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
        if value == 'user':
            user = request.session.get('user')
            user.otp = otpvalue
            email=user.email
            request.session['user'] = user
        elif value == 'userforget':
            email=request.POST.get('email')
        try:
            send_mail('YourAds', "Your OTP is " + str(otpvalue) + ".Please verify YourAds Account",
                      'amanyadavwolvrine@gmail.com', [email], fail_silently=True)
            context['resend']='success'
            context['otp']=otpvalue
        except Exception as e:
            traceback.print_tb(e.__traceback__)
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
        traceback.print_tb(e.__traceback__)
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
                traceback.print_tb(e.__traceback__)
                context['email'] = 'try again'
        except Exception as e:
            traceback.print_tb(e.__traceback__)
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
                    traceback.print_tb(e.__traceback__)
                    context['forget'] = "reenter password"
            except Exception as e:
                traceback.print_tb(e.__traceback__)
                context['forget'] = "change email"
            return JsonResponse(context)
        else:
            return JsonResponse({'forget': 'Invalid Feild'})
    else:
        return JsonResponse({'forget':'error'})

# ///////////////////////  profile  ////////////////////////////
def userprofile(request):
    city = City().getCity();
    context = {
        'usertype': 'user',
        'city':city
    }
    return render(request, 'profile.html',context)

# update profile
@csrf_exempt
def updateprofile(request):
    if request.method == "POST":
        email=request.POST.get('email')
        name=request.POST.get('name')
        contact=request.POST.get('contact')
        user=request.session.get('user')
        if user.email != email or user.name != name or user.contact != contact:
            context={}
            if email != '' and name != '' and len(contact) == 10:
                try:
                    user = user.updateprofile(name, email, contact,db)
                    request.session['user'] = user
                    context['forget'] = "success"
                except Exception as e:
                    traceback.print_tb(e.__traceback__)
                    context['forget'] = "Try again"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'update feilds same'})
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
        if oldpass != '' and newpass != '':
            try:
                auth2.sign_in_with_email_and_password(user.email, oldpass)
                try:
                    user=user.updatenewpassword(newpass)
                    request.session['user']=user
                    context['forget'] = "success"
                except Exception as e:
                    traceback.print_tb(e.__traceback__)
                    context['forget'] = "Try again"
            except Exception as e:
                traceback.print_tb(e.__traceback__)
                context['forget'] = "password wrong"
            return JsonResponse(context)
        else:
            return JsonResponse({'forget': 'Invalid Feild'})
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
        if user.city_id != city or user.pancard != pancard or user.address != address:
            if city != '' and pancard != '' and address != '':
                try:
                    user = user.updatecompleteinfo(city,pancard,address,db)
                    request.session['user'] = user
                    context['forget'] = "success"
                except Exception as e:
                    traceback.print_tb(e.__traceback__)
                    context['forget'] = "password wrong"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'updates are same'})
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
        if user.company != name or user.company_email != email:
            if name != '' and email != '':
                try:
                    user = user.updatecompanydet(name,email,db)
                    request.session['user'] = user
                    context['forget'] = "success"
                except Exception as e:
                    traceback.print_tb(e.__traceback__)
                    context['forget'] = "password wrong"
                return JsonResponse(context)
            else:
                return JsonResponse({'forget': 'Invalid Feild'})
        else:
            return JsonResponse({'forget': 'updates are same'})
    else:
        return JsonResponse({'forget':'error'})



# /////////////////////////////////////////////////////////////  Newspaper  //////////////////////////////////////////////////////////////////

# newspaper display booking
def newspaperdisplaybook(request):
    print("11111111111111111")
    if request.method=='POST':
        newsname=request.POST.get('newspapername')
        city=request.POST.get('city')
        page=request.POST.get('page')
        width=request.POST.get('width')
        height=request.POST.get('height')
        date=request.POST.get('publishdate')
        price=request.POST.get('price')
        image=request.FILES['newsimage']
        areaid=Area(height,width).setArea(db.collection(u'Area'))
        imageurl=Image(image).uploadImage(storage)
        usernpdisplay=UserNewspaperDisplay(areaid,imageurl,newsname,city,page,price,date)
        usernpdisplay.setUserNewspaperdisplay(db.collection(u'UserNewspaperDisplay'))
    return HttpResponse("not success")

# get city newspaper names
@csrf_exempt
def getcitynewspapername(request):
    npname=[]
    npnameid=[]
    if request.method == "POST":
        city = request.POST.get('value')
        if city != '':
            try:
                col_query = db.collection(u'CityNewspaper').where(u'city_id', u'==', city).get()
                for doc in col_query:
                    npnameid.append(doc.get('newspaper_name_id'))
                    npname.append(db.collection(u"NewspaperName").document(doc.get('newspaper_name_id')).get().get('name'))
                return JsonResponse({'user':'success','npname':npname,'npnameid':npnameid})
            except Exception as e:
                traceback.print_tb(e.__traceback__)
                return JsonResponse({'user':'firebase'})
        else:
            return JsonResponse({'user':'Invalid Feild'})
    else:
        return JsonResponse({'user': 'error'})

# get newspaper pages
@csrf_exempt
def getnewspaperpage(request):
    npname_dict={}
    if request.method == "POST":
        newspapername = request.POST.get('newspaper')
        city = request.POST.get('city')
        page=[]
        price=[]
        id=''
        if newspapername != '' and city != '':
            try:
                citynp = db.collection(u'CityNewspaper').where(u'city_id', u'==', city).where(u'newspaper_name_id', u'==', newspapername).get()
                for doc in citynp:
                    id=doc.id
                vnwp = db.collection(u'VenderNewspaper').where(u'city_newspaper_id', u'==', id).where(u'newspaper_type', u'==', 'MK0wmDijbelXkYN3U5wX').get()
                for doc in vnwp:
                    page=doc.get('supplements')
                    price=doc.get('price')
                print(page,price)
                return JsonResponse({'user':'success','page': page,"price":price})
            except Exception as e:
                traceback.print_tb(e.__traceback__)
                return JsonResponse({'user':'firebase'})
        else:
            return JsonResponse({'user':'Invalid Feild'})
    else:
        return JsonResponse({'user': 'error'})

# get newspaperclasifiedtext color and price
@csrf_exempt
def getnewspaperclasstext(request):
    npname_dict={}
    if request.method == "POST":
        newspapername = request.POST.get('newspaper')
        city = request.POST.get('city')
        color=[]
        price=[]
        id=''
        citynp = db.collection(u'CityNewspaper').where(u'cityid', u'==', city).where(u'newspapernameid', u'==', newspapername).get()
        for doc in citynp:
            id=doc.id
        pages = db.collection(u'VenderClassifiedText').where(u'citynewspaperid', u'==', id).get()
        for doc in pages:
            color=doc.get('color')
            price=doc.get('colorprice')
    return JsonResponse({'color': color,"price":price})


# pages show
def editor(request):
    return render(request,'editor.html')

def profilem(request):
    return render(request,'mobile/uprofile.html')

def about(request):
    return render(request,'about.html')

def cart(request):
    return render(request,'cart.html')