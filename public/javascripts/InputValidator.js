

class InputValidator {

    // 사번 검증 7자리의 사번으로 구성, 영문 , 한글 , 특수문자 불가능
    static isValidEmployeeNumber( employee_number ){

        let employee_regex = /^[0-9]{7}$/g;
        return this.isValidate(employee_number , employee_regex);
    }

    // 이름 검증
    static isValidName( name ){

        //let name_regex = /^[a-zA-Z]{4,20}$/g;
        let name_regex = /^[가-힣]{2,4}$/g;
        return this.isValidate(name , name_regex);
    }

    // 검증 부분
    static isValidate( value  , regex){
        return this.isSet(value) && regex.test(value);
    }

    // 값이 존재는 하지만 길이가 없는부분에 대한 검증
    static isSet(value ){
        return !this.isUndefined(value) && (value.length > 0 || value > 0);
    }

    // 값이 설정되지 않은 undefined에 대한 검증.
    static isUndefined(value){
        return typeof value === 'undefined';

    }
}