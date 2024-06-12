import timesago from 'timesago'
import { firebase } from '../config'

export const fetchDonationRequests = async () => {
    const snapshot = await firebase.firestore().collection('don_req').get()
    const results = snapshot.docs.map((doc) => doc.data())
    console.log({ results })

    const _donationRequests = results.map((item) => {
        return {
            name: item.fullName,
            location: item.hospital,
            postedDate: timesago(item.timestamp),
            timestamp: Date.parse(item.timestamp),
            bloodType: item.bloodType,
            mobile: item.mobile,
        }
    })

    return _donationRequests
}

export const fetchCampaignList = async () => {
    const snapshot = await firebase.firestore().collection('campaign').get()
    const results = snapshot.docs.map((doc) => doc.data())
    console.log({ results })

    const _campaignlist = results.map((item) => {
        console.log(item.donationDate)
        return {
            orgName: item.organizerName,
            orgrName: item.organizationName,
            location: item.address,
            Date: item.donationDate,
            mobile: item.phoneNumber,
            note: item.note,
        }
    })

    return _campaignlist
}
