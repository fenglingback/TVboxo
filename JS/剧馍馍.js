var rule = {
    title: '剧馍馍',
    host: 'https://www.jumomo.top',
    
    // ===== 搜索配置 =====
    searchUrl: '/vodsearch/-------------.html?wd=**',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    
    // ===== 请求头 =====
    headers: {
        'User-Agent': 'MOBILE_UA'
    },
    
    // ===== 播放解析 =====
    lazy: `js:
        // 提取播放器配置JSON
        var html = request(input);
        var jsonMatch = html.match(/var player_aaaa=(\\{.*?\\})<\\/script>/);
        if (!jsonMatch) {
            // 备用匹配方式
            jsonMatch = html.match(/player_aaaa[=:]\\s*(\\{.*?\\})[;,\\s]/);
        }
        
        if (jsonMatch) {
            var data = JSON.parse(jsonMatch[1]);
            var url = data.url;
            var from = data.from || '';
            var encrypt = data.encrypt || 0;
            
            // 根据加密类型解密
            if (encrypt === 1) {
                url = unescape(url);
            } else if (encrypt === 2) {
                url = unescape(base64Decode(url));
            } else if (encrypt === 3) {
                // AES加密，需要解密
                try {
                    url = unescape(base64Decode(url));
                } catch(e) {}
            }
            
            // 判断是否为直链
            if (/.m3u8|.mp4/.test(url)) {
                input = {
                    jx: 0,
                    url: url,
                    parse: 0,
                    header: JSON.stringify({
                        'referer': HOST,
                        'user-agent': 'Mozilla/5.0'
                    })
                };
            } else {
                // 非直链，需要通过播放器解析
                // 该站使用内嵌iframe方式，vid参数即为加密后的url
                input = {
                    jx: 0,
                    url: HOST + '/mmplay/index.php?vid=' + url,
                    parse: 1,
                    header: JSON.stringify({
                        'referer': HOST
                    })
                };
            }
        }
    `,
    
    limit: 6,
    
    // ===== 分类配置 =====
    class_name: '电影&剧集&综艺&动漫',
    class_url: '1&2&3&4',
    
    double: false,
    
    // ===== 页面解析规则 =====
    
    // 推荐（首页轮播）
    推荐: '.carousel .list;.stui-vodlist__thumb&&title;.stui-vodlist__thumb&&style;.pic-text&&Text;.stui-vodlist__thumb&&href',
    
    // 一级（列表页）
    // 格式: 容器;标题;图片;备注;链接
    一级: '.stui-vodlist__box;.stui-vodlist__thumb&&title;.stui-vodlist__thumb&&data-original;.pic-text&&Text;.stui-vodlist__thumb&&href',
    
    // 二级（详情页）
    二级: {
        'title': '.stui-content__detail h1.title&&Text;.data:eq(0)&&Text',
        'img': '.stui-content__thumb img&&data-original',
        'desc': '.stui-content__detail .data&&Text',
        'content': '.desc&&Text',
        'tabs': '.stui-pannel__head .title&&Text',
        'lists': '.stui-content__playlist:eq(#id)&&li&&a&&Text;.stui-content__playlist:eq(#id)&&li&&a&&href'
    },
    
    // 搜索
    搜索: '.stui-vodlist__box;.stui-vodlist__thumb&&title;.stui-vodlist__thumb&&data-original;.pic-text&&Text;.stui-vodlist__thumb&&href'
};