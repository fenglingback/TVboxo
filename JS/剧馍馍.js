var rule = {
    title: '剧馍馍',
    编码: 'utf-8',
    host: 'https://www.jumomo.top',
    homeUrl: '/',
    url: '/vodshow/fyclass--------fypage---.html',
    detailUrl: '/voddetail/fyid.html',
    searchUrl: '/vodsearch/-------------.html?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    timeout: 5000,
    
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    
    // 首页推荐显示数量
    limit: 6,
    double: false,
    
    // 线路过滤和排序
    tab_exclude: '猜你喜欢',
    tab_order: ['自营b', '自营c', '自营d', '自营e', '自营f'],
    tab_rename: {
        '自营b': 'B线',
        '自营c': 'C线', 
        '自营d': 'D线',
        '自营e': 'E线',
        '自营f': 'F线',
        'FF有广': 'FF线',
        'LZ有广': 'LZ线',
        'BF有广': 'BF线',
        'YZ有广': 'YZ线'
    },
    
    // 服务器解析播放
    play_parse: true,
    play_json: [{
        re: '*',
        json: {
            jx: 0,
            parse: 1
        }
    }],
    
    // 自定义免嗅
    lazy: `js:
        let html = request(input);
        let json = html.match(/var player_aaaa=(\\{.*?\\})<\\/script>/);
        if (json) {
            let data = JSON.parse(json[1]);
            let url = data.url;
            let from = data.from || '';
            let encrypt = data.encrypt || 0;
            
            // 根据加密类型解密 (该站url是多重的base64加密)
            if (encrypt === 1) {
                url = unescape(url);
            } else if (encrypt === 2) {
                url = unescape(base64Decode(url));
            } else if (encrypt === 3) {
                url = unescape(base64Decode(url));
            }
            
            // 检测是否为直链
            if (/m3u8|mp4/.test(url)) {
                input = {
                    jx: 0,
                    url: url,
                    parse: 0
                };
            } else {
                // 非直链使用iframe播放地址
                input = {
                    jx: 0,
                    url: HOST + '/mmplay/index.php?vid=' + data.url,
                    parse: 1
                };
            }
        }
    `,
    
    // 首页推荐
    推荐: '.stui-vodlist li;.stui-vodlist__thumb&&title;.stui-vodlist__thumb&&data-original;.pic-text&&Text;.stui-vodlist__thumb&&href',
    
    // 一级列表
    一级: '.stui-vodlist li;.stui-vodlist__thumb&&title;.stui-vodlist__thumb&&data-original;.pic-text&&Text;.stui-vodlist__thumb&&href',
    
    // 二级详情
    二级: {
        title: '.stui-content__detail h1.title&&Text;.data--span:eq(0)&&Text',
        img: '.stui-content__thumb img&&data-original',
        desc: '.stui-content__detail .data:eq(2)&&Text;.stui-content__detail .data:eq(1)&&Text;.stui-content__detail .data:eq(4)&&Text;.stui-content__detail .data:eq(3)&&Text;.stui-content__detail .data:eq(5)&&Text',
        content: '.desc&&Text',
        tabs: '.stui-pannel__head .title&&Text',
        tab_text: 'body&&Text',
        lists: '.stui-content__playlist:eq(#id)&&li',
        list_text: 'a&&Text',
        list_url: 'a&&href'
    },
    
    // 搜索
    搜索: '.stui-vodlist__media li;.stui-vodlist__thumb&&title;.stui-vodlist__thumb&&data-original;.text-muted&&Text;a&&href',
    
    // 嗅探配置
    sniffer: 1,
    isVideo: "http((?!http).){26,}\\.(m3u8|mp4|flv|avi|mkv)"
};
