import {
  BRIDE_PHONE,
  BRIDE_ACCOUNT,
  BRIDE_FATHER_PHONE,
  BRIDE_FATHER_ACCOUNT,
  BRIDE_MOTHER_PHONE,
  BRIDE_MOTHER_ACCOUNT,
  GROOM_PHONE,
  GROOM_ACCOUNT,
  GROOM_FATHER_PHONE,
  GROOM_FATHER_ACCOUNT,
  GROOM_MOTHER_PHONE,
  GROOM_MOTHER_ACCOUNT,
} from "./env"
import {
  BRIDE_FULLNAME,
  BRIDE_FATHER,
  BRIDE_MOTHER,
  GROOM_FULLNAME,
  GROOM_FATHER,
  GROOM_MOTHER,
} from "./const"

export const BRIDE_INFO = [
  {
    relation: "신부",
    name: BRIDE_FULLNAME,
    phone: BRIDE_PHONE,
    account: BRIDE_ACCOUNT,
  },
  {
    relation: "신부 아버지",
    name: BRIDE_FATHER,
    phone: BRIDE_FATHER_PHONE,
    account: BRIDE_FATHER_ACCOUNT,
  },
  {
    relation: "신부 어머니",
    name: BRIDE_MOTHER,
    phone: BRIDE_MOTHER_PHONE,
    account: BRIDE_MOTHER_ACCOUNT,
  },
]

export const GROOM_INFO = [
  {
    relation: "신랑",
    name: GROOM_FULLNAME,
    phone: GROOM_PHONE,
    account: GROOM_ACCOUNT,
  },
  {
    relation: "신랑 아버지",
    name: GROOM_FATHER,
    phone: GROOM_FATHER_PHONE,
    account: GROOM_FATHER_ACCOUNT,
  },
  {
    relation: "신랑 어머니",
    name: GROOM_MOTHER,
    phone: GROOM_MOTHER_PHONE,
    account: GROOM_MOTHER_ACCOUNT,
  },
]
