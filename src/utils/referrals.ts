/* eslint @typescript-eslint/no-var-requires: "off" */
import { AbiItem } from 'web3-utils'
import referralABI from 'config/abi/referral.json'
import { getReferralAddress } from 'utils/addressHelpers'
import { getWeb3 } from 'utils/web3'
import CryptoJS from 'crypto-js'

// const CryptoJS = require('crypto-js')
const web3 = getWeb3()
const referralContract = new web3.eth.Contract(referralABI as unknown as AbiItem, getReferralAddress())
const secretKey = 'epicswap'
const hexPrefix = '0x'
const zeroAddress = `${hexPrefix}0000000000000000000000000000000000000000`
const epicRefCodeCookieKey = 'referral_code'

export const generateReferralLink = (account) => {
  const simplifieldAccount = account.replace(hexPrefix, '')
  const code = CryptoJS.Rabbit.encrypt(simplifieldAccount, secretKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding,
  })
    .toString()
    .replace('==', '')
  const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://www.epicswap.io' : 'http://localhost:3000'
  return `${BASE_URL}?ref=${code}`
}

export function getReferralCookie() {
  const epicCookie = document.cookie.split('; ').find((row) => row.startsWith(`${epicRefCodeCookieKey}=`))
  if (typeof epicCookie === 'undefined') {
    return ''
  }

  return epicCookie.split('=')[1]
}

export async function setReferralCode(referralCode, account) {
  const searchParams = new URLSearchParams(referralCode)
  const isRefNotExists = searchParams.get('ref') === null
  const isAccountNotExist = account === null
  if (isRefNotExists || isAccountNotExist) {
    return false
  }

  const hasExistingCookie = getReferralCookie()
  const referrerAddress = await referralContract.methods.getReferrer(account).call()

  const hasExistingReferrer = referrerAddress !== zeroAddress
  if (hasExistingCookie || hasExistingReferrer) {
    return false
  }

  // using searchParams.get('ref') functions removes some characters from the url
  const cleanRefferalCode = `${referralCode.replace('?ref=', '')}==`
  const decryptedReferrereAddress = CryptoJS.Rabbit.decrypt(cleanRefferalCode, secretKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding,
  }).toString(CryptoJS.enc.Utf8)
  const referrereAddress = `${hexPrefix}${decryptedReferrereAddress}`

  if (account === referrereAddress) {
    return false
  }

  if (document.cookie.indexOf(epicRefCodeCookieKey) === -1) {
    document.cookie = `${epicRefCodeCookieKey}=${cleanRefferalCode}`
  }

  return true
}

export function getReferralCode() {
  const cookieValue = getReferralCookie()
  if (!cookieValue) {
    return zeroAddress
  }

  const decryptedReferrereAddress = CryptoJS.Rabbit.decrypt(cookieValue, secretKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding,
  }).toString(CryptoJS.enc.Utf8)

  const referrereAddress = `${hexPrefix}${decryptedReferrereAddress}`
  document.cookie = `${epicRefCodeCookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`

  return referrereAddress
}

export default generateReferralLink
