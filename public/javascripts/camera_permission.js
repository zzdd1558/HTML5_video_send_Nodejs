window.onload = () => {

    // element selector
    const video = document.querySelector('#video');
    const employee_number = document.getElementById("employee-number");
    const user_name = document.getElementById("user-name");
    const send_capture = document.getElementById("capture");
    const image_canvas = document.getElementById("image-canvas");
    const ctx = image_canvas.getContext("2d");
    let captureStream = null;

    const snapShot = () => {
        if (captureStream) {
            ctx.drawImage(video, 0, 0);
            let data = image_canvas.toDataURL("image/png");

            return data;
        }
    }

    let cnt = 0;

    // 전송 버튼 click Event 처리.
    send_capture.addEventListener("click", () => {
        let employee_data = employee_number.value
        let user_name_data = user_name.value;
        let image = snapShot();

        let img_div = document.getElementById("img-div");

        // 이미지 5개 쌓일때마다 <br> 내림 처리.
        if( 4 < cnt ){
            var br = document.createElement("br");
            img_div.appendChild(br);

            cnt = 0;
        }

        cnt++;

        // 찍은 이미지 추가 .
        let img_tag = document.createElement("img");
        img_tag.src = image;
        img_tag.width = 200;
        img_tag.height = 150;
        img_div.appendChild(img_tag);

        let formData = new FormData();
        formData.append("employee" , employee_data)
        formData.append("user_name" , user_name_data)
        formData.append("image_base64" , image)

        sendRequest("http://127.0.0.1:3000/upload", formData, send_capture_response, "POST")
    });


    // error가 발생할경우 표시할 callback Function
    const errorCallback = (e) => {
        console.log('Rejected!', e);
    };


    // 동작하는 브라우저의 범위를 최대화 하기 위한 작업.
    if (navigator.mediaDevices === undefined) {

        // mediaDevices가 없다면 빈 객체로 초기화
        navigator.mediaDevices = {};

        navigator.mediaDevices.getUserMedia = (constraints) => {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error("유저미디어를 찾을수 없어 사용 불가능합니다."));
            }

            return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

    // video 속성.
    const attr = {video: {width: 600, height: 400}};

    navigator.mediaDevices.getUserMedia(attr)
        .then(localMediaStream => {

            // 최신 버전 브라우져
            if ("srcObject" in video) {
                video.srcObject = localMediaStream
            } else {
                // srcObject를 지원하지 않는 구버전 브라우져
                video.src = window.URL.createObjectURL(localMediaStream);
            }

            // 이미지 캡처를 위한 Stream 저장
            captureStream = localMediaStream;


            // video Stream 시작되었을때.
            video.onloadedmetadata = function (e) {
                video.play();
            };
        })
        .catch(errorCallback);
}


