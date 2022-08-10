const REST_API_KEY = "332d131cbd88829ce06cb917276c31e9";
const REDIRECT_URI =  "http://localhost:3000/lobby/rooms";
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=
${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;