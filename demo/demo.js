const path = require('path');
const fs = require('fs');

const PDFDocument = require('pdfkit');
const pdfTable = require('../voilab-table');

const fontpath = path.resolve(__dirname, '../pdfRelay', 'PingFangMedium.ttf'),
    fontBoldPath = path.resolve(__dirname, '../pdfRelay', 'PingFangHeavy.ttf');

function createPdf() {
    const SIZE = [595.28, 841.89];  //a4宽高
    var doc = new PDFDocument({
        bufferPages: true,
        size: SIZE
    });

    doc.font(fontpath);
    const filtPath = path.resolve(__dirname, './', 'demo.pdf')
    doc.pipe(fs.createWriteStream(filtPath));
    let pagemargin = 60;

    doc.fontSize(16)
        .fillColor('#3399ff')
        .text("excel、word、ppt熟练程度统计", pagemargin)
        .moveDown();

    //添加表格
    doc.fontSize(9)
        .fillAndStroke('#ddd')
        .fillColor("#333");


    let width = (SIZE[0] - pagemargin * 2 - 35) / 5;
    let columns = [
        {
            id: "index",
            header: "序号",
            width: width,
        }, {
            id: "name",
            header: "姓名",
            width: width,
        }, {
            id: "excel",
            header: "excel",
            width: width,
        }, {
            id: "ppt",
            header: "ppt",
            width: width,
        }, {
            id: "word",
            header: "word",
            width: width,
        }
    ];
    let data = [
        {
            index: 1,
            name: "赵念一",
            excel: "精通",
            ppt: "一般",
            word: "一般"
        },
        {
            index: 2,
            name: "钱念二",
            excel: "熟练",
            ppt: "精通",
            word: "一般"
        },
        {
            index: 3,
            name: "孙念三",
            excel: "熟练",
            ppt: "一般",
            word: "精通"
        },
        {
            index: 4,
            name: "李念四",
            excel: "一般",
            ppt: "一般",
            word: "精通"
        },
    ];
    let table = new pdfTable(doc, { bottomMargin: 0 });
    table
        .setColumnsDefaults({
            headerBorder: ['L', 'T', 'B', 'R'],
            headerPadding: [5, 5, 5, 5],
            lineGap: 5,
            characterSpacing: 1,
            border: ['L', 'T', 'B', 'R'],
            align: 'left',
            padding: [5, 5, 5, 5],
            //若无headerStyles，header与commonStyles保持一致
            headerStyles: {
                headerBottomColor: "#409eff",
                color: "#333",
                borderWidth: 1,//
                borderBtoomWidth: 2,
                borderBtoomColor: "#3399ff",
                backgroundColor: "#F5F7FA",
                fontSize: 12,
                fontWeight: "bold"
            },
            commonStyles: {
                color: "#333",//默认 #333
                borderWidth: 1,//默认 1
                borderColor: "#ddd",
                backgroundColor: "#fff",//默认 "#fff"
                fontSize: 10,
                fontWeight: "normal"//默认 normal
            },
        })
        .addColumns(columns)
        .onPageAdded(function (tb) {
            tb.addHeader();
        });
    table.addBody(data);
    doc.moveDown(4);


    let i;
    let end;
    //默认左侧文字 右侧logo
    let leftText = "测试专用",
        rightText = "第一页表格";
    let rightw = SIZE[0] - pagemargin;
    const range = doc.bufferedPageRange();
    for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
        //页码
        doc.switchToPage(i);
        doc.fontSize(10)
            .fillColor('#333')
            .text(`${i + 1} / ${range.count}`, 198, 755, {
                width: 200,
                align: 'center',
            });

        //页眉左侧
        if (leftText) {
            doc.fontSize(12)
                .fillColor('#3399ff')
                .text(leftText, pagemargin, 20);
        }

        //页眉右侧
        if (rightText) {
            doc.fontSize(12)
                .fillColor('#3399ff')
                .text(rightText, 0, 20, {
                    align: 'right'
                });
        }

        //线条
        doc.moveTo(pagemargin, 45)
            .lineTo(rightw, 45)
            .fillAndStroke('#eee')
            .stroke();

    };

    // doc.flushPages();
    doc.end();
}
createPdf();