//集合
let lineCollection = [];
let lampCollection = [];
let pathCollection = [];

let marker;
let lineMarker;
let lampMarker;
//通过回路算法得到的数组
let lineArr = [];


/**
 * 回路1
 */
//线路点
lineMarker = [{"x":102.511855,"y":25.22456},{"x": 102.505246, "y": 25.227375}];
lampMarker = [{"x":102.511641,"y":25.224662},{"x":102.511137,"y":25.224885},{"x":102.510568,"y":25.225128},{"x":102.509956,"y":25.22539},{"x":102.509425,"y":25.225613},{"x":102.508937,"y":25.225817},{"x":102.508433,"y":25.226026},{"x":102.507934,"y":25.226234},{"x":102.507398,"y":25.226472},{"x":102.507017,"y":25.226632},{"x":102.506502,"y":25.226841},{"x":102.506126,"y":25.227011},{"x":102.505702,"y":25.227176},{"x":102.50537,"y":25.227302}];
//通过回路算法得到的数组
lineArr = [];
lineArr.push([102.511855,25.22456,1,0]);
lineArr.push([102.511641,25.224662,2,0]);
lineArr.push([102.511137,25.224885,2,1]);
lineArr.push([102.510568,25.225128,2,2]);
lineArr.push([102.509956,25.22539,2,3]);
lineArr.push([102.509425,25.225613,2,4]);
lineArr.push([102.508937,25.225817,2,5]);
lineArr.push([102.508433,25.226026,2,6]);
lineArr.push([102.507934,25.226234,2,7]);
lineArr.push([102.507398,25.226472,2,8]);
lineArr.push([102.507017,25.226632,2,9]);
lineArr.push([102.506502,25.226841,2,10]);
lineArr.push([102.506126,25.227011,2,11]);
lineArr.push([102.505702,25.227176,2,12]);
lineArr.push([102.50537,25.227302,2,13]);
lineArr.push([102.505246,25.227375,1,1]);

lineCollection.push(lineMarker);
lampCollection.push(lampMarker);
pathCollection.push(lineArr);


/**
 * 回路2
 */
//线路点
lineMarker = [{"x":102.511855,"y":25.22456},{"x":102.511463,"y":25.223502},{"x":102.511571,"y":25.218639}];
lampMarker = [{"x":102.511737,"y":25.224298},{"x":102.511614,"y":25.223963},{"x":102.511507,"y":25.223647},{"x":102.511448,"y":25.223177},{"x":102.511469,"y":25.222716},{"x":102.511491,"y":25.222371},{"x":102.511485,"y":25.222027},{"x":102.511501,"y":25.221629},{"x":102.511507,"y":25.221279},{"x":102.511517,"y":25.220911},{"x":102.511528,"y":25.220508},{"x":102.511533,"y":25.220095},{"x":102.511544,"y":25.219678},{"x":102.511555,"y":25.219217},{"x":102.511565,"y":25.218862}];
//通过回路算法得到的数组
lineArr = [];
lineArr.push([102.511855,25.22456,1,0]);
lineArr.push([102.511737,25.224298,2,0]);
lineArr.push([102.511614,25.223963,2,1]);
lineArr.push([102.511507,25.223647,2,2]);
lineArr.push([102.511463,25.223502,1,1]);
lineArr.push([102.511448,25.223177,2,3]);
lineArr.push([102.511469,25.222716,2,4]);
lineArr.push([102.511491,25.222371,2,5]);
lineArr.push([102.511485,25.222027,2,6]);
lineArr.push([102.511501,25.221629,2,7]);
lineArr.push([102.511507,25.221279,2,8]);
lineArr.push([102.511517,25.220911,2,9]);
lineArr.push([102.511528,25.220508,2,10]);
lineArr.push([102.511533,25.220095,2,11]);
lineArr.push([102.511544,25.219678,2,12]);
lineArr.push([102.511555,25.219217,2,13]);
lineArr.push([102.511565,25.218862,2,14]);
lineArr.push([102.511571,25.218639,1,2]);
lineCollection.push(lineMarker);
lampCollection.push(lampMarker);
pathCollection.push(lineArr);

/**
 * 回路3
 */
lineMarker = [{"x":102.512062,"y":25.224674},{"x":102.513312,"y":25.226994},{"x":102.514358,"y":25.227396}];
lampMarker = [{"x":102.512177,"y":25.224863},{"x":102.512397,"y":25.225281},{"x":102.512563,"y":25.225616},{"x":102.512714,"y":25.225907},{"x":102.512928,"y":25.226309},{"x":102.51318,"y":25.226722},{"x":102.513593,"y":25.2271},{"x":102.514135,"y":25.227329}];
lineArr = [];
lineArr.push([102.512062,25.224674,1,0]);
lineArr.push([102.512177,25.224863,2,0]);
lineArr.push([102.512397,25.225281,2,1]);
lineArr.push([102.512563,25.225616,2,2]);
lineArr.push([102.512714,25.225907,2,3]);
lineArr.push([102.512928,25.226309,2,4]);
lineArr.push([102.51318,25.226722,2,5]);
lineArr.push([102.513312,25.226994,1,1]);
lineArr.push([102.513593,25.2271,2,6]);
lineArr.push([102.514135,25.227329,2,7]);
lineArr.push([102.514358,25.227396,1,2]);
lineCollection.push(lineMarker);
lampCollection.push(lampMarker);
pathCollection.push(lineArr);


/**
 * 回路4
 */
lineMarker = [{"x":102.512062,"y":25.224674},{"x":102.518188,"y":25.222107}];
lampMarker = [{"x":102.512526,"y":25.22447},{"x":102.512977,"y":25.224286},{"x":102.513449,"y":25.224082},{"x":102.514012,"y":25.223849},{"x":102.514613,"y":25.223592},{"x":102.514999,"y":25.223432},{"x":102.515412,"y":25.223257},{"x":102.515863,"y":25.223068},{"x":102.51627,"y":25.222908},{"x":102.516758,"y":25.222728},{"x":102.517182,"y":25.222515},{"x":102.51759,"y":25.222345},{"x":102.517992,"y":25.222175}];
lineArr = [];
lineArr.push([102.512062,25.224674,1,0]);
lineArr.push([102.512526,25.22447,2,0]);
lineArr.push([102.512977,25.224286,2,1]);
lineArr.push([102.513449,25.224082,2,2]);
lineArr.push([102.514012,25.223849,2,3]);
lineArr.push([102.514613,25.223592,2,4]);
lineArr.push([102.514999,25.223432,2,5]);
lineArr.push([102.515412,25.223257,2,6]);
lineArr.push([102.515863,25.223068,2,7]);
lineArr.push([102.51627,25.222908,2,8]);
lineArr.push([102.516758,25.222728,2,9]);
lineArr.push([102.517182,25.222515,2,10]);
lineArr.push([102.51759,25.222345,2,11]);
lineArr.push([102.517992,25.222175,2,12]);
lineArr.push([102.518188,25.222107,1,1]);
lineCollection.push(lineMarker);
lampCollection.push(lampMarker);
pathCollection.push(lineArr);

/**
 * 综合设备箱
 * @type {({x: number, y: number})[]}
 */
let integratedEquipmentBoxPointA = [{"x":102.511094,"y":25.223754},{"x":102.512907,"y":25.225414}];
let integratedEquipmentBoxPointB = [{"x":102.510675,"y":25.224643},{"x":102.513223,"y":25.224555}];
let concentratorPointA = {"x":102.51141,"y":25.22438};
let concentratorPointB = {"x":102.512488,"y":25.224759};

/**
 * 电线颜色
 * @type {string}
 */
const lineColor = "#000000";
/**
 * 回路线的颜色
 * @type {string}
 */
const loopLineColor = "#3045B1";
/**
 * 异常回路线的颜色
 * @type {string}
 */
const exceptionLoopLineColor = "#FF4807";
/**
 * 离线回路的颜色
 * @type {string}
 */
const offlineLoopLineColor = "#C6CADA";



const lineIcon = new AMap.Icon({
    size: new AMap.Size(30, 30),    // 图标尺寸
    image: 'img/line.png',  // Icon的图像
    imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 正常灯杆图标
 * @type {AMap.Icon}
 */
const normalIcon = new AMap.Icon({
    size: new AMap.Size(56, 56),    // 图标尺寸
    image: 'img/normalLamp.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(56, 56)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 故障灯杆图标
 * @type {AMap.Icon}
 */
const exceptionIcon = new AMap.Icon({
    size: new AMap.Size(56, 56),    // 图标尺寸
    image: 'img/exceptionLamp.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(56, 56)   // 根据所设置的大小拉伸或压缩图片
});


/**
 * 离线灯杆图标
 * @type {AMap.Icon}
 */
const offlineIcon = new AMap.Icon({
    size: new AMap.Size(56, 56),    // 图标尺寸
    image: 'img/offlineLamp.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(56, 56)   // 根据所设置的大小拉伸或压缩图片
});


/**
 * 正常综合杆图标
 * @type {AMap.Icon}
 */
const multipleNormalIcon = new AMap.Icon({
    size: new AMap.Size(72, 72),    // 图标尺寸
    image: 'img/multipleNormalLamp.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(72, 72)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 故障综合杆图标
 * @type {AMap.Icon}
 */
const multipleExceptionIcon = new AMap.Icon({
    size: new AMap.Size(72, 72),    // 图标尺寸
    image: 'img/multipleExceptionLamp.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(72, 72)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 离线综合杆图标
 * @type {AMap.Icon}
 */
const multipleOfflineIcon = new AMap.Icon({
    size: new AMap.Size(72, 72),    // 图标尺寸
    image: 'img/multipleOfflineLamp.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(72, 72)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 综合设备箱图标
 * @type {AMap.Icon}
 */
const integratedEquipmentBoxIconA = new AMap.Icon({
    size: new AMap.Size(30, 30),    // 图标尺寸
    image: 'img/integratedEquipmentBoxIconA.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 综合设备箱图标
 * @type {AMap.Icon}
 */
const integratedEquipmentBoxIconB = new AMap.Icon({
    size: new AMap.Size(30, 30),    // 图标尺寸
    image: 'img/integratedEquipmentBoxIconB.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
});


/**
 * 集中器图标
 * @type {AMap.Icon}
 */
const concentratorA = new AMap.Icon({
    size: new AMap.Size(30, 30),    // 图标尺寸
    image: 'img/concentratorA.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
});

/**
 * 集中器图标
 * @type {AMap.Icon}
 */
const concentratorB = new AMap.Icon({
    size: new AMap.Size(30, 30),    // 图标尺寸
    image: 'img/concentratorB.png',  // Icon的图像
    // imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
});

const tempList = [0, 5, 10, 15];



/**
 * 线路报警
 */
function police(line, lampIndex) {
    if ($('#loop-'+line).attr("status") == "0") {
        //回路为关闭状态，无法故障报警
        return;
    }
    //先恢复
    for (let i = 0; i < lampPointList[line].length; i++) {
        let flag = true;
        tempList.forEach(function (e) {
            if (e == i) {
                lampPointList[line][i].setIcon(multipleNormalIcon);
                flag = false;
            }
        })
        if (flag) {
            lampPointList[line][i].setIcon(normalIcon);
        }
    }
    for (let i = 0; i < lineLoopList[line].length; i++) {
        lineLoopList[line][i].setOptions({
            strokeColor: loopLineColor
        });
    }

    //路灯点变红色
    for (let i = lampIndex; i < lampPointList[line].length; i++) {
        pathCollection[line].forEach(function (element) {
            if (lampPointList[line][i].getPosition().lng == element[0] && lampPointList[line][i].getPosition().lat == element[1]) {
                let flag = true;
                tempList.forEach(function (e) {
                    if (e == i) {
                        lampPointList[line][i].setIcon(multipleExceptionIcon);
                        flag = false;
                    }
                })
                if (flag) {
                    lampPointList[line][i].setIcon(exceptionIcon);
                }
            }
        })
    }
    //查询到第几个点
    let j = 0;
    for (let i = 0; i < pathCollection[line].length; i++) {
        if (pathCollection[line][i][2] == 2 && pathCollection[line][i][3] == lampIndex) {
            j = i;
            break;
        }
    }
    //线路变红
    for (; j < lineLoopList[line].length; j++) {
        lineLoopList[line][j].setOptions({
            strokeColor: exceptionLoopLineColor
        });
    }
}


/**
 * 路灯报警
 * @param line
 * @param lampIndex
 */
function policeLamp(line, lampIndex) {
    if ($('#loop-'+line).attr("status") == "0") {
        //回路为关闭状态，无法故障报警
        return;
    }
    //路灯点变灰色
    if (!lampPointList[line][lampIndex].getExtData()['status']) {
        lampPointList[line][lampIndex].setExtData({status: true});
        let flag = true;
        tempList.forEach(function (e) {
            if (e == lampIndex) {
                lampPointList[line][lampIndex].setIcon(multipleNormalIcon);
                flag = false;
            }
        })
        if (flag) {
            lampPointList[line][lampIndex].setIcon(normalIcon);
        }
    } else {
        lampPointList[line][lampIndex].setExtData({status: false});
        let flag = true;
        tempList.forEach(function (e) {
            if (e == lampIndex) {
                lampPointList[line][lampIndex].setIcon(multipleExceptionIcon);
                flag = false;
            }
        })
        if (flag) {
            lampPointList[line][lampIndex].setIcon(exceptionIcon);
        }
    }
}


let concentratorLoopPolylineA;
let concentratorLoopPolylineB;
/**
 * 临时绘制
 */
function tempPointAndLine() {
    //绘制综合设备箱
    for (let i in integratedEquipmentBoxPointA) {
        let markerBox = new AMap.Marker({
            position: new AMap.LngLat(integratedEquipmentBoxPointA[i]['x'], integratedEquipmentBoxPointA[i]['y']),
            offset: new AMap.Pixel(-15, -15),
            icon: integratedEquipmentBoxIconA
        })
        markerBox.setMap(map);
    }
    for (let i in integratedEquipmentBoxPointB) {
        let markerBox = new AMap.Marker({
            position: new AMap.LngLat(integratedEquipmentBoxPointB[i]['x'], integratedEquipmentBoxPointB[i]['y']),
            offset: new AMap.Pixel(-15, -15),
            icon: integratedEquipmentBoxIconB
        })
        markerBox.setMap(map);
    }
    //绘制集中器
    new AMap.Marker({
        position: new AMap.LngLat(concentratorPointA['x'], concentratorPointA['y']),
        offset: new AMap.Pixel(-15, -15),
        icon: concentratorA,
        map: map
    })
    new AMap.Marker({
        position: new AMap.LngLat(concentratorPointB['x'], concentratorPointB['y']),
        offset: new AMap.Pixel(-15, -15),
        icon: concentratorB,
        map: map
    })
    //绘制集中器到设备箱的线
    new AMap.Polyline({
        path: [[concentratorPointA['x'], concentratorPointA['y']], [integratedEquipmentBoxPointA[0]['x'], integratedEquipmentBoxPointA[0]['y']]],
        strokeColor: loopLineColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid",  //线样式
        map: map
    });
    new AMap.Polyline({
        path: [[concentratorPointA['x'], concentratorPointA['y']], [integratedEquipmentBoxPointB[0]['x'], integratedEquipmentBoxPointB[0]['y']]],
        strokeColor: loopLineColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid",  //线样式
        map: map
    });
    new AMap.Polyline({
        path: [[concentratorPointB['x'], concentratorPointB['y']], [integratedEquipmentBoxPointA[1]['x'], integratedEquipmentBoxPointA[1]['y']]],
        strokeColor: loopLineColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid",  //线样式
        map: map
    });
    new AMap.Polyline({
        path: [[concentratorPointB['x'], concentratorPointB['y']], [integratedEquipmentBoxPointB[1]['x'], integratedEquipmentBoxPointB[1]['y']]],
        strokeColor: loopLineColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid",  //线样式
        map: map
    });
    //绘制集中器到线点的线
    concentratorLoopPolylineA = new AMap.Polyline({
        path: [[concentratorPointA['x'], concentratorPointA['y']], [102.511855, 25.22456]],
        strokeColor: loopLineColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid",  //线样式
        map: map
    });
    concentratorLoopPolylineB = new AMap.Polyline({
        path: [[concentratorPointB['x'], concentratorPointB['y']], [102.512062, 25.224674]],
        strokeColor: loopLineColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 2,      //线宽
        strokeStyle: "solid",  //线样式
        map: map
    });

    // new AMap.Text({
    //     position: new AMap.LngLat(102.509345, 25.225864),
    //     label: {
    //         content:
    //             '<p>回路1</p>'
    //     },
    //     map: map
    // });
}

/**
 * 回路操作
 * @param index
 */
function closeLoop(line){
    if ($('#loop-'+line).attr("status") == "1") {
        //关闭
        $('#loop-'+line).attr("status", "0");
        $('#loop-'+line).val("开");

        //灯变灰
        for (let i in lampPointList[line]) {
            let flag = true;
            tempList.forEach(function (e) {
                if (e == i) {
                    lampPointList[line][i].setIcon(multipleOfflineIcon);
                    flag = false;
                }
            })
            if (flag) {
                lampPointList[line][i].setIcon(offlineIcon);
            }
        }
        //线路变灰
        for (let i in lineLoopList[line]) {
            lineLoopList[line][i].setOptions({
                strokeColor: offlineLoopLineColor
            });
        }
    } else {
        //开
        $('#loop-'+line).attr("status", "1");
        $('#loop-'+line).val("关");

        //灯恢复
        for (let i in lampPointList[line]) {
            let flag = true;
            tempList.forEach(function (e) {
                if (e == i) {
                    lampPointList[line][i].setIcon(multipleNormalIcon);
                    flag = false;
                }
            })
            if (flag) {
                lampPointList[line][i].setIcon(normalIcon);
            }
        }
        //线路恢复
        for (let i in lineLoopList[line]) {
            lineLoopList[line][i].setOptions({
                strokeColor: loopLineColor
            });
        }
    }

    //集中器到回路的线颜色判断
    concentratorLineJudge();
}

function concentratorLineJudge() {
    if ($('#loop-0').attr("status") == "0" && $('#loop-1').attr("status") == "0") {
        concentratorLoopPolylineA.setOptions({
            strokeColor: offlineLoopLineColor
        });
    } else {
        concentratorLoopPolylineA.setOptions({
            strokeColor: loopLineColor
        });
    }

    if ($('#loop-2').attr("status") == "0" && $('#loop-3').attr("status") == "0") {
        concentratorLoopPolylineB.setOptions({
            strokeColor: offlineLoopLineColor
        });
    } else {
        concentratorLoopPolylineB.setOptions({
            strokeColor: loopLineColor
        });
    }
}