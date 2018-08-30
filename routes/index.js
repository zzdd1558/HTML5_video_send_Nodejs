let express = require('express');
let multer = require('multer');
let crypto = require('crypto');
let fs = require('fs');
let path =require('path');
let router = express.Router();


// 전송된 이미지 저장 경로 .
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({storage: storage});


/* GET home page. */
router.get('/', (req, res, next) => {
    console.log(__dirname);
    res.render('index', {title: 'Express'});
});

router.post('/upload', upload.none(), (req, res, err) => {

    if (err) {
        console.log(err)
    }

    let employee = req.body["employee"];
    let user_name = req.body["user_name"];
    let image_base64 = req.body["image_base64"];

    // console.log(employee)
    // console.log(user_name)
    // console.log(image_base64)

    // 중복되지 않은 랜덤 String 이미지값을 위한 crypto 처리.
    let seed = crypto.randomBytes(20);
    let uniqueSHA1String = crypto
        .createHash('sha1')
        .update(seed)
        .digest('hex');

    try {

        // encoding 되어있는 dataString을 다시 image 화 하기 위한 decodeing 메소드
        let decodeBase64Image = (dataString) => {
            let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let response = {};

            if (matches.length !== 3) {
                return new Error('잘못된 데이터 입니다 . ');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');

            return response;
        }

        let imageBuffer = decodeBase64Image(image_base64);
        let userUploadedFeedMessagesLocation = './uploads/';

        let uniqueRandomImageName = `${employee}_${uniqueSHA1String}`;


        //파일의 타입을 찾기위한 . Reg 식
        const imageTypeRegularExpression = /\/(.*?)$/;

        // 파일의 타입 확장자에 대한 정보 저장 .
        // imageTypeDetected[0] : /png
        // imageTypeDetected[1] : png
        let imageTypeDetected = imageBuffer
            .type
            .match(imageTypeRegularExpression);

        // 이미지 저장경로 및 이미지 이름 .
        let save_employee_name = `${userUploadedFeedMessagesLocation}${employee}_${user_name}`;
        let uploadImagePath = save_employee_name + "/" +
            uniqueRandomImageName +
            '.' +
            imageTypeDetected[1];

        // Save decoded binary image to disk

        console.log(save_employee_name);
        if(!fs.existsSync(save_employee_name)){
            fs.mkdirSync(save_employee_name,`0777`,true);
        }

        try{
            fs.writeFile(uploadImagePath, imageBuffer.data , () => {
                console.log(`DEBUG - 저장경로 :: ${uploadImagePath}`);
            });
        } catch  ( error ){
            console.log(`이미지 쓰는 도중 Exception 발생 :: ${error}`);
        }
    }
    catch (error) {
        console.log(`ERROR:  ${error}`);
    }


    res.type('application/json');
    res.json(200, {
        "hello": "123"
    });
})

module.exports = router;