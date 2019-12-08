const CHINESE_SCORE = 100
const MATH_SCORE = 100
const ENGLISH_SCORE = 100
const TOTAL_SCORE = 300
const STU_NUM = /\S/
export const validateScore = (stuNo,chinese,math,english,total)=>{
    if(!STU_NUM.test(stuNo)||stuNo===undefined){
        return false
    }else if(chinese>CHINESE_SCORE || chinese<0){
        console.log('语文分数不合法',chinese)
        return false
    }else if(math>MATH_SCORE || math<0){
        return false
    }else if(english>ENGLISH_SCORE || english<0){
        return false
    }else if(total>TOTAL_SCORE || total<0){
        return false
    }
    console.log("验证通过！")
    return true
}