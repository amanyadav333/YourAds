import random
from firebase_admin import auth
from firebase import Firebase

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

class User:
    def __init__(self,name,email,password,contact,otp):
        self.id=''
        self.name =name
        self.email=email
        self.password=password
        self.contact=contact
        self.otp=otp
        self.status='Deactive'
        self.city_id=''
        self.address=''
        self.pancard=''
        self.company=''
        self.company_desc=''

    def save(self,db):
        user = auth.create_user(
            email=self.email,
            email_verified=False,
            password=self.password,
            disabled=True)
        data={
            'user_uid':user.uid,
            'name':self.name,
            'contact':self.contact,
            'city_id': '',
            'pancard_no': '',
            'address': '',
            'company': '',
            'company_description': ''
        }
        self.id=user.uid
        db.collection(u'User').document(str(user.uid)).set(data)
        return self

    def delete(self,db):
        auth.delete_user(self.id)
        db.collection('User').document(self.id).delete()

    def getdata(self,db,user):
        self.id=user['localId']
        self.email=user['email']
        self.status='Active'
        data=db.collection(u'User').document(self.id).get()
        data=data.to_dict()
        self.name=data['name']
        self.contact=data['contact']
        self.city_id=data['city_id']
        self.address=data['address']
        self.pancard=data['pancard_no']
        self.company_desc=data['description']
        self.company=data['company']
        return self

    def updateprofile(self, name, email, contact,db):
        self.email = email
        self.name = name
        self.contact = contact
        user_id = auth.update_user(self.id, email=email)
        vender_ref = db.collection(u'User').document(user_id.uid)
        vender_ref.update({u'name': self.name, 'contact': self.contact})
        return self

    def updatenewpassword(self, newpass):
        user_id = auth.update_user(self.id, password=newpass)
        return self

    def updatecompleteinfo(self, city, pancard, address,db):
        self.city_id = city
        self.pancard = pancard
        self.address = address
        vender_ref = db.collection(u'User').document(self.id)
        vender_ref.update({u'city_id': self.city_id, 'pancard_no': self.pancard, 'address': self.address})
        return self

    def updatecompanydet(self, name, email,db):
        self.company = name
        self.company_email = email
        vender_ref = db.collection(u'User').document(self.id)
        vender_ref.update({u'company': self.company, 'description': self.company_email})
        return self

class Area:
    def __init__(self,height,width):
        self.height = height
        self.width=width

    def setArea(self,db):
        data={u"height":self.height,u'width':self.width}
        area=db.document()
        area.set(data)
        return area.id

class Image:
    def __init__(self,image):
        self.image = image

    def uploadImage(self,storage):
        storage.child("UserNewspaperDisplay/"+self.image.name).put(self.image,"111111111111111111")
        return storage.child("UserNewspaperDisplay/"+self.image.name).get_url(None)

    def uploadHordingImage(self,storage):
        storage.child("VenderHordingSavedImages/"+(self.image.name+str(random.randint(1000,9999)))).put(self.image,"111111111111111111")
        return storage.child("VenderHordingSavedImages/"+self.image.name).get_url(None)

    def uploadvendersignature(self,id,name,img):
        if img != '':
            storage.child("vender/" + id + "-" + name + "/"+(img)).delete(
                "vender/" + id + "-" + name + "/"+(img))
        storage.child("vender/" + id + "-" + name + "/" + (self.image.name)).put(self.image,"000")
        return storage.child("vender/"+id+"-"+name+"/" +(self.image.name)).get_url(None)


class UserNewspaperDisplay:
    def __init__(self,area,imageurl,npname,city,page,price,date):
        self.areaid = area
        self.imageurl = imageurl
        self.newspapernameid = npname
        self.cityid = city
        self.supplement = page
        self.price = price
        self.publishdate = date

    def setUserNewspaperdisplay(self,db):
        data={u"areaid":self.areaid,u'imageurl':self.imageurl,u"newspapernameid":self.newspapernameid,
             u"cityid":self.cityid,u"supplement":self.supplement,u"price":self.price,u"publishdate":self.publishdate
        }   
        db.document().set(data) 






    
            


