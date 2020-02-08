from firebase_admin import auth
from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin



# firebase firestone
cred = credentials.Certificate("webfirebase-b8abc-firebase-adminsdk-xexh8-a11539f558.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Create your models here.
class Vender:
    def __init__(self,name,email,password,contact,otp):
        self.id=''
        self.name =name
        self.email=email
        self.password=password
        self.contact=contact
        self.profile_name=''
        self.profile_url=''
        self.otp=otp
        self.status='Deactive'
        self.city_id=''
        self.address=''
        self.pancard=''
        self.company=''
        self.company_desc=''
        self.gstin_no=''
        self.signature_name=''
        self.signature_url=''
        self.account_name=''
        self.account_no=''
        self.account_ifsc=''
        self.newspaper=[]


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
            'company_description': '',
            'gstin_number':'',
            'signature_name':'',
            'signature_url':'',
            'account_name':'',
            'account_number':'',
            'account_ifsc':'',
            'profile_name':'',
            'profile_url':'',
            'newspaper_names':[],
        }
        self.id=user.uid
        db.collection(u'Vender').document(str(user.uid)).set(data)
        return self

    def delete(self,db):
        auth.delete_user(self.id)
        db.collection('User').document(self.id).delete()

    def getdata(self,db,user):
        self.id=user['localId']
        self.email=user['email']
        self.status='Active'
        data=db.collection(u'Vender').document(self.id).get()
        data = data.to_dict()
        self.name=data['name']
        self.contact=data['contact']
        self.city_id=data['city_id']
        self.address=data['address']
        self.pancard=data['pancard_no']
        self.company_desc=data['company_description']
        self.company=data['company']
        self.gstin_no=data['gstin_number']
        self.account_name=data['account_name']
        self.account_no=data['account_number']
        self.account_ifsc=data['account_ifsc']
        self.signature_url=data['signature_url']
        self.signature_name=data['signature_name']
        self.profile_name=data['profile_name']
        self.profile_url=data['profile_url']
        self.newspaper=data['newspaper_names']
        print(self.id)
        return self

    def updateprofile(self,name,email,contact):
        self.email=email
        self.name=name
        self.contact=contact
        user_id=auth.update_user(self.id, email=email)
        vender_ref = db.collection(u'Vender').document(user_id.uid)
        vender_ref.update({u'name': self.name,'contact':self.contact})
        return self

    def updatenewpassword(self,newpass):
        user_id = auth.update_user(self.id, password=newpass)
        return self

    def updatecompleteinfo(self,city,pancard,address):
        self.city_id=city
        self.pancard=pancard
        self.address=address
        vender_ref = db.collection(u'Vender').document(self.id)
        vender_ref.update({u'city_id': self.city_id, 'pancard_no': self.pancard,'address': self.address})
        return self

    def updatecompanydet(self,name,email):
        self.company=name
        self.company_desc=email
        vender_ref = db.collection(u'Vender').document(self.id)
        vender_ref.update({u'company': self.company, 'company_description': self.company_desc})
        return self

    def gstinsave(self,gst):
        self.gstin_no = gst+""
        vender_ref = db.collection(u'Vender').document(self.id)
        vender_ref.update({u'gstin_number': self.gstin_no})
        return self

    def signaturesave(self,name,url):
        self.signature_name=name
        self.signature_url=url
        vender_ref = db.collection(u'Vender').document(self.id)
        vender_ref.update({u'signature_name': self.signature_name,u'signature_url': self.signature_url})
        return self

    def accountsave(self,name,no,ifsc):
        self.account_name=name
        self.account_no=no
        self.account_ifsc=ifsc
        vender_ref = db.collection(u'Vender').document(self.id)
        vender_ref.update({'account_name': self.account_name,'account_number':self.account_no,'account_ifsc':self.account_ifsc})
        return self

    def attachnewspaper(self,name):
        data={'name':name}
        ref = db.collection(u'NewspaperName').document()
        self.newspaper.append(ref.id)
        ref.set(data)
        vender_ref = db.collection(u'Vender').document(self.id)
        vender_ref.update({'newspaper_names':self.newspaper})
        context={'self':self,'id':ref.id}
        return context

    def attachnewspaperrename(self,id,name):
        db.collection(u'NewspaperName').document(id).set({'name':name})
        return self



class OwnMethod():
    def firestoneconvertdict(y):
        x=y.get()
        value={}
        for doc in x:
            for j in doc.to_dict():
                value[doc.id]=doc.to_dict()[j]
        return value

class City():
    def __init__(self):
        self.city = db.collection(u'City')

    def getCity(self):
        return OwnMethod.firestoneconvertdict(self.city)

    @classmethod
    def getCityByNewspaper(cls,type):
        nwpnameids=[]
        dict={}
        nwpdisp_city=''
        if type == "NewspaperDisplay":
            nwpdisp_city = db.collection(u'VenderNewspaper').where(u'newspaper_type', u'==', 'MK0wmDijbelXkYN3U5wX').get()
        elif type == "ClassifiedText":
            nwpdisp_city = db.collection(u'VenderNewspaper').where(u'newspaper_type', u'==', 'MK0wmDijbelXkYN3U5wX').get()
        elif type == "ClassifiedDisplay":
            nwpdisp_city = db.collection(u'VenderNewspaper').where(u'newspaper_type', u'==', 'MK0wmDijbelXkYN3U5wX').get()
        city_name=OwnMethod.firestoneconvertdict(db.collection(u'City'))
        nwpdisp_city = db.collection(u'VenderNewspaper').where(u'newspaper_type', u'==', 'MK0wmDijbelXkYN3U5wX').get()
        for doc in nwpdisp_city:
            nwpnameids.append(db.collection(u"CityNewspaper").document(doc.get('city_newspaper_id')).get().get('city_id'))
        for i,j in city_name.items():
            for k in nwpnameids:
                if k == i:
                    dict[i]=j
        return dict


class NewspaperName():
    def __init__(self):
        self.newspapername = db.collection(u'NewspaperName')

    def getNewspaperName(self):
        return OwnMethod.firestoneconvertdict(self.newspapername)

class CityNewspaper():
    def __init__(self,name,city):
        self.newspapernameid = name
        self.cityid=city
        self.id=''

    def setcityid(self,id):
        self.cityid=id

    def checkCityNewspaper(self):
        value=''
        col_snapshot=db.collection(u"CityNewspaper").where(u'city_id',u"==",self.cityid).where(u'newspaper_name_id',u"==",self.newspapernameid).get()
        for doc in col_snapshot:
            value=doc.id
        return value

    def setCityNewspaper(self):
        data={u"city_id":self.cityid,u'newspaper_name_id':self.newspapernameid}
        citynp=db.collection(u'CityNewspaper').document()
        self.id=citynp.id
        citynp.set(data)
        return self.id

    def getCityNewspaperid(self):
        return self.id

    def getCityNewspaper(self):
        value=db.collection(u'CityNewspaper').where(u'city_id', u'==', self.city).get()
        return value

    def getAllCityNewspaper(self):
        value = db.collection(u'CityNewspaper').list_documents()
        list = []
        for key in value:
            dict=key.get().to_dict()
            dict['id']=key.id
            list.append(dict)
        return list


class VenderNewspaper():
    def __init__(self,id):
        self.venderid=id

    def getNewspaperType(self,name):
        id=''
        value = db.collection(u'NewspaperType').where(u'name', u'==', name).stream()
        for doc in value:
            id=doc.id
        return id

    def setNewspaperDisplay(self,citynewspaperid,price,supplements,type,npdisplay_id):
        data={u"vender_id":self.venderid,
            u"newspaper_type": type,
            u'city_newspaper_id': citynewspaperid,
            u"price": price,
            u"supplements": supplements,
        }
        if npdisplay_id == '':
            db.collection(u'VenderNewspaper').document().set(data)
        else:
            db.collection(u'VenderNewspaper').document(npdisplay_id).set(data)

    def setClassifiedText(self,citynewspaperid,price,color,type,classtext_id):
        data={u"vender_id":self.venderid,
            u"newspaper_type": type,
            u'city_newspaper_id': citynewspaperid,
            u"colorprice": price,
            u"color": color,
        }
        if classtext_id == '':
            db.collection(u'VenderNewspaper').document().set(data)
        else:
            db.collection(u'VenderNewspaper').document(classtext_id).set(data)

    def setClassifiedDisplay(self,citynewspaperid,blackprice,colorprice,type,npclassdisp_id,size):
        data={u"vender_id":self.venderid,
            u"newspaper_type": type,
            u'city_newspaper_id': citynewspaperid,
            u"black_white_price": blackprice,
            u"color_price": colorprice,
            u"ads_size_type": size,
        }
        if npclassdisp_id == '':
            db.collection(u'VenderNewspaper').document().set(data)
        else:
            db.collection(u'VenderNewspaper').document(npclassdisp_id).set(data)


    def getNewspaper(self):
        value=db.collection(u'VenderNewspaper').list_documents()
        list = []
        for key in value:
            dicts=key.get().to_dict()
            dicts['id']=key.id
            list.append(dicts)
        return list
