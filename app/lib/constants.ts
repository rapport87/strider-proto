export const PASSWORD_REGEX = new RegExp(/^(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
export const PASSWORD_REGEX_ERR_MSG = "암호는 반드시 영문자, 숫자, 특수문자를 포함해야 합니다";
export const PASSWORD_MIN_LENGTH = 8;