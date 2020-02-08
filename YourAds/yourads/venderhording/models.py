from django.db import models
from vendernewspaper.models import *

# Create your models here.
class HordingType():
    def __init__(self):
        self.ht = db.collection(u'HordingType')
        self.oht = db.collection(u'ChildHordingType')

    def getHordingType(self):
        return OwnMethod.firestoneconvertdict(self.ht)

    def getChildHordingType(self,name):
        x=self.oht.where(u'type', u'==', name)
        return OwnMethod.firestoneconvertdict(x)

class VenderHording():
    database = db.collection(u'VenderHordingSaved')

    def __init__(self,imageurl,date,latlng,hordingtype,width,height,price,otherhordingtype,vehiclename,noploes):
        self.database = db.collection(u'VenderHordingSaved')
        self.imageurl=imageurl
        self.date=date
        self.latlng=latlng
        self.hordingtype=hordingtype
        self.width=width
        self.height=height
        self.price=price
        self.otherhordingtype=otherhordingtype
        self.vehiclename=vehiclename
        self.noploes=noploes

    def setHordingAds(self):
        data=self.alldictdata()
        data['hordingtype']=self.hordingtype
        data['width']=self.width
        data['height']=self.height
        data['price']=self.price
        self.database.document().set(data)

    def setGenetryGateAds(self):
        data = self.alldictdata()
        data['hordingtype'] = self.hordingtype
        data['price'] = self.price
        self.database.document().set(data)

    def setBusStopAds(self):
        data = self.alldictdata()
        data['hordingtype'] = self.hordingtype
        data['price'] = self.price
        self.database.document().set(data)

    def setDigitalAds(self,othername):
        data=self.alldictdata()
        data['hordingtype'] = self.hordingtype
        if othername == "Vehicle Screen Ads":
            data['childhordingtype'] = self.otherhordingtype
            data['vehiclename'] = self.vehiclename
            data['width'] = self.width
            data['height'] = self.height
            data['price'] = self.price
        self.database.document().set(data)

    def setRoadAds(self,othername):
        data=self.alldictdata()
        data['hordingtype'] = self.hordingtype
        if othername == "SidePole Ads":
            data['childhordingtype'] = self.otherhordingtype
            data['noof_poles'] = self.noploes
            data['width'] = self.width
            data['height'] = self.height
            data['price'] = self.price
        elif othername == "Divider Ads":
            data['childhordingtype'] = self.otherhordingtype
            data['noof_poles'] = self.noploes
            data['width'] = self.width
            data['height'] = self.height
            data['price'] = self.price
        self.database.document().set(data)

    def setVehicleAds(self,othername):
        data=self.alldictdata()
        data['hordingtype'] = self.hordingtype
        if othername == "Full Rikshaw Ads":
            data['childhordingtype'] = self.otherhordingtype
            data['vehiclename'] = self.vehiclename
            data['price'] = self.price
        elif othername == "Vehicle Poster Ads":
            data['childhordingtype'] = self.otherhordingtype
            data['vehiclename'] = self.vehiclename
            data['width'] = self.width
            data['height'] = self.height
            data['price'] = self.price
        elif othername == "Full Vehicle Ads":
            data['childhordingtype'] = self.otherhordingtype
            data['vehiclename'] = self.vehiclename
            data['price'] = self.price
        self.database.document().set(data)

    def alldictdata(self):
        data = {
            'imageurls': self.imageurl,
            'latlng': self.latlng,
            'presentbooking': self.date,
        }
        return data

    @classmethod
    def getHordingLatlng(cls,name):
        if name == "All":
            return OwnMethod.firestoneconvertdict(cls.database)
        elif name == "Hording Ads" or name == "BusStop Ads" or name == 'GenetryGate Ads':
            x=OwnMethod.firestoneconvertdict(db.collection('HordingType').where(u'name', u'==', name))
            for i in x:
                x=i
            return OwnMethod.firestoneconvertdict(cls.database.where(u'hordingtype', u'==', x))
        else:
            x = OwnMethod.firestoneconvertdict(db.collection('ChildHordingType').where(u'name', u'==', name))
            for i in x:
                x = i
            return OwnMethod.firestoneconvertdict(cls.database.where(u'childhordingtype', u'==', x))

